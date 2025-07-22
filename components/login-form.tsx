"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = onLogin(email, password)
    if (!success) {
      setError('Invalid credentials. Use admin@matildacloud.com or user@matildacloud.com with password "password"')
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 border border-blue-400 rounded-full"></div>
        <div className="absolute top-40 right-32 w-64 h-64 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 border border-blue-500 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-blue-400 rounded-full"></div>
      </div>

      {/* MatildaCloud Logo */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-lg">M</div>
          <div className="text-white">
            <span className="font-bold text-xl">matilda</span>
            <br />
            <span className="text-sm text-blue-300">cloud</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-between px-16">
        {/* Left Side - 3D Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* 3D Cloud Infrastructure Illustration */}
            <div className="relative w-96 h-96">
              {/* Cloud Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-80 blur-sm"></div>

              {/* Server Stack */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="relative">
                  {/* Main Server */}
                  <div className="w-24 h-32 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg shadow-2xl transform rotate-12 skew-y-3">
                    <div className="w-full h-4 bg-blue-400 rounded-t-lg"></div>
                    <div className="p-2 space-y-1">
                      <div className="w-4 h-1 bg-blue-300 rounded"></div>
                      <div className="w-6 h-1 bg-blue-300 rounded"></div>
                      <div className="w-5 h-1 bg-blue-300 rounded"></div>
                    </div>
                  </div>

                  {/* Database */}
                  <div className="absolute -right-8 top-4 w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg shadow-xl transform -rotate-6">
                    <div className="w-full h-3 bg-blue-300 rounded-t-lg"></div>
                    <div className="p-1 space-y-1">
                      <div className="w-3 h-0.5 bg-blue-200 rounded"></div>
                      <div className="w-4 h-0.5 bg-blue-200 rounded"></div>
                    </div>
                  </div>

                  {/* Code Block */}
                  <div className="absolute -left-12 top-8 w-20 h-16 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg shadow-xl transform rotate-6">
                    <div className="p-2 text-xs text-blue-200 font-mono">
                      <div className="w-2 h-0.5 bg-blue-300 rounded mb-1"></div>
                      <div className="w-3 h-0.5 bg-blue-300 rounded mb-1"></div>
                      <div className="w-2.5 h-0.5 bg-blue-300 rounded"></div>
                    </div>
                  </div>

                  {/* Document */}
                  <div className="absolute -right-16 -top-4 w-14 h-18 bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-xl transform rotate-12">
                    <div className="p-1 space-y-0.5">
                      <div className="w-2 h-0.5 bg-gray-400 rounded"></div>
                      <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="w-2.5 h-0.5 bg-gray-400 rounded"></div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-8 left-4 w-8 h-8 bg-blue-400 rounded-lg shadow-lg transform rotate-45 animate-pulse"></div>
                  <div className="absolute -top-4 -right-4 w-6 h-6 bg-blue-300 rounded-full shadow-lg animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-96">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Username or Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="matildaadmin@matildacloud.com"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-lg transition-colors"
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold">Demo Credentials:</p>
                  <p>Super Admin: admin@matildacloud.com / password</p>
                  <p>Normal User: user@matildacloud.com / password</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
