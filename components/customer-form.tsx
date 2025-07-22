"use client"

import type React from "react"

import { useState } from "react"
import type { Customer } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface CustomerFormProps {
  customer?: Customer
  onSubmit: (customer: Omit<Customer, "id">) => void
  onCancel: () => void
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, "id">>({
    customer: customer?.customer || "",
    partner: customer?.partner || "",
    onboardingStatus: customer?.onboardingStatus || "In Progress",
    initialRequester: customer?.initialRequester || "",
    handoveredTo: customer?.handoveredTo || "",
    opportunity: customer?.opportunity || "",
    deepDiscovery: customer?.deepDiscovery || false,
    accountsCount: customer?.accountsCount || 0,
    sourceCloud: customer?.sourceCloud || "AWS",
    targetCloud: customer?.targetCloud || "AWS",
    onboardedDate: customer?.onboardedDate || "",
    discoveryCompletedDate: customer?.discoveryCompletedDate || "",
    costJobs: customer?.costJobs || "Not Started",
    metricsJobs: customer?.metricsJobs || "Not Started",
    mlJobs: customer?.mlJobs || "Not Started",
    recommsJobs: customer?.recommsJobs || "Not Started",
    notes: customer?.notes || "",
    onboardedEnvironment: customer?.onboardedEnvironment || undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const statusOptions = ["Not Started", "In Progress", "Completed", "Blocked"]
  const cloudOptions = ["AWS", "Azure", "GCP", "Other"]
  const onboardingStatusOptions = ["In Progress", "Completed", "Blocked"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer Name *</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="partner">Partner *</Label>
              <Input
                id="partner"
                value={formData.partner}
                onChange={(e) => handleInputChange("partner", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="onboardingStatus">Onboarding Status</Label>
              <Select
                value={formData.onboardingStatus}
                onValueChange={(value) => handleInputChange("onboardingStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {onboardingStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="opportunity">Opportunity</Label>
              <Input
                id="opportunity"
                value={formData.opportunity}
                onChange={(e) => handleInputChange("opportunity", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personnel Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personnel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initialRequester">Initial Requester</Label>
              <Input
                id="initialRequester"
                value={formData.initialRequester}
                onChange={(e) => handleInputChange("initialRequester", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="handoveredTo">Handed Over To</Label>
              <Input
                id="handoveredTo"
                value={formData.handoveredTo}
                onChange={(e) => handleInputChange("handoveredTo", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountsCount">Accounts Count</Label>
              <Input
                id="accountsCount"
                type="number"
                min="0"
                value={formData.accountsCount}
                onChange={(e) => handleInputChange("accountsCount", Number.parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deepDiscovery"
                checked={formData.deepDiscovery}
                onCheckedChange={(checked) => handleInputChange("deepDiscovery", checked)}
              />
              <Label htmlFor="deepDiscovery">Deep Discovery Completed</Label>
            </div>
          </CardContent>
        </Card>

        {/* Cloud Information */}
        <Card>
          <CardHeader>
            <CardTitle>Cloud Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sourceCloud">Source Cloud</Label>
              <Select value={formData.sourceCloud} onValueChange={(value) => handleInputChange("sourceCloud", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cloudOptions.map((cloud) => (
                    <SelectItem key={cloud} value={cloud}>
                      {cloud}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetCloud">Target Cloud</Label>
              <Select value={formData.targetCloud} onValueChange={(value) => handleInputChange("targetCloud", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cloudOptions.map((cloud) => (
                    <SelectItem key={cloud} value={cloud}>
                      {cloud}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="onboardedDate">Onboarded Date</Label>
              <Input
                id="onboardedDate"
                type="date"
                value={formData.onboardedDate}
                onChange={(e) => handleInputChange("onboardedDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="discoveryCompletedDate">Discovery Completed Date</Label>
              <Input
                id="discoveryCompletedDate"
                type="date"
                value={formData.discoveryCompletedDate}
                onChange={(e) => handleInputChange("discoveryCompletedDate", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="costJobs">Cost Jobs</Label>
                <Select value={formData.costJobs} onValueChange={(value) => handleInputChange("costJobs", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="metricsJobs">Metrics Jobs</Label>
                <Select value={formData.metricsJobs} onValueChange={(value) => handleInputChange("metricsJobs", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mlJobs">ML Jobs</Label>
                <Select value={formData.mlJobs} onValueChange={(value) => handleInputChange("mlJobs", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="recommsJobs">Recomms Jobs</Label>
                <Select value={formData.recommsJobs} onValueChange={(value) => handleInputChange("recommsJobs", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter any additional notes or comments..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Environment Selection - Only show if status is Completed */}
        {formData.onboardingStatus === "Completed" && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Onboarded Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="onboardedEnvironment">Select Environment *</Label>
                <Select
                  value={formData.onboardedEnvironment || ""}
                  onValueChange={(value) => handleInputChange("onboardedEnvironment", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matilda-optimize">Matilda Optimize</SelectItem>
                    <SelectItem value="rapid-assessments">Rapid Assessments</SelectItem>
                    <SelectItem value="matilda-optimize.au">Matilda Optimize AU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{customer ? "Update Customer" : "Add Customer"}</Button>
      </div>
    </form>
  )
}
