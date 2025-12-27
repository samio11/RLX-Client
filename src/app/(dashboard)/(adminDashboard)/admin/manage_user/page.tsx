"use client";

import { useEffect, useState } from "react";
import { User, UsersResponse } from "./_types/user";
import {
  getAllUserAdmin,
  blockUser,
  unBlockUser,
  updateUserByToken,
} from "@/services/user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response: UsersResponse = await getAllUserAdmin();
      if (response.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    try {
      setUpdatingUserId(userId);
      await updateUserByToken({ _id: userId, role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      setUpdatingUserId(user._id);
      if (user.isVerified) {
        await blockUser(user._id);
        toast.success("User blocked");
      } else {
        await unBlockUser(user._id);
        toast.success("User unblocked");
      }
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isVerified: !u.isVerified } : u
        )
      );
    } catch (error) {
      toast.error("Action failed");
      console.error(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return <UsersTableSkeleton />;
  }

  return (
    <div className="container mx-auto p-8 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-black">User Management</h1>
        <p className="text-lg text-gray-600 mt-3">
          Manage roles and account status •{" "}
          <span className="font-semibold text-black">{users.length} users</span>
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <Table>
          <TableCaption className="text-gray-500 py-6">
            {users.length === 0 ? "No users found in the system." : ""}
          </TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-black">User</TableHead>
              <TableHead className="font-semibold text-black">
                Contact
              </TableHead>
              <TableHead className="font-semibold text-black">Joined</TableHead>
              <TableHead className="font-semibold text-black text-center">
                Role
              </TableHead>
              <TableHead className="font-semibold text-black text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-black text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="bg-black text-white font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-black">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-700">{user.phone || "-"}</p>
                    <p className="text-gray-600">{user.address || "-"}</p>
                  </div>
                </TableCell>

                <TableCell className="text-gray-700">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </TableCell>

                <TableCell className="text-center">
                  <Select
                    value={user.role}
                    onValueChange={(value: "user" | "admin") =>
                      handleRoleChange(user._id, value)
                    }
                    disabled={updatingUserId === user._id}
                  >
                    <SelectTrigger className="w-32 mx-auto border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant={user.isVerified ? "default" : "destructive"}
                    className={
                      user.isVerified
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-red-600 text-white"
                    }
                  >
                    {user.isVerified ? "Active" : "Blocked"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant={user.isVerified ? "destructive" : "default"}
                    onClick={() => handleToggleBlock(user)}
                    disabled={updatingUserId === user._id}
                    className={
                      user.isVerified
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-black hover:bg-gray-800"
                    }
                  >
                    {updatingUserId === user._id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : user.isVerified ? (
                      "Block"
                    ) : (
                      "Unblock"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No users found</p>
        </div>
      )}
    </div>
  );
}

function UsersTableSkeleton() {
  return (
    <div className="container mx-auto p-8">
      <Skeleton className="h-10 w-80 mb-4" />
      <Skeleton className="h-6 w-96 mb-10" />

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {["User", "Contact", "Joined", "Role", "Status", "Actions"].map(
                (head) => (
                  <TableHead key={head}>
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-52" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-32 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-7 w-20 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-24 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
