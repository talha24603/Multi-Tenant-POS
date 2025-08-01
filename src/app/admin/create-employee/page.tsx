"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Shield, 
  Users, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react"
import { useRouter } from "next/navigation"

interface EmployeeFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: "MANAGER" | "CASHIER"
}

export default function CreateEmployeePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/create-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create employee")
      }

      setSuccess("Employee account created successfully!")
      setShowSuccessDialog(true)
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "CASHIER"
      })
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the employee account")
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    {
      value: "CASHIER",
      label: "Cashier",
      description: "Process sales and handle customer transactions",
      icon: CreditCard,
      color: "bg-blue-100 text-blue-800"
    },
    {
      value: "MANAGER",
      label: "Manager",
      description: "Manage inventory, view reports, and oversee operations",
      icon: Shield,
      color: "bg-green-100 text-green-800"
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Employee Account</h2>
          <p className="text-muted-foreground">
            Add new employees to your organization with appropriate roles and permissions
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Users
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Employee Information
            </CardTitle>
            <CardDescription>
              Fill in the employee's basic information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter employee's full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="employee@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>


              </div>

                             {/* Account Security */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Lock className="h-4 w-4" />
                   Account Security
                 </h3>

                 <div>
                   <Label htmlFor="password">Password *</Label>
                   <div className="relative mt-1">
                     <Input
                       id="password"
                       type={showPassword ? "text" : "password"}
                       placeholder="Create a secure password"
                       value={formData.password}
                       onChange={(e) => handleInputChange("password", e.target.value)}
                     />
                     <Button
                       type="button"
                       variant="ghost"
                       size="sm"
                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                       {showPassword ? (
                         <EyeOff className="h-4 w-4" />
                       ) : (
                         <Eye className="h-4 w-4" />
                       )}
                     </Button>
                   </div>
                 </div>

                 <div>
                   <Label htmlFor="confirmPassword">Confirm Password *</Label>
                   <div className="relative mt-1">
                     <Input
                       id="confirmPassword"
                       type={showConfirmPassword ? "text" : "password"}
                       placeholder="Confirm the password"
                       value={formData.confirmPassword}
                       onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                     />
                     <Button
                       type="button"
                       variant="ghost"
                       size="sm"
                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     >
                       {showConfirmPassword ? (
                         <EyeOff className="h-4 w-4" />
                       ) : (
                         <Eye className="h-4 w-4" />
                       )}
                     </Button>
                   </div>
                 </div>
               </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Employee Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Role Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Select Role
              </CardTitle>
              <CardDescription>
                Choose the appropriate role and permissions for this employee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleOptions.map((role) => (
                  <div
                    key={role.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.role === role.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("role", role.value)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${role.color}`}>
                        <role.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{role.label}</h4>
                          {formData.role === role.value && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.role === "CASHIER" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Process sales transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Handle customer payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">View product inventory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Generate receipts</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">All cashier permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Manage inventory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">View sales reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Manage products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">View analytics</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Employee Account Created
            </DialogTitle>
            <DialogDescription>
              The employee account has been successfully created. The employee will receive an email with login instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
              Create Another
            </Button>
            <Button onClick={() => router.push("/admin/users")}>
              View All Users
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 