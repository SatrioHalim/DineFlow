"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Edit, Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function UserManagement() {
  const supabase = createClient();
  const { currentLimit, currentPage, handleChangeLimit, handleChangePage } =
    useDataTable();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", currentPage, currentLimit],
    queryFn: async () => {
      const result = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (result.error) {
        toast.error("Get User data failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const filteredData = useMemo(() => {
    return (users?.data || []).map((user, index) => {
      return [
        index + 1,
        user.id,
        user.name,
        user.role,
        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil></Pencil>
                  Edit
                </span>
              ),
              action: () => {},
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="text-red-400"></Trash2>
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {},
            },
          ]}
        ></DropdownAction>,
      ];
    });
  }, [users]);

  const totalPages = useMemo(() => {
    return users && users.count !== null
      ? Math.ceil(users.count / currentLimit)
      : 0;
  }, [users]);

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
      <DataTable
        header={HEADER_TABLE_USER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onLimitChange={handleChangeLimit}
      ></DataTable>
    </div>
  );
}
