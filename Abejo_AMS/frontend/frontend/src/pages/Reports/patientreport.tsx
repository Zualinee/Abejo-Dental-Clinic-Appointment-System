"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { reportAPI } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"

const PatientReport: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    treatment: "",
    status: "",
    fromDate: "",
    toDate: ""
  })

  const fetchPatientReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getPatients()
      setPatients(response.data || [])
      setFilteredPatients(response.data || [])
    } catch (error) {
      console.error("Error fetching patient reports:", error)
      setPatients([])
      setFilteredPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatientReports()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, patients])

  const applyFilters = () => {
    let filtered = [...patients]

    if (filters.treatment) {
      filtered = filtered.filter(patient => 
        patient.treatment && patient.treatment.toLowerCase().includes(filters.treatment.toLowerCase())
      )
    }

    if (filters.status) {
      filtered = filtered.filter(patient => patient.status === filters.status)
    }

    if (filters.fromDate) {
      filtered = filtered.filter(patient => {
        const treatmentDate = new Date(patient.date)
        const fromDate = new Date(filters.fromDate)
        return treatmentDate >= fromDate
      })
    }

    if (filters.toDate) {
      filtered = filtered.filter(patient => {
        const treatmentDate = new Date(patient.date)
        const toDate = new Date(filters.toDate)
        return treatmentDate <= toDate
      })
    }

    setFilteredPatients(filtered)
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

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" }
  ]

  const resetFilters = () => {
    setFilters({
      treatment: "",
      status: "",
      fromDate: "",
      toDate: ""
    })
    setFilteredPatients(patients)
  }

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      if (filteredPatients.length === 0) {
        gridRef.current.innerHTML = `
          <div class="text-center py-8">
            <div class="text-gray-500 text-lg mb-2">📊 No patient treatment data found</div>
            <div class="text-sm text-gray-400">Complete appointments to see patient treatment reports here</div>
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
              let statusClass = "bg-gray-100 text-gray-800"
              if (status === "completed") statusClass = "bg-green-100 text-green-800"
              else if (status === "pending") statusClass = "bg-yellow-100 text-yellow-800"
              else if (status === "cancelled") statusClass = "bg-red-100 text-red-800"

              return html(
                `<span class="px-2 py-1 rounded text-sm ${statusClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`,
              )
            },
          },
        ],
        data: filteredPatients.map((patient, index) => [
          index + 1,
          patient.name,
          new Date(patient.date).toLocaleDateString(),
          patient.time,
          patient.treatment,
          patient.status,
        ]),
        pagination: { limit: 10, summary: false },
        search: true,
        sort: true,
      }).render(gridRef.current)
    }
  }, [filteredPatients])

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Patient Treatment Reports"
            links={[{ text: "Reports", link: "/reports" }]}
            active="Patient Reports"
            buttons={
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg no-print"
                >
                  Print Report
                </button>
                <div className="bg-blue-200 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">Total Treatments: {filteredPatients.length}</span>
                </div>
              </div>
            }
          />

          {/* Filter Section */}
          <div className="box mb-4 p-4 no-print">
            <div className="flex flex-wrap items-end gap-4">
              {/* Treatment Filter */}
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

              {/* Status Filter */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filters */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
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
                    <div className="text-center py-4">🔄 Loading patient reports...</div>
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
          body {
            background: white;
            font-size: 12pt;
          }
          .main-content {
            margin: 0;
            padding: 0;
          }
          .box-body {
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  )
}

export default PatientReport