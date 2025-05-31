"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Grid, html } from "gridjs"
import "gridjs/dist/theme/mermaid.css"
import { reportAPI } from "../../services/api"
import Breadcrumb from "../../components/breadcrums"
import Header from "../../layouts/header"
import Sidemenu from "../../layouts/sidemenu"

const InventoryReport: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [inventory, setInventory] = useState<any[]>([])
  const [filteredInventory, setFilteredInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    stockLevel: ""
  })

  const fetchInventoryReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getInventory()
      setInventory(response.data || [])
      setFilteredInventory(response.data || [])
    } catch (error) {
      console.error("Error fetching inventory reports:", error)
      setInventory([])
      setFilteredInventory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryReports()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, inventory])

  const applyFilters = () => {
    let filtered = [...inventory]

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    if (filters.stockLevel) {
      filtered = filtered.filter(item => {
        const stock = Number(item.stock)
        if (filters.stockLevel === "low") return stock <= 10
        if (filters.stockLevel === "medium") return stock > 10 && stock <= 25
        if (filters.stockLevel === "good") return stock > 25
        return true
      })
    }

    setFilteredInventory(filtered)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Medicine", label: "Medicine" },
    { value: "Supply", label: "Supply" },
    { value: "Equipment", label: "Equipment" }
  ]

  const stockLevels = [
    { value: "", label: "All Stock Levels" },
    { value: "low", label: "Low (≤10)" },
    { value: "medium", label: "Medium (11-25)" },
    { value: "good", label: "Good (>25)" }
  ]

  const resetFilters = () => {
    setFilters({
      category: "",
      stockLevel: ""
    })
    setFilteredInventory(inventory)
  }

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.innerHTML = ""

      if (filteredInventory.length === 0) {
        gridRef.current.innerHTML = `
          <div class="text-center py-8">
            <div class="text-gray-500 text-lg mb-2">📊 No inventory data found</div>
            <div class="text-sm text-gray-400">Add inventory items to see reports here</div>
          </div>
        `
        return
      }

      new Grid({
        columns: [
          { name: "#", width: "50px" },
          { name: "Item Name", width: "200px" },
          {
            name: "Category",
            width: "120px",
            formatter: (cell) => {
              const category = cell.toString()
              let categoryClass = "bg-gray-100 text-gray-800"
              if (category === "Medicine") categoryClass = "bg-blue-100 text-blue-800"
              else if (category === "Supply") categoryClass = "bg-green-100 text-green-800"
              else if (category === "Equipment") categoryClass = "bg-purple-100 text-purple-800"

              return html(`<span class="px-2 py-1 rounded text-sm ${categoryClass}">${category}</span>`)
            },
          },
          {
            name: "Stock Level",
            width: "120px",
            formatter: (cell) => {
              const stock = Number.parseInt(cell.toString())
              let stockClass = "text-green-600"
              let stockText = `${stock} (Good)`

              if (stock <= 10) {
                stockClass = "text-red-600 font-bold"
                stockText = `${stock} (Low!)`
              } else if (stock <= 25) {
                stockClass = "text-yellow-600 font-semibold"
                stockText = `${stock} (Medium)`
              }

              return html(`<span class="${stockClass}">${stockText}</span>`)
            },
          },
        ],
        data: filteredInventory.map((item, index) => [index + 1, item.name, item.category, item.stock]),
        pagination: { limit: 10, summary: false },
        search: true,
        sort: true,
      }).render(gridRef.current)
    }
  }, [filteredInventory])

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Inventory Reports"
            links={[{ text: "Reports", link: "/reports" }]}
            active="Inventory Reports"
            buttons={
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg no-print"
                >
                  Print Report
                </button>
                <div className="bg-blue-200 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">Total Items: {filteredInventory.length}</span>
                </div>
              </div>
            }
          />

          {/* Filter Section */}
          <div className="box mb-4 p-4 no-print">
            <div className="flex flex-wrap items-end gap-4">
              {/* Category Filter */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Level Filter */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium mb-1">Stock Level</label>
                <select
                  name="stockLevel"
                  value={filters.stockLevel}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  {stockLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
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
                    <div className="text-center py-4">🔄 Loading inventory reports...</div>
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
          .gridjs-container {
            width: 100% !important;
          }
          .gridjs-wrapper {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </>
  )
}

export default InventoryReport