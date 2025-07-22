"use client"

import { useState } from "react"
import type { Customer, User } from "@/app/page"
import { CustomerList } from "./customer-list"
import { CustomerDetails } from "./customer-details"
import { CustomerForm } from "./customer-form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Search, Users } from "lucide-react"

interface DashboardProps {
  customers: Customer[]
  currentUser: User
  onUpdateCustomer: (customer: Customer) => void
  onAddCustomer: (customer: Omit<Customer, "id">) => void
  onDeleteCustomer: (customerId: string) => void
}

export function Dashboard({
  customers,
  currentUser,
  onUpdateCustomer,
  onAddCustomer,
  onDeleteCustomer,
}: DashboardProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customers.find((c) => c.customer === "Epharma") || customers[0] || null,
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.initialRequester.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.onboardingStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddCustomer = (customerData: Omit<Customer, "id">) => {
    onAddCustomer(customerData)
    setShowAddForm(false)
  }

  // Calculate statistics
  const stats = {
    total: customers.length,
    completed: customers.filter((c) => c.onboardingStatus === "Completed").length,
    inProgress: customers.filter((c) => c.onboardingStatus === "In Progress").length,
    blocked: customers.filter((c) => c.onboardingStatus === "Blocked").length,
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Left Sidebar - Customer List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header with Stats */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Customers
            </h2>
            {(currentUser.role === "super_admin" || currentUser.role === "normal_user") && (
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-red-600">{stats.blocked}</div>
              <div className="text-xs text-gray-600">Blocked</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-sm bg-white border-gray-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer List */}
        <CustomerList
          customers={filteredCustomers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={setSelectedCustomer}
        />

        {/* Results Count */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {showAddForm ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="shadow-sm">
                Cancel
              </Button>
            </div>
            <CustomerForm onSubmit={handleAddCustomer} onCancel={() => setShowAddForm(false)} />
          </div>
        ) : selectedCustomer ? (
          <CustomerDetails
            customer={selectedCustomer}
            currentUser={currentUser}
            onUpdateCustomer={onUpdateCustomer}
            onDeleteCustomer={onDeleteCustomer}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No customer selected</p>
              <p className="text-gray-500">Select a customer from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
