"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { appointmentAPI } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"
import ProfileImage from "../../assets/avatar.png"
import swal from "sweetalert"

const Pending_List: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [appointments, setAppointments] = useState<any[]>([])
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

  const fetchPendingAppointments = async () => {
    try {
      setLoading(true)
      console.log("📋 Fetching confirmed appointments for pending list...")
      const response = await appointmentAPI.getPending()
      console.log("📋 Confirmed appointments fetched:", response.data)
      setAppointments(response.data || [])
    } catch (error) {
      console.error("❌ Error fetching confirmed appointments:", error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteAppointment = async (appointmentId: number) => {
    try {
      console.log(`✅ Attempting to complete appointment: ${appointmentId}`)

      if (!appointmentId || isNaN(appointmentId)) {
        swal("Error!", "Invalid appointment ID", "error")
        return
      }

      // SweetAlert confirmation
      const confirmed = await swal({
        title: "Complete Appointment?",
        text: "Are you sure you want to complete this appointment? The patient will be added to patient records, history, and schedule.",
        icon: "question",
        buttons: {
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            className: "btn btn-secondary",
          },
          confirm: {
            text: "Yes, Complete",
            value: true,
            visible: true,
            className: "btn btn-success",
          },
        },
      })

      if (!confirmed) {
        return
      }

      setLoading(true)
      const response = await appointmentAPI.complete(appointmentId)
      console.log("✅ Complete response:", response.data)

      if (response.data.success) {
        swal(
          "Success!",
          "Appointment completed successfully!",
          "success",
        )
        await fetchPendingAppointments() // Refresh the list
      } else {
        swal("Error!", response.data.error || "Failed to complete appointment", "error")
      }
    } catch (error: any) {
      console.error("❌ Error completing appointment:", error)
      const errorMessage = error.response?.data?.error || error.message || "Network error occurred"
      swal("Error!", "Error completing appointment: " + errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      console.log(`🚫 Attempting to cancel appointment: ${appointmentId}`)

      if (!appointmentId || isNaN(appointmentId)) {
        swal("Error!", "Invalid appointment ID", "error")
        return
      }

      // SweetAlert confirmation
      const confirmed = await swal({
        title: "Cancel Appointment?",
        text: "Are you sure you want to cancel this confirmed appointment? This action cannot be undone.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Keep Appointment",
            value: false,
            visible: true,
            className: "btn btn-secondary",
          },
          confirm: {
            text: "Yes, Cancel",
            value: true,
            visible: true,
            className: "btn btn-danger",
          },
        },
        dangerMode: true,
      })

      if (!confirmed) {
        return
      }

      setLoading(true)
      const response = await appointmentAPI.cancel(appointmentId)
      console.log("🚫 Cancel response:", response.data)

      if (response.data.success) {
        swal("Cancelled!", "Appointment cancelled successfully!", "success")
        await fetchPendingAppointments() // Refresh the list
      } else {
        swal("Error!", response.data.error || "Failed to cancel appointment", "error")
      }
    } catch (error: any) {
      console.error("❌ Error cancelling appointment:", error)
      const errorMessage = error.response?.data?.error || error.message || "Network error occurred"
      swal("Error!", "Error cancelling appointment: " + errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingAppointments()
  }, [])

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      console.log("🔄 Rendering pending grid with appointments:", appointments)

      if (appointments.length === 0) {
        gridRef.current.innerHTML = '<div class="text-center py-4 text-gray-500">No confirmed appointments found</div>'
        return
      }

      new Grid({
        columns: [
          { name: "#", width: "10px" },
          {
            name: "Name",
            width: "150px",
            formatter: (_, row) =>
              html(`
                <div class="flex items-center gap-2">
                  <img src="${ProfileImage}" alt="Avatar" class="w-8 h-8 rounded-full" />
                  <span>${row.cells[1].data}</span>
                </div>
              `),
          },
          { name: "Selected Procedure", width: "150px" },
          { name: "Schedule", width: "100px" },
          { name: "Time", width: "100px" },
          { name: "Status", width: "100px" },
          {
            name: "Actions",
            width: "100px",
            formatter: (_, row) => {
              const appointmentIndex = Number.parseInt(row.cells[0].data.split(".")[0]) - 1
              const appointment = appointments[appointmentIndex]
              const appointmentId = appointment?.id

              return html(`
                <div class="flex justify-center">
                  <div class="flex gap-2 p-2">
                    <button 
                      class="bg-green-500 hover:bg-green-600 border-2 border-white rounded-full w-12 h-12 flex items-center justify-center shadow-md transition-all duration-200 transform hover:scale-105"
                      data-action="complete"
                      data-id="${appointmentId}"
                      data-index="${appointmentIndex}"
                      style="cursor: pointer; outline: none;"
                      title="Complete Appointment"
                    >
                      <i class="bi bi-check-lg text-white text-2xl pointer-events-none"></i>
                    </button>
                    <button 
                      class="bg-red-500 hover:bg-red-600 border-2 border-white rounded-full w-12 h-12 flex items-center justify-center shadow-md transition-all duration-200 transform hover:scale-105"
                      data-action="cancel"
                      data-id="${appointmentId}"
                      data-index="${appointmentIndex}"
                      style="cursor: pointer; outline: none;"
                      title="Cancel Appointment"
                    >
                      <i class="bi bi-x-lg text-white text-2xl pointer-events-none"></i>
                    </button>
                  </div>
                </div>
              `)
            },
          },
        ],
        data: appointments.map((apt, index) => [
          `${index + 1}.`,
          apt.fullName || `${apt.firstName} ${apt.lastName}`,
          apt.treatmentId,
          extractDate(apt.appointmentDate), // FIXED: Use timezone-safe date extraction
          apt.appointmentTime,
          "Confirmed",
        ]),
        pagination: { limit: 5, summary: false },
        search: true,
      }).render(gridRef.current)
    }
  }, [appointments])

  // Global event delegation for button clicks
  useEffect(() => {
    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement
      const button = target.closest("[data-action]") as HTMLElement

      if (button && !loading) {
        e.preventDefault()
        e.stopPropagation()

        const action = button.getAttribute("data-action")
        const id = button.getAttribute("data-id")
        const index = button.getAttribute("data-index")

        console.log("🖱️ Button clicked:", { action, id, index })

        if (id && !isNaN(Number.parseInt(id))) {
          const appointmentId = Number.parseInt(id)
          const appointmentIndex = Number.parseInt(index || "0")
          const appointment = appointments[appointmentIndex]

          console.log("🎯 Processing action:", { action, appointmentId, appointment })

          if (action === "complete") {
            handleCompleteAppointment(appointmentId)
          } else if (action === "cancel") {
            handleCancelAppointment(appointmentId)
          }
        } else {
          console.error("❌ Invalid appointment ID:", id)
          swal("Error!", "Invalid appointment ID: " + id, "error")
        }
      }
    }

    document.addEventListener("click", handleButtonClick)

    return () => {
      document.removeEventListener("click", handleButtonClick)
    }
  }, [appointments, loading])

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Confirmed Appointments"
            links={[{ text: "Dashboard", link: "/pending_appointment" }]}
            active="Pending Appointment"
            buttons={
              <div className="">
                
              </div>
            }
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5">
                  {loading ? <div className="text-center py-4">🔄 Loading...</div> : <div ref={gridRef}></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for better button visibility */}
      <style>{`
        .gridjs-wrapper button {
          pointer-events: auto !important;
          cursor: pointer !important;
          z-index: 10 !important;
          position: relative !important;
        }
        
        .gridjs-wrapper button:hover {
          transform: scale(1.05) !important;
        }
        
        .gridjs-td {
          overflow: visible !important;
        }

        .gridjs-wrapper [data-action] {
          border: none !important;
          outline: none !important;
        }
      `}</style>
    </>
  )
}

export default Pending_List
