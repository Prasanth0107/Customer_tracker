"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { AdminPanel } from "@/components/admin-panel"

export interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "normal_user"
}

export interface Customer {
  id: string
  customer: string
  partner: string
  onboardingStatus: "In Progress" | "Completed" | "Blocked"
  initialRequester: string
  handoveredTo: string
  opportunity: string
  deepDiscovery: boolean
  accountsCount: number
  sourceCloud: string
  targetCloud: string
  onboardedDate?: string
  discoveryCompletedDate?: string
  costJobs: "Not Started" | "In Progress" | "Completed" | "Blocked"
  metricsJobs: "Not Started" | "In Progress" | "Completed" | "Blocked"
  mlJobs: "Not Started" | "In Progress" | "Completed" | "Blocked"
  recommsJobs: "Not Started" | "In Progress" | "Completed" | "Blocked"
  notes: string
  // Simplified onboarded environment - just the environment type
  onboardedEnvironment?: "matilda-optimize" | "rapid-assessments" | "matilda-optimize.au"
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    customer: "Academy of General Dentistry",
    partner: "TechPartner A",
    onboardingStatus: "In Progress",
    initialRequester: "John Smith",
    handoveredTo: "Sarah Johnson",
    opportunity: "OPP-2024-001",
    deepDiscovery: true,
    accountsCount: 5,
    sourceCloud: "AWS",
    targetCloud: "Azure",
    discoveryCompletedDate: "2024-01-15",
    costJobs: "In Progress",
    metricsJobs: "Completed",
    mlJobs: "Not Started",
    recommsJobs: "Not Started",
    notes: "Initial setup in progress",
  },
  {
    id: "2",
    customer: "Epharma",
    partner: "CloudTech Solutions",
    onboardingStatus: "Completed",
    initialRequester: "Fabio",
    handoveredTo: "Chida",
    opportunity: "OPP-2024-002",
    deepDiscovery: true,
    accountsCount: 12,
    sourceCloud: "GCP",
    targetCloud: "AWS",
    onboardedDate: "2025-07-11",
    discoveryCompletedDate: "2024-02-20",
    costJobs: "Completed",
    metricsJobs: "Completed",
    mlJobs: "Completed",
    recommsJobs: "In Progress",
    notes: "Informed Chida for final handover",
    onboardedEnvironment: "matilda-optimize",
  },
  {
    id: "3",
    customer: "BCDR AerieHub",
    partner: "DataFlow Inc",
    onboardingStatus: "Blocked",
    initialRequester: "Mike Wilson",
    handoveredTo: "Alex Chen",
    opportunity: "OPP-2024-003",
    deepDiscovery: false,
    accountsCount: 3,
    sourceCloud: "Azure",
    targetCloud: "GCP",
    costJobs: "Blocked",
    metricsJobs: "Not Started",
    mlJobs: "Not Started",
    recommsJobs: "Not Started",
    notes: "Waiting for security clearance",
  },
  {
    id: "4",
    customer: "Cogna",
    partner: "InnovateTech",
    onboardingStatus: "Completed",
    initialRequester: "Lisa Brown",
    handoveredTo: "David Kim",
    opportunity: "OPP-2024-004",
    deepDiscovery: true,
    accountsCount: 8,
    sourceCloud: "AWS",
    targetCloud: "Azure",
    onboardedDate: "2024-12-15",
    discoveryCompletedDate: "2024-03-10",
    costJobs: "Completed",
    metricsJobs: "Completed",
    mlJobs: "Completed",
    recommsJobs: "Completed",
    notes: "Migration completed successfully",
    onboardedEnvironment: "rapid-assessments",
  },
  {
    id: "5",
    customer: "Global Finance Corp",
    partner: "FinTech Solutions",
    onboardingStatus: "In Progress",
    initialRequester: "Michael Chen",
    handoveredTo: "Emma Wilson",
    opportunity: "OPP-2024-005",
    deepDiscovery: true,
    accountsCount: 15,
    sourceCloud: "AWS",
    targetCloud: "Azure",
    discoveryCompletedDate: "2024-03-25",
    costJobs: "In Progress",
    metricsJobs: "In Progress",
    mlJobs: "Not Started",
    recommsJobs: "Not Started",
    notes: "Large enterprise migration in progress",
  },
  {
    id: "6",
    customer: "Healthcare Plus",
    partner: "MedTech Partners",
    onboardingStatus: "Completed",
    initialRequester: "Dr. Sarah Lee",
    handoveredTo: "James Rodriguez",
    opportunity: "OPP-2024-006",
    deepDiscovery: true,
    accountsCount: 7,
    sourceCloud: "GCP",
    targetCloud: "AWS",
    onboardedDate: "2024-11-20",
    discoveryCompletedDate: "2024-02-10",
    costJobs: "Completed",
    metricsJobs: "Completed",
    mlJobs: "Completed",
    recommsJobs: "Completed",
    notes: "Healthcare compliance requirements met",
    onboardedEnvironment: "matilda-optimize.au",
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@matildacloud.com",
    name: "Super Admin",
    role: "super_admin",
  },
  {
    id: "2",
    email: "user@matildacloud.com",
    name: "Normal User",
    role: "normal_user",
  },
]

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentView, setCurrentView] = useState<"dashboard" | "admin">("dashboard")

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (email: string, password: string) => {
    // Simple mock authentication
    const user = users.find((u) => u.email === email)
    if (user && password === "password") {
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
    setCurrentView("dashboard")
  }

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)))
  }

  const addCustomer = (newCustomer: Omit<Customer, "id">) => {
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
    }
    setCustomers((prev) => [...prev, customer])
  }

  const deleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white text-blue-600 px-2 py-1 rounded font-bold text-lg">M</div>
                <div>
                  <h1 className="text-2xl font-bold">MatildaCloud</h1>
                  <p className="text-blue-100 text-sm">Customer Onboarding Tracker</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">Welcome, {currentUser.name}</span>
              {currentUser.role === "super_admin" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === "dashboard"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "bg-blue-500 hover:bg-blue-400 text-white"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView("admin")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === "admin"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "bg-blue-500 hover:bg-blue-400 text-white"
                    }`}
                  >
                    Admin Panel
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {currentView === "dashboard" ? (
        <Dashboard
          customers={customers}
          currentUser={currentUser}
          onUpdateCustomer={updateCustomer}
          onAddCustomer={addCustomer}
          onDeleteCustomer={deleteCustomer}
        />
      ) : (
        <AdminPanel users={users} customers={customers} onUpdateUsers={setUsers} onUpdateCustomers={setCustomers} />
      )}
    </div>
  )
}
