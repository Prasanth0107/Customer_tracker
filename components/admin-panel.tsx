"use client"

import type React from "react"

import { useState } from "react"
import type { User, Customer } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Users, Settings, Database } from "lucide-react"

interface AdminPanelProps {
  users: User[]
  customers: Customer[]
  onUpdateUsers: (users: User[]) => void
  onUpdateCustomers: (customers: Customer[]) => void
}

export function AdminPanel({ users, customers, onUpdateUsers, onUpdateCustomers }: AdminPanelProps) {
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "normal_user" as const })
  const [showAddUser, setShowAddUser] = useState(false)

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
    }
    onUpdateUsers([...users, user])
    setNewUser({ email: "", name: "", role: "normal_user" })
    setShowAddUser(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      onUpdateUsers(users.filter((u) => u.id !== userId))
    }
  }

  const handleDeleteAllCustomers = () => {
    if (confirm("Are you sure you want to delete ALL customer data? This action cannot be undone.")) {
      onUpdateCustomers([])
    }
  }

  const getStatusStats = () => {
    const stats = {
      total: customers.length,
      completed: customers.filter((c) => c.onboardingStatus === "Completed").length,
      inProgress: customers.filter((c) => c.onboardingStatus === "In Progress").length,
      blocked: customers.filter((c) => c.onboardingStatus === "Blocked").length,
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users, view system statistics, and configure application settings</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked</CardTitle>
                <div className="h-4 w-4 bg-red-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Users</span>
                  <Badge variant="secondary">{users.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Super Admins</span>
                  <Badge variant="default">{users.filter((u) => u.role === "super_admin").length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Normal Users</span>
                  <Badge variant="outline">{users.filter((u) => u.role === "normal_user").length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {showAddUser && (
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "super_admin" | "normal_user") =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal_user">Normal User</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add User</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Current Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.role === "super_admin" ? "default" : "secondary"}>
                        {user.role === "super_admin" ? "Super Admin" : "Normal User"}
                      </Badge>
                      <Button onClick={() => handleDeleteUser(user.id)} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-xl font-semibold">System Settings</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  This action will permanently delete all customer data. This cannot be undone.
                </p>
                <Button onClick={handleDeleteAllCustomers} variant="destructive" size="sm">
                  Delete All Customer Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Version</span>
                  <Badge variant="outline">v1.0.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Environment</span>
                  <Badge variant="secondary">Development</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
