
"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { patientAPI } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"
import ProfileImage from "../../assets/avatar.png"

const Patient_List: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // FIXED: Function to extract date from datetime string without timezone issues
  const extractDate = (dateTimeString: string) => {
    if (!dateTimeString) return ""

    // If it's already in YYYY-MM-DD format, return as is
    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateTimeString
    }

    // For datetime strings like "2025-06-02T16:00:00.000Z"
    if (dateTimeString.includes("T")) {
      // Extract just the date part before 'T' to avoid timezone issues
      return dateTimeString.split("T")[0]
    }

    // For other date formats, try to parse and format consistently using UTC
    try {
      const date = new Date(dateTimeString)
      // Use UTC methods to avoid timezone conversion
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const day = String(date.getUTCDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error("Error parsing date:", dateTimeString, error)
      return ""
    }
  }

  const fetchPatients = async () => {
    try {
      setLoading(true)
      console.log("👥 Fetching patients data...")
      const response = await patientAPI.getAll()
      console.log("👥 Patients data fetched:", response.data)
      setPatients(response.data || [])
    } catch (error) {
      console.error("❌ Error fetching patients:", error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      console.log("🔄 Rendering patients grid with data:", patients)

      if (patients.length === 0) {
        gridRef.current.innerHTML = `
          <div class="text-center py-8">
            <div class="text-gray-500 text-lg mb-2">👥 No patients found</div>
            <div class="text-sm text-gray-400">Complete appointments in the pending list to add patients here</div>
          </div>
        `
        return
      }

      new Grid({
        columns: [
          { name: "#", width: "50px" },
          {
            name: "Name",
            width: "200px",
            formatter: (_, row) =>
              html(`
                <div class="flex items-center gap-2">
                  <img src="${ProfileImage}" alt="Avatar" class="w-8 h-8 rounded-full" />
                  <span>${row.cells[1].data}</span>
                </div>
              `),
          },
          { name: "Gender", width: "80px" },
          { name: "Contact", width: "120px" },
          { name: "Email", width: "180px" },
          { name: "Last Treatment", width: "150px" },
          { name: "Last Visit", width: "120px" },
        ],
        data: patients.map((patient, index) => [
          index + 1,
          patient.fullName || `${patient.firstName} ${patient.lastName}`,
          patient.gender || "N/A",
          patient.contactNumber || "N/A",
          patient.email || "N/A",
          patient.selectedTreatment || "N/A",
          patient.appointmentDate ? extractDate(patient.appointmentDate) : "N/A", // FIXED: Use timezone-safe date extraction
        ]),
        pagination: { limit: 10, summary: false },
        search: true,
        sort: true,
      }).render(gridRef.current)
    }
  }, [patients])

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Patient List"
            links={[{ text: "Dashboard", link: "/patients" }]}
            active="Patients"
            buttons={
              <div className="flex gap-2">
                
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">Total Patients: {patients.length}</span>
                </div>
              </div>
            }
          />

          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5">
                  {loading ? <div className="text-center py-4">🔄 Loading patients...</div> : <div ref={gridRef}></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Patient_List
