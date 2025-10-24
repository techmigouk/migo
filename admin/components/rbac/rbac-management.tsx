"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, UsersIcon, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  permissionCount: number
  createdAt: string
}

interface Permission {
  module: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  manage: boolean
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all platform features",
    memberCount: 3,
    permissionCount: 45,
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access with some restrictions",
    memberCount: 8,
    permissionCount: 38,
    createdAt: "2023-01-15",
  },
  {
    id: "3",
    name: "Mentor",
    description: "Can manage courses and interact with students",
    memberCount: 24,
    permissionCount: 22,
    createdAt: "2023-02-01",
  },
  {
    id: "4",
    name: "Support",
    description: "Customer support and user assistance",
    memberCount: 12,
    permissionCount: 15,
    createdAt: "2023-03-10",
  },
  {
    id: "5",
    name: "Content Creator",
    description: "Can create and edit course content",
    memberCount: 18,
    permissionCount: 18,
    createdAt: "2023-04-05",
  },
]

const permissionModules = [
  "User Management",
  "Course Management",
  "Content Management",
  "Finance & Billing",
  "Marketing",
  "Analytics",
  "Community",
  "Mentorship",
  "AI Assistant",
  "Platform Settings",
]

export function RBACManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<Record<string, Permission>>(
    permissionModules.reduce(
      (acc, module) => {
        acc[module] = {
          module,
          view: false,
          create: false,
          edit: false,
          delete: false,
          manage: false,
        }
        return acc
      },
      {} as Record<string, Permission>,
    ),
  )

  const viewRoleDetails = (role: Role) => {
    setSelectedRole(role)
    setShowRoleDialog(true)
  }

  const editPermissions = (role: Role) => {
    setSelectedRole(role)
    // Simulate loading permissions for this role
    const mockPermissions = permissionModules.reduce(
      (acc, module) => {
        acc[module] = {
          module,
          view: Math.random() > 0.3,
          create: Math.random() > 0.5,
          edit: Math.random() > 0.5,
          delete: Math.random() > 0.7,
          manage: Math.random() > 0.8,
        }
        return acc
      },
      {} as Record<string, Permission>,
    )
    setPermissions(mockPermissions)
    setShowPermissionsDialog(true)
  }

  const togglePermission = (module: string, permission: keyof Omit<Permission, "module">) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission],
      },
    }))
  }

  const handleDeleteRole = (role: Role) => {
    console.log("[v0] Deleting role:", role.id)
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      setRoles(roles.filter((r) => r.id !== role.id))
    }
  }

  const handleSavePermissions = () => {
    console.log("[v0] Saving permissions for role:", selectedRole?.id, permissions)
    setShowPermissionsDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Roles & Permissions</h1>
          <p className="mt-2 text-gray-400">Manage access control and user permissions</p>
        </div>
        <Button
          className="bg-amber-600 hover:bg-amber-700"
          onClick={() => {
            console.log("[v0] Opening create role dialog")
            setEditingRole(null)
            setShowCreateRoleDialog(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Roles Table */}
      <div className="rounded-lg border border-gray-800 bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-gray-300">Role Name</TableHead>
              <TableHead className="text-gray-300">Description</TableHead>
              <TableHead className="text-gray-300">Members</TableHead>
              <TableHead className="text-gray-300">Permissions</TableHead>
              <TableHead className="text-gray-300">Created</TableHead>
              <TableHead className="w-32 text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-gray-100">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">{role.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    <UsersIcon className="mr-1 h-3 w-3" />
                    {role.memberCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-600 text-white">{role.permissionCount} permissions</Badge>
                </TableCell>
                <TableCell className="text-gray-400">{role.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => viewRoleDetails(role)}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editPermissions(role)}
                      className="text-amber-500 hover:text-amber-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-400"
                      onClick={() => handleDeleteRole(role)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Role Details Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-3xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl">Role Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedRole?.name} - {selectedRole?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="users">Assigned Users</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Role Name</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedRole.name}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Members</p>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{selectedRole.memberCount}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Permissions</p>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{selectedRole.permissionCount}</p>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="mt-1 font-medium text-gray-100">{selectedRole.createdAt}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="permissions">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Permission details coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="users">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                  <p className="text-gray-400">Assigned users list coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Permissions Matrix Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="max-w-5xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Permissions</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure permissions for {selectedRole?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-800">
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Module</TableHead>
                  <TableHead className="text-center text-gray-300">View</TableHead>
                  <TableHead className="text-center text-gray-300">Create</TableHead>
                  <TableHead className="text-center text-gray-300">Edit</TableHead>
                  <TableHead className="text-center text-gray-300">Delete</TableHead>
                  <TableHead className="text-center text-gray-300">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(permissions).map((perm) => (
                  <TableRow key={perm.module} className="border-gray-700">
                    <TableCell className="font-medium text-gray-100">{perm.module}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch checked={perm.view} onCheckedChange={() => togglePermission(perm.module, "view")} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch checked={perm.create} onCheckedChange={() => togglePermission(perm.module, "create")} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch checked={perm.edit} onCheckedChange={() => togglePermission(perm.module, "edit")} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch checked={perm.delete} onCheckedChange={() => togglePermission(perm.module, "delete")} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch checked={perm.manage} onCheckedChange={() => togglePermission(perm.module, "manage")} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPermissionsDialog(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSavePermissions}>
              Save Permissions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Role Dialog */}
      <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
        <DialogContent className="border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingRole ? "Update role information" : "Define a new role with custom permissions"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Role Name</Label>
              <Input
                defaultValue={editingRole?.name}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Content Manager"
              />
            </div>
            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                defaultValue={editingRole?.description}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Describe the role's responsibilities..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateRoleDialog(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  console.log("[v0] Saving role")
                  setShowCreateRoleDialog(false)
                }}
              >
                {editingRole ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
