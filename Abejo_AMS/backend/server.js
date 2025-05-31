import express from "express"
import mysql from "mysql2/promise"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import path from "path"

const app = express()
const PORT = process.env.PORT || 3001

// CORS - Allow all origins for development
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Create uploads directory
const uploadsDir = path.join(process.cwd(), "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use("/uploads", express.static(uploadsDir))

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
})
const upload = multer({ storage })

// FIXED: Database configuration with timezone handling
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Change this if you have a password
  database: "dental_clinic",
  charset: "utf8mb4",
  timezone: "+00:00", // Force UTC timezone
  dateStrings: true, // Return dates as strings to avoid automatic conversion
  supportBigNumbers: true,
  bigNumberStrings: true,
}

let db

// FIXED: Helper function to format dates consistently without timezone issues
const formatDate = (dateInput) => {
  if (!dateInput) return null

  // If it's already in YYYY-MM-DD format, return as is
  if (typeof dateInput === "string" && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateInput
  }

  // For datetime strings like "2025-06-02T16:00:00.000Z" or other formats
  try {
    let date

    if (typeof dateInput === "string") {
      // If it contains 'T', extract just the date part to avoid timezone conversion
      if (dateInput.includes("T")) {
        return dateInput.split("T")[0]
      }
      date = new Date(dateInput)
    } else {
      date = new Date(dateInput)
    }

    // Use UTC methods to avoid timezone conversion
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  } catch (error) {
    console.error("Error formatting date:", dateInput, error)
    return null
  }
}

// FIXED: Helper function to format datetime consistently
const formatDateTime = (dateString, timeString) => {
  const formattedDate = formatDate(dateString)
  if (!formattedDate) return null

  if (timeString) {
    return `${formattedDate} ${timeString}`
  }

  return `${formattedDate} 00:00:00`
}

// FIXED: Helper function to ensure consistent date output in API responses
const formatApiResponse = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => formatApiResponse(item))
  }

  if (data && typeof data === "object") {
    const formatted = { ...data }

    // Format common date fields
    if (formatted.appointmentDate) {
      formatted.appointmentDate = formatDate(formatted.appointmentDate)
    }
    if (formatted.treatmentDate) {
      formatted.treatmentDate = formatDate(formatted.treatmentDate)
    }
    if (formatted.date) {
      formatted.date = formatDate(formatted.date)
    }

    return formatted
  }

  return data
}

async function initializeDatabase() {
  try {
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      timezone: "+00:00", // Force UTC for initial connection too
    })

    await tempConnection.execute(
      "CREATE DATABASE IF NOT EXISTS dental_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    )
    await tempConnection.end()

    db = await mysql.createConnection(dbConfig)
    console.log("✅ Connected to MySQL database with UTC timezone")

    // Set session timezone to UTC
    await db.execute("SET time_zone = '+00:00'")

    await createTables()
    console.log("✅ Database initialization complete")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}

