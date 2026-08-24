"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function UserManagement() {
  const supabase = createClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at");

      if (error) {
        toast.error("Get User data failed", {
          description: error.message,
        });
      }

      return data;
    },
  });
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Input placeholder="Search by name"></Input>
          <Dialog>
            <DialogTrigger
              render={<Button variant={"outline"}>Create</Button>}
            ></DialogTrigger>
          </Dialog>
        </div>
      </div>
      {isLoading && <div>Loading</div>}
      {users?.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <h2>{user.role}</h2>
        </div>
      ))}
    </div>
  );
}
