"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { patientAPI } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"

const Patient_History: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<any[]>([])
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

  const fetchHistory = async () => {
    try {
      setLoading(true)
      console.log("📚 Fetching patient history...")
      const response = await patientAPI.getHistory()
      console.log("📚 Patient history fetched:", response.data)
      setHistory(response.data || [])
    } catch (error) {
      console.error("❌ Error fetching patient history:", error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      console.log("🔄 Rendering history grid with data:", history)

      if (history.length === 0) {
        gridRef.current.innerHTML = `
          <div class="text-center py-8">
            <div class="text-gray-500 text-lg mb-2">📚 No patient history found</div>
            <div class="text-sm text-gray-400">Complete appointments in the pending list to see treatment history here</div>
          </div>
        `
        return
      }

      new Grid({
        columns: [
          { name: "#", width: "50px" },
          { name: "Patient Name", width: "200px" },
          { name: "Treatment Date", width: "120px" },
          { name: "Treatment Time", width: "100px" },
          { name: "Treatment", width: "200px" },
          {
            name: "Status",
            width: "100px",
            formatter: (cell) => {
              const status = cell.toString()
              const statusClass = status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              return html(
                `<span class="px-2 py-1 rounded text-sm ${statusClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`,
              )
            },
          },
        ],
        data: history.map((record, index) => [
          index + 1,
          record.patientName,
          extractDate(record.treatmentDate), // FIXED: Use timezone-safe date extraction
          record.treatmentTime,
          record.treatment,
          record.status,
        ]),
        pagination: { limit: 10, summary: false },
        search: true,
        sort: true,
      }).render(gridRef.current)
    }
  }, [history])

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Patient History"
            links={[{ text: "Dashboard", link: "/patient-history" }]}
            active="Patient History"
            buttons={
              <div className="flex gap-2">
                
                <div className="bg-blue-200 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">Total Records: {history.length}</span>
                </div>
              </div>
            }
          />

          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5">
                  {loading ? (
                    <div className="text-center py-4">🔄 Loading patient history...</div>
                  ) : (
                    <div ref={gridRef}></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Patient_History
