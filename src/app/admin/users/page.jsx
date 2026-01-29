"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import UserAvatar from "@/components/admin/UserAvatar";
import {
  useAllUsersQuery,
  useUpdateUserRoleMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
} from "@/redux/api/userApiSlice";
import { toast } from "react-hot-toast";

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllUsersQuery(
    { q: debouncedSearchTerm },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();

  const users =
    usersData?.users?.map((user) => ({
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      joinDate: new Date(user.createdAt).toLocaleDateString(),
      status: user.isSuspended ? "suspended" : "active",
      recipes: user.recipes?.length || 0,
      lastActive: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A",
      photo: user.profilePhoto,
    })) || [];

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole} successfully!`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user role");
      console.error("Error updating user role:", error);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await suspendUser(userId).unwrap();
      toast.success("User suspended successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to suspend user");
      console.error("Error suspending user:", error);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await activateUser(userId).unwrap();
      toast.success("User activated successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to activate user");
      console.error("Error activating user:", error);
    }
  };

  if (isError) {
    return (
      <div className="p-4 pt-20 md:pt-20 flex justify-center items-center h-full">
        <div className="text-xl text-red-500">Error loading users: {error?.data?.message || "Unknown error"}</div>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "default";
    }
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case "admin":
        return "default";
      case "user":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-4 pt-20 md:pt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Manage Users</h2>
          <p className="text-base sm:text-lg text-gray-600">View, edit, and manage user accounts.</p>
        </div>
        <div className="relative flex-grow sm:flex-grow-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 lg:hidden">
            {isLoading
              ? [...Array(5)].map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))
              : users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div className="flex-1">
                        <div className="font-medium truncate">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground font-semibold">Role</span>
                      <span className="text-xs">{user.role}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground font-semibold">Recipes</span>
                      <Badge variant="outline" className="ml-2">
                        {user.recipes} recipes
                      </Badge>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground font-semibold">Join Date</span>
                      <span className="text-xs">{user.joinDate}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground font-semibold">Last Active</span>
                      <span className="text-xs">{user.lastActive}</span>
                    </div>
                    <div className="flex justify-between mt-1 items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Status</span>
                      <Badge variant={getStatusVariant(user.status)} className="ml-2">
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      {user.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleSuspendUser(user.id)}
                          disabled={isSuspending}>
                          {isSuspending ? "Suspending..." : "Suspend"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateUser(user.id)}
                          disabled={isActivating}>
                          {isActivating ? "Activating..." : "Activate"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
          </div>

          <div className="w-full overflow-x-auto hidden lg:block">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Recipes</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array(5)].map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-24 inline-block mr-2" />
                          <Skeleton className="h-8 w-24 inline-block" />
                        </TableCell>
                      </TableRow>
                    ))
                  : users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} />
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate">{user.email}</TableCell>
                        <TableCell>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-background border border-input rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={isUpdatingRole}>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.recipes} recipes</Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {user.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleSuspendUser(user.id)}
                                disabled={isSuspending}>
                                {isSuspending ? "Suspending..." : "Suspend"}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivateUser(user.id)}
                                disabled={isActivating}>
                                {isActivating ? "Activating..." : "Activate"}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
