"use client"

import { useState } from "react"
import type { Customer, User } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerForm } from "./customer-form"
import { Edit, Trash2, Calendar, Users, Cloud, CheckCircle, Clock, XCircle, AlertCircle, Server } from "lucide-react"

interface CustomerDetailsProps {
  customer: Customer
  currentUser: User
  onUpdateCustomer: (customer: Customer) => void
  onDeleteCustomer: (customerId: string) => void
}

export function CustomerDetails({ customer, currentUser, onUpdateCustomer, onDeleteCustomer }: CustomerDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-orange-500"
      case "Blocked":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Blocked":
        return <XCircle className="h-4 w-4" />
      case "Not Started":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "matilda-optimize":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "rapid-assessments":
        return "bg-green-100 text-green-800 border-green-200"
      case "matilda-optimize.au":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEnvironmentDisplayName = (env: string) => {
    switch (env) {
      case "matilda-optimize":
        return "Matilda Optimize"
      case "rapid-assessments":
        return "Rapid Assessments"
      case "matilda-optimize.au":
        return "Matilda Optimize AU"
      default:
        return env
    }
  }

  const handleUpdate = (updatedCustomer: Omit<Customer, "id">) => {
    onUpdateCustomer({ ...updatedCustomer, id: customer.id })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this customer?")) {
      onDeleteCustomer(customer.id)
    }
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Customer</h2>
          <Button onClick={() => setIsEditing(false)} variant="outline">
            Cancel
          </Button>
        </div>
        <CustomerForm customer={customer} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{customer.customer}</h1>
          <p className="text-gray-600">Partner: {customer.partner}</p>
        </div>
        {currentUser.role === "super_admin" && (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Onboarding Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(customer.onboardingStatus)}`}
            >
              {getStatusIcon(customer.onboardingStatus)}
              <span className="ml-1">{customer.onboardingStatus}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Initial Reporter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{customer.initialRequester}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Handed Over To</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{customer.handoveredTo}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Onboarded Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{customer.onboardedDate || "Not completed"}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 truncate" title={customer.notes}>
              {customer.notes || "No comments"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {customer.onboardingStatus === "Completed" && customer.onboardedEnvironment && (
            <TabsTrigger value="environment">
              <Server className="h-4 w-4 mr-1" />
              Onboarded Environment
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Opportunity</label>
                    <p className="text-sm text-gray-900">{customer.opportunity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Accounts Count</label>
                    <p className="text-sm text-gray-900">{customer.accountsCount}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Deep Discovery</label>
                  <div className="mt-1">
                    <Badge variant={customer.deepDiscovery ? "default" : "secondary"}>
                      {customer.deepDiscovery ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                {customer.discoveryCompletedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Discovery Completed Date</label>
                    <p className="text-sm text-gray-900">{customer.discoveryCompletedDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cloud Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2" />
                  Cloud Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Source Cloud</label>
                    <p className="text-sm text-gray-900">{customer.sourceCloud}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Target Cloud</label>
                    <p className="text-sm text-gray-900">{customer.targetCloud}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Status */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Job Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Cost Jobs</label>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${getStatusColor(customer.costJobs)}`}
                    >
                      {getStatusIcon(customer.costJobs)}
                      <span className="ml-1">{customer.costJobs}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Metrics Jobs</label>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${getStatusColor(customer.metricsJobs)}`}
                    >
                      {getStatusIcon(customer.metricsJobs)}
                      <span className="ml-1">{customer.metricsJobs}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <label className="text-sm font-medium text-gray-600 block mb-2">ML Jobs</label>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${getStatusColor(customer.mlJobs)}`}
                    >
                      {getStatusIcon(customer.mlJobs)}
                      <span className="ml-1">{customer.mlJobs}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Recomms Jobs</label>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${getStatusColor(customer.recommsJobs)}`}
                    >
                      {getStatusIcon(customer.recommsJobs)}
                      <span className="ml-1">{customer.recommsJobs}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Notes / Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{customer.notes || "No additional notes"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {customer.onboardingStatus === "Completed" && customer.onboardedEnvironment && (
          <TabsContent value="environment">
            <div className="space-y-6">
              {/* Environment Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Onboarded Environment</h2>
                  <p className="text-gray-600">Environment information for {customer.customer}</p>
                </div>
              </div>

              {/* Environment Display */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Selected Environment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8">
                    <Badge className={`text-lg px-6 py-3 ${getEnvironmentColor(customer.onboardedEnvironment)}`}>
                      {getEnvironmentDisplayName(customer.onboardedEnvironment)}
                    </Badge>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-4">
                    <p>
                      This customer has been onboarded to the{" "}
                      <strong>{getEnvironmentDisplayName(customer.onboardedEnvironment)}</strong> environment.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Environment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Environment Type</label>
                        <p className="text-sm text-gray-900">
                          {getEnvironmentDisplayName(customer.onboardedEnvironment)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Onboarded Date</label>
                        <p className="text-sm text-gray-900">{customer.onboardedDate}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer</label>
                      <p className="text-sm text-gray-900">{customer.customer}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Partner</label>
                      <p className="text-sm text-gray-900">{customer.partner}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
