"use client"

import type { Customer } from "@/app/page"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Calendar } from "lucide-react"

interface CustomerListProps {
  customers: Customer[]
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer) => void
}

export function CustomerList({ customers, selectedCustomer, onSelectCustomer }: CustomerListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 border-l-green-500 hover:bg-green-100"
      case "In Progress":
        return "bg-orange-50 border-l-orange-500 hover:bg-orange-100"
      case "Blocked":
        return "bg-red-50 border-l-red-500 hover:bg-red-100"
      default:
        return "bg-gray-50 border-l-gray-500 hover:bg-gray-100"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onSelectCustomer(customer)}
          className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 border-l-4 ${getStatusColor(
            customer.onboardingStatus,
          )} ${selectedCustomer?.id === customer.id ? "bg-blue-50 border-r-4 border-r-blue-500 shadow-sm" : ""}`}
        >
          <div className="space-y-3">
            {/* Customer Name */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 flex-1">
                <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{customer.customer}</h3>
              </div>
            </div>

            {/* Partner */}
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Users className="h-3 w-3" />
              <span>Partner: {customer.partner}</span>
            </div>

            {/* Status and Accounts */}
            <div className="flex items-center justify-between">
              <Badge className={`text-xs px-2 py-1 border ${getStatusBadge(customer.onboardingStatus)}`}>
                {customer.onboardingStatus}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>{customer.accountsCount}</span>
              </div>
            </div>

            {/* Dates */}
            {(customer.onboardedDate || customer.discoveryCompletedDate) && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  {customer.onboardedDate
                    ? `Onboarded: ${customer.onboardedDate}`
                    : `Discovery: ${customer.discoveryCompletedDate}`}
                </span>
              </div>
            )}

            {/* Environment Badge */}
            {customer.onboardedEnvironment && (
              <div className="pt-1">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {customer.onboardedEnvironment === "matilda-optimize" && "Matilda Optimize"}
                  {customer.onboardedEnvironment === "rapid-assessments" && "Rapid Assessments"}
                  {customer.onboardedEnvironment === "matilda-optimize.au" && "Matilda Optimize AU"}
                </Badge>
              </div>
            )}
          </div>
        </div>
      ))}

      {customers.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No customers found</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  )
}
