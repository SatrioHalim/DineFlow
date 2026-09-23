"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Table } from "@/validations/table-validation";
import { HEADER_TABLE_TABLE } from "@/constants/table-constant";
import DialogCreateTable from "./dialog-create-table";
import DialogUpdateTable from "./dialog-update-table";
import DialogDeleteTable from "./dialog-delete-table";

export default function TableManagement() {
  const supabase = createClient();
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleChangeSearch,
  } = useDataTable();
  const {
    data: tables,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tables", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("tables")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        const filters = [
          `name.ilike.%${currentSearch}%`,
          `status.ilike.%${currentSearch}%`,
          `description.ilike.%${currentSearch}%`,
        ];
        const capacitySearch = Number(currentSearch);

        if (Number.isFinite(capacitySearch)) {
          filters.push(`capacity.eq.${capacitySearch}`);
        }

        query.or(filters.join(","));
      }

      const result = await query;

      if (result.error) {
        toast.error("Get Table data failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Table;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (tables?.data || []).map((table: Table, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div>
          <h4 className="font-bold">{table.name}</h4>
          <p className="text-xs">{table.description}</p>
        </div>,
        table.capacity,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": table.status === "available",
            "bg-red-600": table.status === "unavailable",
            "bg-yellow-600": table.status === "reserved",
          })}
        >
          {table.status}
        </div>,
        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil></Pencil>
                  Edit
                </span>
              ),
              action: () => {
                setSelectedAction({
                  data: table,
                  type: "update",
                });
              },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="text-red-400"></Trash2>
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {
                setSelectedAction({
                  data: table,
                  type: "delete",
                });
              },
            },
          ]}
        ></DropdownAction>,
      ];
    });
  }, [tables]);

  const totalPages = useMemo(() => {
    return tables && tables.count !== null
      ? Math.ceil(tables.count / currentLimit)
      : 0;
  }, [tables]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></Input>
          <Dialog
            open={openCreateUserDialog}
            onOpenChange={setOpenCreateUserDialog}
          >
            <DialogTrigger
              render={<Button variant={"outline"}>Create</Button>}
            ></DialogTrigger>
            <DialogCreateTable
              refetch={refetch}
              onSuccess={() => setOpenCreateUserDialog(false)}
            ></DialogCreateTable>
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_TABLE}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      ></DataTable>
      <DialogUpdateTable
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      ></DialogUpdateTable>
      <DialogDeleteTable
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      ></DialogDeleteTable>
    </div>
  );
}
