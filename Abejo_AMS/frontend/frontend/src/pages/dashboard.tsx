"use client"

import { useState, useEffect } from "react"
import Breadcrumb from "../components/breadcrums"
import Header from "../layouts/header"
import Sidemenu from "../layouts/sidemenu"
import MonthChart from "../components/MonthChart.tsx"
import { appointmentAPI, patientAPI, inventoryAPI, scheduleAPI } from "../services/api"

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    successfulAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    recentAppointments: [],
    lowStockItems: [],
    monthlyData: [],
  })
  const [loading, setLoading] = useState(true)

  // Helper function to extract date without timezone issues
  const extractDate = (dateTimeString) => {
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

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Calculate monthly revenue (estimated based on treatments)
  const calculateRevenue = (appointments) => {
    const treatmentPrices = {
      "Oral Prophylaxis": 1500,
      Restoration: 2500,
      Dentures: 15000,
      "Root Canal Treatment": 8000,
      Extraction: 1200,
      "Jacket Crown/Fixed Bridge": 12000,
      Braces: 25000,
      Veneers: 18000,
      Whitening: 5000,
      Retainers: 8000,
    }

    return appointments.reduce((total, apt) => {
      const price = treatmentPrices[apt.treatmentId] || 2000 // Default price
      return total + price
    }, 0)
  }

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log("📊 Fetching dashboard data...")

      // Fetch all data in parallel
      const [patientsRes, appointmentsRes, pendingRes, scheduleRes, inventoryRes] = await Promise.all([
        patientAPI.getAll().catch(() => ({ data: [] })),
        appointmentAPI.getAll().catch(() => ({ data: [] })),
        appointmentAPI.getPending().catch(() => ({ data: [] })),
        scheduleAPI.getAll().catch(() => ({ data: [] })),
        inventoryAPI.getAll().catch(() => ({ data: [] })),
      ])

      const patients = patientsRes.data || []
      const appointments = appointmentsRes.data || []
      const pendingAppointments = pendingRes.data || []
      const schedule = scheduleRes.data || []
      const inventory = inventoryRes.data || []

      console.log("📊 Dashboard data fetched:", {
        patients: patients.length,
        appointments: appointments.length,
        pending: pendingAppointments.length,
        schedule: schedule.length,
        inventory: inventory.length,
      })

      // Calculate today's appointments
      const today = getTodayDate()
      const todayAppointments = schedule.filter((apt) => extractDate(apt.date) === today)

      // Get recent appointments (last 5)
      const recentAppointments = [...appointments, ...pendingAppointments]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5)
        .map((apt) => ({
          id: apt.id,
          patient: apt.fullName || `${apt.firstName} ${apt.lastName}`,
          time: apt.appointmentTime || "N/A",
          treatment: apt.treatmentId || "N/A",
          status: apt.status || "pending",
        }))

      // Get low stock items (stock <= 15)
      const lowStockItems = inventory
        .filter((item) => item.stock <= 15)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)

      // Calculate successful appointments (completed)
      const successfulAppointments = schedule.filter((apt) => apt.status === "completed").length

      // Calculate monthly revenue
      const monthlyRevenue = calculateRevenue(schedule)

      // Prepare monthly data for chart - combine all appointment sources
      const allAppointments = [...appointments, ...pendingAppointments, ...schedule]
      const monthlyData = {}

      // Initialize all 12 months for current year
      const currentYear = new Date().getFullYear()
      for (let i = 1; i <= 12; i++) {
        const monthKey = `${currentYear}-${String(i).padStart(2, "0")}`
        monthlyData[monthKey] = 0
      }

      // Count appointments by month
      allAppointments.forEach((apt) => {
        const appointmentDate = apt.appointmentDate || apt.date
        if (appointmentDate) {
          const date = extractDate(appointmentDate)
          const month = date.substring(0, 7) // YYYY-MM
          if (month && month.length === 7 && month.startsWith(currentYear.toString())) {
            monthlyData[month] = (monthlyData[month] || 0) + 1
          }
        }
      })

      // Convert to array with month names
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const sortedMonthlyData = Object.entries(monthlyData)
        .map(([month, count]) => {
          const monthNum = Number.parseInt(month.split("-")[1]) - 1
          return {
            month: monthNames[monthNum],
            fullMonth: month,
            count: count,
          }
        })
        .sort((a, b) => a.fullMonth.localeCompare(b.fullMonth))

      setDashboardData({
        totalPatients: patients.length,
        totalAppointments: appointments.length + pendingAppointments.length,
        successfulAppointments,
        pendingAppointments: pendingAppointments.length,
        todayAppointments: todayAppointments.length,
        monthlyRevenue,
        recentAppointments,
        lowStockItems,
        monthlyData: sortedMonthlyData,
      })

      console.log("✅ Dashboard data processed successfully")
      console.log("📊 Monthly data:", sortedMonthlyData)
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Smaller StatCard component
  const StatCard = ({ title, value, icon, color, trend, trendValue, isLoading = false }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {isLoading ? <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div> : value}
            </p>
            {trend && !isLoading && (
              <div className="flex items-center">
                <i
                  className={`bi ${trend === "up" ? "bi-arrow-up" : "bi-arrow-down"} text-xs mr-1 ${
                    trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                ></i>
                <span className={`text-xs font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {trendValue}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color} flex-shrink-0`}>
            <i className={`${icon} text-lg text-white`}></i>
          </div>
        </div>
      </div>
    </div>
  )

  // Professional Chart Component matching the reference image
  const ProfessionalMonthlyChart = ({ data, isLoading }) => {
    if (isLoading) {
      return (
        <div className="h-96 flex items-center justify-center bg-white">
          <div className="animate-pulse text-gray-500">Loading appointment data...</div>
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center bg-white">
          <div className="text-center">
            <i className="bi bi-calendar-x text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500">No appointment data available</p>
          </div>
        </div>
      )
    }

    // Calculate max value for scaling (round up to nearest 10)
    const maxValue = Math.max(...data.map((d) => d.count))
    const chartMax = Math.ceil(maxValue / 10) * 10 || 60 // Default to 60 if no data

    // Generate Y-axis labels
    const yAxisLabels = []
    for (let i = 0; i <= chartMax; i += 15) {
      yAxisLabels.push(i)
    }

    return (
      <div className="bg-white p-6 h-96">
        {/* Chart Container */}
        <div className="relative h-full">
          {/* Y-axis and Grid Lines */}
          <div className="absolute left-0 top-0 h-full w-full">
            {/* Y-axis labels and horizontal grid lines */}
            {yAxisLabels.map((value, index) => {
              const yPosition = 100 - (value / chartMax) * 100
              return (
                <div key={index} className="absolute left-0 w-full" style={{ top: `${yPosition}%` }}>
                  {/* Y-axis label */}
                  <span className="absolute -left-8 -top-2 text-xs text-gray-500 font-medium">{value}</span>
                  {/* Horizontal grid line */}
                  <div className="w-full h-px bg-gray-200"></div>
                </div>
              )
            })}

            {/* Vertical grid lines */}
            {data.map((_, index) => {
              const xPosition = (index / (data.length - 1)) * 100
              return (
                <div
                  key={index}
                  className="absolute top-0 h-full w-px bg-gray-200"
                  style={{ left: `${xPosition}%` }}
                ></div>
              )
            })}
          </div>

          {/* Chart Bars */}
          <div className="absolute left-0 bottom-0 w-full h-full flex items-end justify-between px-4">
            {data.map((item, index) => {
              const barHeight = chartMax > 0 ? (item.count / chartMax) * 100 : 0
              const barWidth = `${Math.max(100 / data.length - 2, 8)}%` // Responsive width with minimum

              return (
                <div key={index} className="flex flex-col items-center" style={{ width: barWidth }}>
                  {/* Bar */}
                  <div
                    className="w-full bg-slate-600 hover:bg-slate-700 transition-colors duration-200 cursor-pointer relative group"
                    style={{
                      height: `${Math.max(barHeight, 0)}%`,
                      minHeight: item.count > 0 ? "4px" : "0px",
                    }}
                    title={`${item.month}: ${item.count} appointments`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.count} appointments
                    </div>
                  </div>

                  {/* Month label */}
                  <div className="mt-2 text-sm text-gray-600 font-medium">{item.month}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockColor = (stock) => {
    if (stock <= 5) return "text-red-600 bg-red-50"
    if (stock <= 15) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content bg-gray-50 min-h-screen">
        <div className="container-fluid p-6">
          <Breadcrumb />

          {/* Welcome Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome to Abejo Dental Clinic</h1>
                  <p className="text-black text-lg">
                    Today is{" "}
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-black mt-1">
  You have{" "}
  <span
    className={`font-bold ${
      dashboardData.todayAppointments === 0 ? "text-red-500" : "text-black"
    }`}
  >
    {dashboardData.todayAppointments}
  </span>{" "}
  appointments scheduled for today
</p>

                </div>
                <div className="hidden md:block">
                  <i className="bi bi-calendar-heart text-6xl text-amber-200"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Smaller Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Patients"
              value={dashboardData.totalPatients.toLocaleString()}
              icon="bi-people-fill"
              color="bg-blue-500"
              trend="up"
              trendValue="12"
              isLoading={loading}
            />
            <StatCard
              title="Total Appointments"
              value={dashboardData.totalAppointments.toLocaleString()}
              icon="bi-calendar-check-fill"
              color="bg-green-500"
              trend="up"
              trendValue="8"
              isLoading={loading}
            />
            <StatCard
              title="Successful Appointments"
              value={dashboardData.successfulAppointments.toLocaleString()}
              icon="bi-check-circle-fill"
              color="bg-emerald-500"
              trend="up"
              trendValue="15"
              isLoading={loading}
            />
            
          </div>

          {/* Main Content Grid - Properly Aligned */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Chart - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Monthly Appointments Overview</h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                        This Year
                      </button>
                      <button
                        onClick={fetchDashboardData}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="animate-pulse text-gray-500">Loading chart data...</div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <MonthChart data={dashboardData.monthlyData} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Takes 1/3 of the space */}
            <div className="space-y-6">
              {/* Today's Summary */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Today's Summary</h3>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-200 rounded-lg mr-3"></div>
                            <div className="w-20 h-3 bg-gray-200 rounded"></div>
                          </div>
                          <div className="w-6 h-3 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                            <i className="bi bi-calendar-day text-blue-600 text-sm"></i>
                          </div>
                          <span className="text-gray-700 text-sm">Today's Appointments</span>
                        </div>
                        <span className="font-bold text-gray-900">{dashboardData.todayAppointments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-yellow-100 rounded-lg mr-3">
                            <i className="bi bi-clock text-yellow-600 text-sm"></i>
                          </div>
                          <span className="text-gray-700 text-sm">Pending</span>
                        </div>
                        <span className="font-bold text-gray-900">{dashboardData.pendingAppointments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                            <i className="bi bi-check-circle text-green-600 text-sm"></i>
                          </div>
                          <span className="text-gray-700 text-sm">Completed</span>
                        </div>
                        <span className="font-bold text-gray-900">{dashboardData.successfulAppointments}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Low Stock Alert</h3>
                    <i className="bi bi-exclamation-triangle text-red-500"></i>
                  </div>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between">
                          <div>
                            <div className="w-20 h-3 bg-gray-200 rounded mb-1"></div>
                            <div className="w-12 h-2 bg-gray-200 rounded"></div>
                          </div>
                          <div className="w-12 h-5 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : dashboardData.lowStockItems.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.lowStockItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStockColor(item.stock)}`}>
                            {item.stock} left
                          </span>
                        </div>
                      ))}
                      <button className="w-full mt-3 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm">
                        Manage Inventory
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-check-circle text-green-500 text-xl mb-2"></i>
                      <p className="text-gray-500 text-sm">All items are well stocked!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments - Full Width */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mt-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Refresh Data"}
                </button>
              </div>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-12 h-3 bg-gray-200 rounded"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                      <div className="w-12 h-5 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : dashboardData.recentAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Patient</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Time</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Treatment</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentAppointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-amber-600 font-semibold text-xs">
                                  {appointment.patient.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900 text-sm">{appointment.patient}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-gray-700 text-sm">{appointment.time}</td>
                          <td className="py-2 px-3 text-gray-700 text-sm">{appointment.treatment}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status,
                              )}`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="bi bi-calendar-x text-gray-400 text-3xl mb-3"></i>
                  <p className="text-gray-500">No recent appointments found</p>
                  <p className="text-gray-400 text-sm">Add appointments to see them here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
