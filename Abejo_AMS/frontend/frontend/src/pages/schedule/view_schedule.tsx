"use client"

import { useState, useEffect } from "react"
import { scheduleAPI } from "../../services/api"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"
import Breadcrumb from "../../components/breadcrums"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const ViewSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const appointmentsPerPage = 5

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      console.log("📅 Fetching schedule data...")
      const response = await scheduleAPI.getAll()
      console.log("📅 Schedule data fetched:", response.data)
      setAppointments(response.data || [])
    } catch (error) {
      console.error("❌ Error fetching schedule:", error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = direction === "prev" ? prev - 1 : prev + 1
      if (newMonth < 0) {
        setCurrentYear((year) => year - 1)
        return 11
      }
      if (newMonth > 11) {
        setCurrentYear((year) => year + 1)
        return 0
      }
      return newMonth
    })
  }

  const handleDayClick = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateString)
    setCurrentPage(1) // Reset to first page when selecting new date
  }

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

  // Get appointments for a specific date
  const getAppointmentsForDate = (dateString: string) => {
    return appointments.filter((a) => {
      const appointmentDate = a.date || a.appointmentDate
      return extractDate(appointmentDate) === dateString
    })
  }

  // Get the actual number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Pagination logic for modal
  const getPaginatedAppointments = (dayAppointments: any[]) => {
    const startIndex = (currentPage - 1) * appointmentsPerPage
    const endIndex = startIndex + appointmentsPerPage
    return dayAppointments.slice(startIndex, endIndex)
  }

  const getTotalPages = (totalAppointments: number) => {
    return Math.ceil(totalAppointments / appointmentsPerPage)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content bg-gray-50 min-h-screen p-10">
        <div className="container mx-auto bg-white rounded-lg p-6 border border-gray-300">
          <Breadcrumb
            title="Manage Appointments"
            links={[{ text: "My appointments", link: "/schedule" }]}
            active="Calendar View"
            buttons={
              <div className="flex gap-2">
                
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-blue-800 font-medium">Total: {appointments.length} appointments</span>
                </div>
              </div>
            }
          />

          {loading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>🔄 Loading
                schedule...
              </div>
            </div>
          )}

          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleMonthChange("prev")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-blue-400 transition font-semibold"
              disabled={loading}
            >
              ← Prev
            </button>
            <h2 className="text-3xl font-bold text-gray-700">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={() => handleMonthChange("next")}
              className="px-4 py-2 bg-blue-300 rounded-md hover:bg-blue-400 transition font-semibold"
              disabled={loading}
            >
              Next →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 bg-blue-300 p-3 rounded-lg text-center">
            {weekDays.map((day, index) => (
              <div key={index} className="text-lg font-semibold text-white bg-blue-300 rounded-md p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg border border-gray-300">
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNumber = index + 1
              const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`
              const dailyAppointments = getAppointmentsForDate(dateString)

              let bgColor = "bg-gray-100"
              if (dailyAppointments.length > 0) {
                if (dailyAppointments.length <= 2) bgColor = "bg-green-300"
                else if (dailyAppointments.length <= 4) bgColor = "bg-yellow-300"
                else bgColor = "bg-red-400"
              }

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(dayNumber)}
                  className={`border p-5 text-center rounded-md border-gray-300 hover:bg-gray-200 cursor-pointer transition ${bgColor}`}
                >
                  <span className="font-semibold text-gray-700">{dayNumber}</span>
                  {dailyAppointments.length > 0 && (
                    <div className="mt-2 text-xs font-medium text-gray-800">
                      {dailyAppointments.length >= 5
                        ? "Fully Booked"
                        : `${dailyAppointments.length} patient${dailyAppointments.length !== 1 ? "s" : ""}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* No appointments message */}
          {appointments.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2"></div>
              <p className="text-lg">No scheduled appointments found</p>
              <p className="text-sm">Complete appointments in the pending list to see them here</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Viewing Appointments */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-90 max-w-3xl max-h-[85vh] overflow-hidden">
            {/* Modal Header - Changed to Purple Theme */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                   Appointments for{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-black hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
              {(() => {
                const dayAppointments = getAppointmentsForDate(selectedDate)
                const totalPages = getTotalPages(dayAppointments.length)
                const paginatedAppointments = getPaginatedAppointments(dayAppointments)

                if (dayAppointments.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4"></div>
                      <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
                      <p className="text-sm">This day is available for new appointments.</p>
                    </div>
                  )
                }

                return (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{dayAppointments.length}</div>
                      <div className="text-purple-800 text-sm font-medium">
                        Patient{dayAppointments.length !== 1 ? "s" : ""} Scheduled
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Patient Details</h3>
                      {totalPages > 1 && (
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages} ({dayAppointments.length} total)
                        </div>
                      )}
                    </div>

                    {/* Appointments List */}
                    <div className="space-y-3">
                      {paginatedAppointments.map((appt, index) => {
                        const actualIndex = (currentPage - 1) * appointmentsPerPage + index
                        return (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-md"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {(appt.patient || appt.patientName || appt.name || "?").charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg">
                                      {appt.patient || appt.patientName || appt.name || "Unknown Patient"}
                                    </h4>
                                    <p className="text-black text-sm">Patient #{actualIndex + 1}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-black">
                                  <div className="flex items-center gap-2">
                                    <span>🦷</span>
                                    <span className="font-medium">Treatment:</span>
                                    <span>
                                      {appt.type || appt.treatment || appt.selectedTreatment || "Not specified"}
                                    </span>
                                  </div>
                                  {appt.status && (
                                    <div className="flex items-center gap-2">
                                      <span></span>
                                      <span className="font-medium">Status:</span>
                                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {(appt.time || appt.appointmentTime) && (
                                <div className="text-center ml-4">
                                  <div className="bg-black text-purple-600 px-3 py-2 rounded-full font-bold">
                                    {appt.time || appt.appointmentTime}
                                  </div>
                                  <div className="text-xs text-black mt-1">Time</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 pt-4 border-t">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-purple-500 text-white hover:bg-purple-600"
                          }`}
                        >
                          ← Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                currentPage === page
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-purple-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-purple-500 text-white hover:bg-purple-600"
                          }`}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={() => setSelectedDate(null)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ViewSchedule