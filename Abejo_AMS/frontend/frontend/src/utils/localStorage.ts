// Utility functions for localStorage operations
export interface AppointmentData {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  gender?: string
  contactNumber: string
  email?: string
  date: string
  time: string
  treatmentId: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  photo?: string
  createdAt: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  createdAt: string
}

export interface PatientRecord {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  age?: string
  gender?: string
  contactNumber: string
  email?: string
  treatmentId: string
  date: string
  time: string
  status: string
  createdAt: string
}

// Appointment localStorage functions
export const saveAppointment = (appointment: Omit<AppointmentData, "id" | "createdAt">) => {
  const appointments = getAppointments()
  const newAppointment: AppointmentData = {
    ...appointment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  appointments.push(newAppointment)
  localStorage.setItem("appointments", JSON.stringify(appointments))
  return newAppointment
}

export const getAppointments = (): AppointmentData[] => {
  const stored = localStorage.getItem("appointments")
  return stored ? JSON.parse(stored) : []
}

export const updateAppointmentStatus = (id: string, status: AppointmentData["status"]) => {
  const appointments = getAppointments()
  const updatedAppointments = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
  localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  return updatedAppointments
}

export const deleteAppointment = (id: string) => {
  const appointments = getAppointments()
  const filteredAppointments = appointments.filter((apt) => apt.id !== id)
  localStorage.setItem("appointments", JSON.stringify(filteredAppointments))
  return filteredAppointments
}

// Inventory localStorage functions
export const saveInventoryItem = (item: Omit<InventoryItem, "id" | "createdAt">) => {
  const inventory = getInventory()
  const newItem: InventoryItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  inventory.push(newItem)
  localStorage.setItem("inventory", JSON.stringify(inventory))
  return newItem
}

export const getInventory = (): InventoryItem[] => {
  const stored = localStorage.getItem("inventory")
  return stored ? JSON.parse(stored) : []
}

export const updateInventoryStock = (id: string, additionalStock: number) => {
  const inventory = getInventory()
  const updatedInventory = inventory.map((item) =>
    item.id === id ? { ...item, stock: item.stock + additionalStock } : item,
  )
  localStorage.setItem("inventory", JSON.stringify(updatedInventory))
  return updatedInventory
}

// Patient records localStorage functions
export const savePatientRecord = (patient: Omit<PatientRecord, "id" | "createdAt">) => {
  const patients = getPatientRecords()
  const newPatient: PatientRecord = {
    ...patient,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  patients.push(newPatient)
  localStorage.setItem("patientRecords", JSON.stringify(patients))
  return newPatient
}

export const getPatientRecords = (): PatientRecord[] => {
  const stored = localStorage.getItem("patientRecords")
  return stored ? JSON.parse(stored) : []
}

// Schedule localStorage functions
export const getScheduleByDate = (date: string): AppointmentData[] => {
  const appointments = getAppointments()
  return appointments.filter((apt) => apt.date === date && apt.status === "confirmed")
}
