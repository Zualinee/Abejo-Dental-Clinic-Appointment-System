"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { reportAPI } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"

const AppointmentReport: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    day: "",
    month: "",
    year: "",
    status: "", // Status filter is back
    treatment: "" // Treatment text filter
  })

  const fetchAppointmentReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getAppointments()
      setAppointments(response.data || [])
      setFilteredAppointments(response.data || [])
    } catch (error) {
      console.error("Error fetching appointment reports:", error)
      setAppointments([])
      setFilteredAppointments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointmentReports()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, appointments])

  const applyFilters = () => {
    let filtered = [...appointments]

    if (filters.day) {
      filtered = filtered.filter(apt => {
        const date = new Date(apt.date)
        return date.getDate().toString() === filters.day
      })
    }

    if (filters.month) {
      filtered = filtered.filter(apt => {
        const date = new Date(apt.date)
        return (date.getMonth() + 1).toString() === filters.month
      })
    }

    if (filters.year) {
      filtered = filtered.filter(apt => {
        const date = new Date(apt.date)
        return date.getFullYear().toString() === filters.year
      })
    }

    if (filters.status) {
      filtered = filtered.filter(apt => apt.status === filters.status)
    }

    if (filters.treatment) {
      filtered = filtered.filter(apt => 
        apt.treatment && apt.treatment.toLowerCase().includes(filters.treatment.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const treatmentProcedures = [
    { value: "", label: "All Treatments" },
    { value: "Oral Prophylaxis", label: "Oral Prophylaxis" },
    { value: "Restoration", label: "Restoration" },
    { value: "Dentures", label: "Dentures" },
    { value: "Root Canal Treatment", label: "Root Canal Treatment" },
    { value: "Extraction", label: "Extraction" },
    { value: "Jacket Crown/Fixed Bridge", label: "Jacket Crown/Fixed Bridge" },
    { value: "Braces", label: "Braces" },
    { value: "Veneers", label: "Veneers" },
    { value: "Whitening", label: "Whitening" },
    { value: "Retainers", label: "Retainers" }
  ]

  const resetFilters = () => {
    setFilters({
      day: "",
      month: "",
      year: "",
      status: "",
      treatment: ""
    })
    setFilteredAppointments(appointments)
  }

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      if (filteredAppointments.length === 0) {
        gridRef.current.innerHTML = 
          <div class="text-center py-8">
            <div class="text-gray-500 text-lg mb-2">📊 No appointment data found</div>
            <div class="text-sm text-gray-400">Add and process appointments to see reports here</div>
          </div>
        return
      }

      new Grid({
        columns: [
          { name: "#", width: "50px" },
          { name: "Patient Name", width: "200px" },
          { name: "Date", width: "120px" },
          { name: "Time", width: "100px" },
          { name: "Gender", width: "80px" },
          { name: "Treatment", width: "200px" },
          {
            name: "Status",
            width: "100px",
            formatter: (cell) => {
              const status = cell.toString()
              let statusClass = "bg-gray-100 text-gray-800"
              if (status === "completed") statusClass = "bg-green-100 text-green-800"
              else if (status === "confirmed") statusClass = "bg-blue-100 text-blue-800"
              else if (status === "cancelled") statusClass = "bg-red-100 text-red-800"

              return html(
                <span class="px-2 py-1 rounded text-sm ${statusClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>,
              )
            },
          },
        ],
        data: filteredAppointments.map((apt, index) => [
          index + 1,
          apt.name,
          new Date(apt.date).toLocaleDateString(),
          apt.time,
          apt.gender || "N/A",
          apt.treatment || "N/A",
          apt.status,
        ]),
        pagination: { limit: 10, summary: false },
        search: true,
        sort: true,
      }).render(gridRef.current)
    }
  }, [filteredAppointments])

  // Date filter options
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    { value: "1", label: "January" }, { value: "2", label: "February" },
    { value: "3", label: "March" }, { value: "4", label: "April" },
    { value: "5", label: "May" }, { value: "6", label: "June" },
    { value: "7", label: "July" }, { value: "8", label: "August" },
    { value: "9", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" },
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Appointment Reports"
            links={[{ text: "Reports", link: "/reports" }]}
            active="Appointment Reports"
            buttons={
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg no-print"
                >
                  Print Report
                </button>
                <div className="bg-blue-200 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">Total Appointments: {filteredAppointments.length}</span>
                </div>
              </div>
            }
          />

          {/* Filter Section */}
          <div className="box mb-4 p-4 no-print">
            <div className="flex flex-wrap items-end gap-4">
              {/* Date Filters */}
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  name="day"
                  value={filters.day}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Days</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Months</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
             
              
          <div className="flex-1 min-w-[220px]">
                <label className="block text-sm font-medium mb-1">Treatment</label>
                <select
                  name="treatment"
                  value={filters.treatment}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  {treatmentProcedures.map(procedure => (
                    <option key={procedure.value} value={procedure.value}>
                      {procedure.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Reset Button */}
              <div className="flex-1 min-w-[120px]">
                <button
                  onClick={resetFilters}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5">
                  {loading ? (
                    <div className="text-center py-4">🔄 Loading appointment reports...</div>
                  ) : (
                    <div ref={gridRef}></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default AppointmentReport