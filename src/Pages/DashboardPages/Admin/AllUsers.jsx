import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    axiosSecure.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, [axiosSecure]);

  const handleUpdateStatus = (id, status) => {
    axiosSecure.patch(`/users/${id}/status`, { status }).then(() => {
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, status } : user))
      );
    });
  };

  const handleUpdateRole = (id, role) => {
    axiosSecure.patch(`/users/${id}/role`, { role }).then(() => {
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role } : user))
      );
    });
  };

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">All Users</h2>
        <div className="space-x-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "blocked" ? "default" : "outline"}
            onClick={() => setStatusFilter("blocked")}
          >
            Blocked
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Avatar</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="text-center border-t">
                <td className="px-4 py-2">
                  <Avatar className="mx-auto">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 capitalize">{user.status}</td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="px-2">
                        <ChevronDown className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {user.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(user._id, "blocked")
                          }
                        >
                          Block
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(user._id, "active")}
                        >
                          Unblock
                        </DropdownMenuItem>
                      )}
                      {user.role !== "volunteer" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateRole(user._id, "volunteer")
                          }
                        >
                          Make Volunteer
                        </DropdownMenuItem>
                      )}
                      {user.role !== "admin" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(user._id, "admin")}
                        >
                          Make Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
