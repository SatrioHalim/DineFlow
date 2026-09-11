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
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Profile } from "@/types/auth";
import { Menu } from "@/validations/menu-validation";
import Image from "next/image";
import { cn, convertIDR } from "@/lib/utils";
import { HEADER_TABLE_MENU } from "@/constants/menu-constant";
import DialogCreateMenu from "./dialog-create-menu";

export default function MenuManagement() {
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
    data: menus,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menus", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%, category.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get Menu data failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Menu;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (menus?.data || []).map((menu: Menu, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2">
          <Image
            src={menu.image_url as string}
            alt={menu.name}
            width={40}
            height={40}
            className="rounded"
          ></Image>
          {menu.name}
        </div>,
        menu.category,
        <div>
          <p>Base: {convertIDR(menu.price)}</p>
          <p>Discount: {menu.discount}%</p>
          <p className="font-bold">
            After Discount:{" "}
            {convertIDR(menu.price - (menu.price * menu.discount) / 100)}
          </p>
        </div>,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            menu.is_available ? "bg-green-500" : "bg-red-500",
          )}
        >
          {menu.is_available ? "Available" : "Not Available"}
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
                  data: menu,
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
                  data: menu,
                  type: "delete",
                });
              },
            },
          ]}
        ></DropdownAction>,
      ];
    });
  }, [menus]);

  const totalPages = useMemo(() => {
    return menus && menus.count !== null
      ? Math.ceil(menus.count / currentLimit)
      : 0;
  }, [menus]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or category"
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></Input>
          <Dialog
            open={openCreateUserDialog}
            onOpenChange={setOpenCreateUserDialog}
          >
            <DialogTrigger
              render={<Button variant={"outline"}>Create</Button>}
            ></DialogTrigger>
            <DialogCreateMenu
              refetch={refetch}
              onSuccess={() => setOpenCreateUserDialog(false)}
            ></DialogCreateMenu>
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_MENU}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      ></DataTable>
      {/* <DialogUpdateUser
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      ></DialogUpdateUser>
      <DialogDeleteUser
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      ></DialogDeleteUser> */}
    </div>
  );
}
