"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MoreHorizontal, 
  Trash2, 
  Eye,
  User,
  Mail,
  AlertTriangle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  id: string
  name: string
  email: string
  role: string
  tenant: string
  status: string
  // lastLogin: string
  avatar: string | null
  isVerified: boolean
  createdAt: string
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data.users)
      } catch (err) {
        setError("Failed to load users")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Badge variant="default" className="bg-purple-600">Owner</Badge>
      case "MANAGER":
        return <Badge variant="default" className="bg-blue-600">Manager</Badge>
      case "CASHIER":
        return <Badge variant="secondary">Cashier</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeleteLoading(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }
      
      // Remove user from the list
      setUsers(users.filter(user => user.id !== userId))
      setShowDeleteDialog(false)
      setUserToDelete(null)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError(err instanceof Error ? err.message : "Failed to delete user")
    } finally {
      setDeleteLoading(null)
    }
  }

  const confirmDelete = (user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const cancelDelete = () => {
    setShowDeleteDialog(false)
    setUserToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
            <div className="col-span-6 font-medium">User</div>
            <div className="col-span-2 font-medium">Role</div>
            <div className="col-span-2 font-medium">Status</div>
            <div className="col-span-2 font-medium">Actions</div>
          </div>
          <div className="p-8 text-center text-muted-foreground">
            Loading users...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
            <div className="col-span-6 font-medium">User</div>
            <div className="col-span-2 font-medium">Role</div>
            <div className="col-span-2 font-medium">Status</div>
            <div className="col-span-2 font-medium">Actions</div>
          </div>
          <div className="p-8 text-center text-red-600">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
            <div className="col-span-6 font-medium">User</div>
            <div className="col-span-2 font-medium">Role</div>
            <div className="col-span-2 font-medium">Status</div>
            <div className="col-span-2 font-medium">Actions</div>
          </div>
          
          {users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No users found. Create your first employee account to get started.
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
                <div className="col-span-6 flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  {getRoleBadge(user.role)}
                </div>
                
                <div className="col-span-2">
                  {getStatusBadge(user.status)}
                </div>
                
                <div className="col-span-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        {user.status === "active" ? "Suspend user" : "Activate user"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => confirmDelete(user)} 
                        className="text-red-600"
                        disabled={deleteLoading === user.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleteLoading === user.id ? "Deleting..." : "Delete user"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? 
              This action cannot be undone and will permanently remove the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading === userToDelete?.id}
            >
              {deleteLoading === userToDelete?.id ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}