async function createTables() {
  try {
    // Patients table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        middleName VARCHAR(100),
        lastName VARCHAR(100) NOT NULL,
        suffix VARCHAR(20),
        gender VARCHAR(10),
        contactNumber VARCHAR(20),
        email VARCHAR(100),
        photo VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // FIXED: Appointments table with proper date handling
    await db.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patientId INT,
        firstName VARCHAR(100) NOT NULL,
        middleName VARCHAR(100),
        lastName VARCHAR(100) NOT NULL,
        suffix VARCHAR(20),
        gender VARCHAR(10),
        contactNumber VARCHAR(20),
        email VARCHAR(100),
        appointmentDate DATE NOT NULL,
        appointmentTime TIME NOT NULL,
        treatmentId VARCHAR(100) NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        photo VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_date (appointmentDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // Inventory table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category ENUM('Medicine', 'Supply', 'Equipment') NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // FIXED: Patient history table with proper date handling
    await db.execute(`
      CREATE TABLE IF NOT EXISTS patient_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patientId INT NOT NULL,
        appointmentId INT,
        treatmentDate DATE NOT NULL,
        treatmentTime TIME NOT NULL,
        treatment VARCHAR(200) NOT NULL,
        status ENUM('completed', 'cancelled') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // Insert sample inventory
    const [inventoryCount] = await db.execute("SELECT COUNT(*) as count FROM inventory")
    if (inventoryCount[0].count === 0) {
      await db.execute(`
        INSERT INTO inventory (name, category, stock) VALUES
        ('Toothpaste', 'Supply', 50),
        ('Anesthetic', 'Medicine', 20),
        ('Mouthwash', 'Supply', 35),
        ('Latex Gloves', 'Supply', 100),
        ('Dental Floss', 'Supply', 60)
      `)
      console.log("✅ Sample inventory data inserted")
    }

    console.log("✅ Database tables created successfully")
  } catch (error) {
    console.error("❌ Error creating tables:", error)
    throw error
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: db ? "Connected" : "Disconnected",
  })
})

// Test endpoint
app.get("/api/test", async (req, res) => {
  try {
    const [result] = await db.execute("SELECT 1 + 1 as result, NOW() as serverTime, UTC_TIMESTAMP() as utcTime")
    res.json({
      success: true,
      message: "Backend and database are working!",
      dbTest: result[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// APPOINTMENT ROUTES

// FIXED: Get pending appointments (for list.tsx)
app.get("/api/appointments", async (req, res) => {
  try {
    console.log("📋 Fetching pending appointments for list.tsx...")
    const [rows] = await db.execute(`
      SELECT 
        id, firstName, middleName, lastName, suffix, gender, contactNumber, email,
        DATE(appointmentDate) as appointmentDate, appointmentTime, treatmentId, status, photo, createdAt,
        CONCAT(
          firstName, 
          CASE WHEN middleName IS NOT NULL AND middleName != '' THEN CONCAT(' ', middleName) ELSE '' END,
          ' ', lastName
        ) as fullName 
      FROM appointments 
      WHERE status = 'pending'
      ORDER BY createdAt DESC
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} pending appointments`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching pending appointments:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// FIXED: Get confirmed appointments (for pending_list.tsx)
app.get("/api/appointments/pending", async (req, res) => {
  try {
    console.log("📋 Fetching confirmed appointments for pending_list.tsx...")
    const [rows] = await db.execute(`
      SELECT 
        id, firstName, middleName, lastName, suffix, gender, contactNumber, email,
        DATE(appointmentDate) as appointmentDate, appointmentTime, treatmentId, status, photo, createdAt,
        CONCAT(
          firstName, 
          CASE WHEN middleName IS NOT NULL AND middleName != '' THEN CONCAT(' ', middleName) ELSE '' END,
          ' ', lastName
        ) as fullName 
      FROM appointments 
      WHERE status = 'confirmed'
      ORDER BY appointmentDate, appointmentTime
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} confirmed appointments`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching confirmed appointments:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// FIXED: Create appointment
app.post("/api/appointments", upload.single("photo"), async (req, res) => {
  try {
    console.log("📝 Creating new appointment...")
    const { firstName, middleName, lastName, suffix, gender, contactNumber, email, date, time, treatmentId } = req.body

    if (!firstName || !lastName || !date || !time || !treatmentId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        required: ["firstName", "lastName", "date", "time", "treatmentId"],
      })
    }

    // FIXED: Format date before saving to database
    const formattedDate = formatDate(date)
    if (!formattedDate) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Please use YYYY-MM-DD format.",
      })
    }

    const photo = req.file ? req.file.filename : null

    const [result] = await db.execute(
      `
      INSERT INTO appointments (
        firstName, middleName, lastName, suffix, gender, 
        contactNumber, email, appointmentDate, appointmentTime, 
        treatmentId, photo, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
      [
        firstName,
        middleName || null,
        lastName,
        suffix || null,
        gender || null,
        contactNumber || null,
        email || null,
        formattedDate,
        time,
        treatmentId,
        photo,
      ],
    )

    console.log(`✅ Appointment created with ID: ${result.insertId}`)

    const [newAppointment] = await db.execute(
      `
      SELECT *, 
             DATE(appointmentDate) as appointmentDate,
             CONCAT(
               firstName, 
               CASE WHEN middleName IS NOT NULL AND middleName != '' THEN CONCAT(' ', middleName) ELSE '' END,
               ' ', lastName
             ) as fullName 
      FROM appointments WHERE id = ?
    `,
      [result.insertId],
    )

    // FIXED: Format response dates
    const formattedAppointment = formatApiResponse(newAppointment[0])

    res.json({
      success: true,
      message: "Appointment added successfully",
      appointmentId: result.insertId,
      appointment: formattedAppointment,
    })
  } catch (error) {
    console.error("❌ Error creating appointment:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Confirm appointment (moves from list.tsx to pending_list.tsx)
app.put("/api/appointments/:id/confirm", async (req, res) => {
  try {
    const appointmentId = Number.parseInt(req.params.id)
    console.log(`✅ Confirming appointment ID: ${appointmentId} (moving to pending_list.tsx)`)

    if (isNaN(appointmentId)) {
      return res.status(400).json({ success: false, error: "Invalid appointment ID" })
    }

    const [existing] = await db.execute("SELECT * FROM appointments WHERE id = ?", [appointmentId])
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: "Appointment not found" })
    }

    const [result] = await db.execute("UPDATE appointments SET status = ? WHERE id = ?", ["confirmed", appointmentId])

    res.json({
      success: true,
      message: "Appointment confirmed successfully - moved to pending list",
      appointmentId: appointmentId,
      affectedRows: result.affectedRows,
    })
  } catch (error) {
    console.error("❌ Error confirming appointment:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// FIXED: Complete appointment (moves from pending_list.tsx to patient records and schedule)
app.put("/api/appointments/:id/complete", async (req, res) => {
  try {
    const appointmentId = Number.parseInt(req.params.id)
    console.log(`✅ Completing appointment ID: ${appointmentId} (moving to patient records and schedule)`)

    const [appointment] = await db.execute(
      `
      SELECT *, DATE(appointmentDate) as appointmentDate 
      FROM appointments WHERE id = ?
    `,
      [appointmentId],
    )

    if (appointment.length === 0) {
      return res.status(404).json({ success: false, error: "Appointment not found" })
    }

    const apt = appointment[0]
    const formattedDate = formatDate(apt.appointmentDate)

    // Check if patient exists, if not create new patient
    let patientId
    const [existingPatient] = await db.execute(
      `
      SELECT id FROM patients WHERE firstName = ? AND lastName = ? AND contactNumber = ?
    `,
      [apt.firstName, apt.lastName, apt.contactNumber],
    )

    if (existingPatient.length > 0) {
      patientId = existingPatient[0].id
      console.log(`📋 Using existing patient ID: ${patientId}`)
    } else {
      // Create new patient
      const [patientResult] = await db.execute(
        `
        INSERT INTO patients (firstName, middleName, lastName, suffix, gender, contactNumber, email, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [apt.firstName, apt.middleName, apt.lastName, apt.suffix, apt.gender, apt.contactNumber, apt.email, apt.photo],
      )
      patientId = patientResult.insertId
      console.log(`👤 Created new patient ID: ${patientId}`)
    }

    // Update appointment status to completed
    await db.execute('UPDATE appointments SET status = "completed", patientId = ? WHERE id = ?', [
      patientId,
      appointmentId,
    ])

    // FIXED: Add to patient history with formatted date
    await db.execute(
      `
      INSERT INTO patient_history (patientId, appointmentId, treatmentDate, treatmentTime, treatment, status)
      VALUES (?, ?, ?, ?, ?, 'completed')
    `,
      [patientId, appointmentId, formattedDate, apt.appointmentTime, apt.treatmentId],
    )

    console.log(`✅ Appointment completed - added to patient records and history`)

    res.json({
      success: true,
      message: "Appointment completed successfully - added to patient records and schedule",
      appointmentId: appointmentId,
      patientId: patientId,
      appointmentDate: formattedDate,
    })
  } catch (error) {
    console.error("❌ Error completing appointment:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Cancel appointment
app.put("/api/appointments/:id/cancel", async (req, res) => {
  try {
    const appointmentId = Number.parseInt(req.params.id)
    console.log(`🚫 Cancelling appointment ID: ${appointmentId}`)

    if (isNaN(appointmentId)) {
      return res.status(400).json({ success: false, error: "Invalid appointment ID" })
    }

    const [existing] = await db.execute("SELECT * FROM appointments WHERE id = ?", [appointmentId])
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: "Appointment not found" })
    }

    const [result] = await db.execute("UPDATE appointments SET status = ? WHERE id = ?", ["cancelled", appointmentId])

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointmentId: appointmentId,
      affectedRows: result.affectedRows,
    })
  } catch (error) {
    console.error("❌ Error cancelling appointment:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// FIXED: PATIENT ROUTES
app.get("/api/patients", async (req, res) => {
  try {
    console.log("👥 Fetching all patients...")
    const [rows] = await db.execute(`
      SELECT p.*, 
             CONCAT(p.firstName, ' ', COALESCE(p.middleName, ''), ' ', p.lastName) as fullName,
             TIMESTAMPDIFF(YEAR, '1990-01-01', CURDATE()) as age,
             (SELECT treatment FROM patient_history ph WHERE ph.patientId = p.id ORDER BY ph.treatmentDate DESC LIMIT 1) as selectedTreatment,
             (SELECT DATE(treatmentDate) FROM patient_history ph WHERE ph.patientId = p.id ORDER BY ph.treatmentDate DESC LIMIT 1) as appointmentDate
      FROM patients p 
      ORDER BY p.createdAt DESC
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} patients`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching patients:", error)
    res.status(500).json({ error: error.message })
  }
})

// FIXED: Get patient history
app.get("/api/patients/history", async (req, res) => {
  try {
    console.log("📚 Fetching patient history...")
    const [rows] = await db.execute(`
      SELECT ph.*, 
             DATE(ph.treatmentDate) as treatmentDate,
             CONCAT(p.firstName, ' ', COALESCE(p.middleName, ''), ' ', p.lastName) as patientName
      FROM patient_history ph
      JOIN patients p ON ph.patientId = p.id
      ORDER BY ph.treatmentDate DESC, ph.treatmentTime DESC
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} history records`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching patient history:", error)
    res.status(500).json({ error: error.message })
  }
})

// FIXED: SCHEDULE ROUTES
app.get("/api/schedule", async (req, res) => {
  try {
    console.log("📅 Fetching schedule...")
    const [rows] = await db.execute(`
      SELECT 
        DATE(appointmentDate) as date, 
        treatmentId as type, 
        CONCAT(firstName, ' ', COALESCE(middleName, ''), ' ', lastName) as patient,
        appointmentTime as time,
        status
      FROM appointments 
      WHERE status IN ('confirmed', 'completed')
      ORDER BY appointmentDate, appointmentTime
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} scheduled appointments`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching schedule:", error)
    res.status(500).json({ error: error.message })
  }
})

// INVENTORY ROUTES
app.get("/api/inventory", async (req, res) => {
  try {
    console.log("📦 Fetching inventory...")
    const [rows] = await db.execute("SELECT * FROM inventory ORDER BY category, name")
    console.log(`✅ Found ${rows.length} inventory items`)
    res.json(rows)
  } catch (error) {
    console.error("❌ Error fetching inventory:", error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/inventory", async (req, res) => {
  try {
    console.log("📦 Adding inventory item...")
    const { name, category, stock } = req.body

    if (!name || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, category, stock",
      })
    }

    const [result] = await db.execute("INSERT INTO inventory (name, category, stock) VALUES (?, ?, ?)", [
      name,
      category,
      Number.parseInt(stock),
    ])

    // Get the created item
    const [newItem] = await db.execute("SELECT * FROM inventory WHERE id = ?", [result.insertId])

    console.log(`✅ Inventory item created with ID: ${result.insertId}`)
    res.json({
      success: true,
      message: "Inventory item added successfully",
      itemId: result.insertId,
      item: newItem[0],
    })
  } catch (error) {
    console.error("❌ Error adding inventory item:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put("/api/inventory/:id/stock", async (req, res) => {
  try {
    console.log(`📦 Updating stock for item ${req.params.id}...`)
    const { additionalStock } = req.body

    if (!additionalStock || isNaN(additionalStock)) {
      return res.status(400).json({
        success: false,
        error: "Invalid additional stock amount",
      })
    }

    const [result] = await db.execute("UPDATE inventory SET stock = stock + ? WHERE id = ?", [
      Number.parseInt(additionalStock),
      req.params.id,
    ])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Inventory item not found" })
    }

    console.log(`✅ Stock updated for item ${req.params.id}`)
    res.json({ success: true, message: "Stock updated successfully" })
  } catch (error) {
    console.error("❌ Error updating stock:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// FIXED: REPORT ROUTES
app.get("/api/reports/appointments", async (req, res) => {
  try {
    console.log("📊 Fetching appointment reports...")
    const [rows] = await db.execute(`
      SELECT 
        CONCAT(firstName, ' ', COALESCE(middleName, ''), ' ', lastName) as name, 
        DATE(appointmentDate) as date, 
        appointmentTime as time, 
        gender, 
        treatmentId as treatment,
        status
      FROM appointments 
      WHERE status IN ('confirmed', 'completed', 'cancelled')
      ORDER BY appointmentDate DESC
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} appointment records for report`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching appointment reports:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/reports/patients", async (req, res) => {
  try {
    console.log("📊 Fetching patient reports...")
    const [rows] = await db.execute(`
      SELECT 
        CONCAT(p.firstName, ' ', COALESCE(p.middleName, ''), ' ', p.lastName) as name, 
        DATE(ph.treatmentDate) as date, 
        ph.treatmentTime as time, 
        ph.treatment, 
        ph.status
      FROM patient_history ph
      JOIN patients p ON ph.patientId = p.id
      ORDER BY ph.treatmentDate DESC
    `)

    // FIXED: Format dates consistently in response
    const formattedRows = formatApiResponse(rows)

    console.log(`✅ Found ${formattedRows.length} patient records for report`)
    res.json(formattedRows)
  } catch (error) {
    console.error("❌ Error fetching patient reports:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/reports/inventory", async (req, res) => {
  try {
    console.log("📊 Fetching inventory reports...")
    const [rows] = await db.execute("SELECT name, category, stock FROM inventory ORDER BY category, name")
    console.log(`✅ Found ${rows.length} inventory items for report`)
    res.json(rows)
  } catch (error) {
    console.error("❌ Error fetching inventory reports:", error)
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err)
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  })
})

// 404 handler
app.use("*", (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
  })
})

// Start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`📅 Timezone: UTC (Fixed for consistent date handling)`)
    })
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  })
