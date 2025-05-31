"use client"

import type React from "react"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { appointmentAPI, testConnection } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"
import ProfileImage from "../../assets/avatar.png"
import swal from "sweetalert"

interface FormData {
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  gender: string
  contactNumber: string
  email: string
  date: string
  time: string
  treatmentId: string
  photo?: File | null
}

const initialFormData: FormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  gender: "",
  contactNumber: "",
  email: "",
  date: "",
  time: "",
  treatmentId: "",
  photo: null,
}

const timeOptions = [
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
]

const Appointment_List: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [imagePreview, setImagePreview] = useState<string>(ProfileImage)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  const extractDate = (dateTimeString: string) => {
    if (!dateTimeString) return ""

    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateTimeString
    }

    if (dateTimeString.includes("T")) {
      return dateTimeString.split("T")[0]
    }

    try {
      const date = new Date(dateTimeString)
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const day = String(date.getUTCDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error("Error parsing date:", dateTimeString, error)
      return ""
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testConnection()
        setConnectionStatus("connected")
        console.log("✅ Backend connection successful")
      } catch (error) {
        setConnectionStatus("disconnected")
        console.error("❌ Backend connection failed:", error)
      }
    }

    checkConnection()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      console.log("📋 Fetching appointments...")
      const response = await appointmentAPI.getAll()
      console.log("📋 Appointments fetched:", response.data)
      setAppointments(response.data || [])
    } catch (error) {
      console.error("❌ Error fetching appointments:", error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAppointment = async (appointmentId: number) => {
    try {
      console.log(`✅ Attempting to confirm appointment: ${appointmentId}`)

      if (!appointmentId || isNaN(appointmentId)) {
        swal("Error!", "Invalid appointment ID", "error")
        return
      }

      const confirmed = await swal({
        title: "Confirm Appointment?",
        text: "Are you sure you want to confirm this appointment? It will be moved to the pending list.",
        icon: "question",
        buttons: {
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            className: "btn btn-secondary",
          },
          confirm: {
            text: "Yes, Confirm",
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
      const response = await appointmentAPI.confirm(appointmentId)
      console.log("✅ Confirm response:", response.data)

      if (response.data.success) {
        swal("Success!", "Appointment confirmed successfully! It has been moved to the pending list.", "success")
        await fetchAppointments()
      } else {
        swal("Error!", response.data.error || "Failed to confirm appointment", "error")
      }
    } catch (error: any) {
      console.error("❌ Error confirming appointment:", error)
      const errorMessage = error.response?.data?.error || error.message || "Network error occurred"
      swal("Error!", "Error confirming appointment: " + errorMessage, "error")
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

      const confirmed = await swal({
        title: "Cancel Appointment?",
        text: "Are you sure you want to cancel this appointment? This action cannot be undone.",
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
        await fetchAppointments()
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
      setFormData({ ...formData, photo: file })
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(ProfileImage)
    setFormData({ ...formData, photo: null })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      console.log("📝 Submitting appointment form...")

      const submitData = new FormData()
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof FormData]
        if (value !== null && value !== "") {
          submitData.append(key, value as string | Blob)
        }
      })

      const response = await appointmentAPI.create(submitData)
      console.log("📝 Create response:", response.data)

      if (response.data.success) {
        swal("Success!", "Appointment added successfully!", "success")
        setShowModal(false)
        setFormData(initialFormData)
        setImagePreview(ProfileImage)
        await fetchAppointments()
      } else {
        swal("Error!", response.data.error || "Failed to add appointment", "error")
      }
    } catch (error: any) {
      console.error("❌ Error adding appointment:", error)
      const errorMessage = error.response?.data?.error || error.message || "Network error occurred"
      swal("Error!", "Error adding appointment: " + errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connectionStatus === "connected") {
      fetchAppointments()
    }
  }, [connectionStatus])

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      console.log("🔄 Rendering grid with appointments:", appointments)

      if (appointments.length === 0) {
        gridRef.current.innerHTML = '<div class="text-center py-4 text-gray-500">No appointments found</div>'
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
          {
            name: "Confirmation",
            width: "100px",
            formatter: (_, row) => {
              const appointmentIndex = Number.parseInt(row.cells[0].data.split(".")[0]) - 1
              const appointment = appointments[appointmentIndex]
              const appointmentId = appointment?.id

              console.log(`🔧 Creating buttons for appointment ${appointmentIndex}:`, appointment)

              return html(`
              <div class="flex justify-center">
                <div class="flex gap-2 p-2">
                  <button 
                    class="bg-green-500 hover:bg-green-600 border-2 border-white rounded-full w-12 h-12 flex items-center justify-center shadow-md transition-all duration-200 transform hover:scale-105"
                    data-action="confirm"
                    data-id="${appointmentId}"
                    data-index="${appointmentIndex}"
                    style="cursor: pointer; outline: none;"
                    title="Confirm Appointment"
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
          extractDate(apt.appointmentDate),
          apt.appointmentTime,
        ]),
        pagination: { limit: 5, summary: false },
        search: true,
      }).render(gridRef.current)
    }
  }, [appointments])

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

        console.log("🖱️ Button clicked:", { action, id, index, button })

        if (id && !isNaN(Number.parseInt(id))) {
          const appointmentId = Number.parseInt(id)
          const appointmentIndex = Number.parseInt(index || "0")
          const appointment = appointments[appointmentIndex]

          console.log("🎯 Processing action:", { action, appointmentId, appointment })

          if (action === "confirm") {
            handleConfirmAppointment(appointmentId)
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
          {connectionStatus === "disconnected" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>❌ Backend Connection Failed!</strong>
              <p>Make sure the backend server is running on http://localhost:3001</p>
              <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-3 py-1 rounded mt-2">
                Retry Connection
              </button>
            </div>
          )}

          <Breadcrumb
            title="Manage Appointments"
            links={[{ text: "Dashboard", link: "/appointments" }]}
            active="Appointments"
            buttons={
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                  disabled={loading || connectionStatus !== "connected"}
                >
                  <i className="ri-add-line"></i> Add Appointment
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5">
                  {connectionStatus === "checking" ? (
                    <div className="text-center py-4">🔄 Checking connection...</div>
                  ) : connectionStatus === "disconnected" ? (
                    <div className="text-center py-4 text-red-500">❌ Backend disconnected</div>
                  ) : loading ? (
                    <div className="text-center py-4">🔄 Loading...</div>
                  ) : (
                    <div ref={gridRef}></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-md max-w-3xl relative" style={{ height: "80vh" }}>
                <div className="sticky rounded-lg top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Walk-In Patient Registration</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <div className="p-6 overflow-y-auto" style={{ height: "calc(80vh - 56px)" }}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4 flex items-start gap-4">
                      <span className="avatar avatar-xxl">
                        <img src={imagePreview || "/placeholder.svg"} alt="Profile" id="profile-img" />
                      </span>
                      <div>
                        <label className="block font-medium mb-2">Profile Picture</label>
                        <div className="flex gap-2">
                          <label className="bg-green-300 text-dark px-4 py-2 rounded-full cursor-pointer">
                            <i className="bi bi-upload"></i>
                            <span className="px-2">Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                          <button
                            type="button"
                            className="bg-red-300 px-4 py-2 rounded-full"
                            onClick={handleRemoveImage}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <hr className="mt-3 mb-4" />
                    <h2 className="font-bold text-lg mb-4">Patient's Information</h2>
                    <hr className="mt-3 mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["firstName", "middleName", "lastName", "suffix", "gender", "contactNumber", "email"].map(
                        (field, index) => (
                          <div key={index}>
                            <label className="block font-medium mb-1 capitalize" htmlFor={field}>
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type={field === "email" ? "email" : "text"}
                              id={field}
                              name={field}
                              value={formData[field as keyof FormData] as string}
                              onChange={handleChange}
                              className="ti-form-input rounded-sm"
                            />
                          </div>
                        ),
                      )}
                    </div>

                    <hr className="mt-3 mb-4" />
                    <h2 className="font-bold text-lg mb-4">Appointment Details</h2>
                    <hr className="mt-3 mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-1" htmlFor="date">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="ti-form-input rounded-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1" htmlFor="time">
                          Time
                        </label>
                        <select
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="ti-form-input rounded-sm"
                          required
                        >
                          <option value="">Select Time</option>
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Treatment</label>
                        <select
                          name="treatmentId"
                          value={formData.treatmentId}
                          onChange={handleChange}
                          className="ti-form-input rounded-sm"
                          required
                        >
                          <option value="">Select Dental Procedure</option>
                          <option value="Oral Prophylaxis">Oral Prophylaxis</option>
                          <option value="Restoration">Restoration</option>
                          <option value="Dentures">Dentures</option>
                          <option value="Root Canal Treatment">Root Canal Treatment</option>
                          <option value="Extraction">Extraction</option>
                          <option value="Jacket Crown/Fixed Bridge">Jacket Crown/Fixed Bridge</option>
                          <option value="Braces">Braces</option>
                          <option value="Veneers">Veneers</option>
                          <option value="Whitening">Whitening</option>
                          <option value="Retainers">Retainers</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        type="reset"
                        className="bg-blue-400 text-white px-4 py-2 rounded-full"
                        onClick={() => setFormData(initialFormData)}
                        disabled={loading}
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-full"
                        disabled={loading}
                      >
                        <i className="bi bi-save"></i>
                        <span className="px-3">{loading ? "Submitting..." : "Submit Appointment"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default Appointment_List 