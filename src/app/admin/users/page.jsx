import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import UserAvatar from "@/components/admin/UserAvatar";

const AdminUsersPage = () => {
  // Mock data for users
  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "admin",
      joinDate: "2023-01-15",
      status: "active",
      recipes: 12,
      lastActive: "2023-05-15",
      photo: "/avatars/1.jpg",
    },
    {
      id: 2,
      name: "Emily Johnson",
      email: "emily@example.com",
      role: "user",
      joinDate: "2023-02-20",
      status: "active",
      recipes: 5,
      lastActive: "2023-05-14",
      photo: "/avatars/2.jpg",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "user",
      joinDate: "2023-03-10",
      status: "active",
      recipes: 8,
      lastActive: "2023-05-13",
      photo: "/avatars/3.jpg",
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah@example.com",
      role: "user",
      joinDate: "2023-04-05",
      status: "inactive",
      recipes: 3,
      lastActive: "2023-04-20",
      photo: "/avatars/4.jpg",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@example.com",
      role: "user",
      joinDate: "2023-04-15",
      status: "active",
      recipes: 15,
      lastActive: "2023-05-12",
      photo: "/avatars/5.jpg",
    },
  ];

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold">Manage Users</h2>
          <p className="text-lg text-gray-600">View, edit, and manage user accounts.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button>+ Add New User</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Recipes</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.recipes} recipes</Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
