"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Ban, Link2Icon, ScrollText } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Table } from "@/validations/table-validation";
import { HEADER_TABLE_ORDER } from "@/constants/order-constant";
import DialogCreateOrder from "./dialog-create-order";
import { updateReservation } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export default function OrderManagement() {
  const [openCreateOrderDialog, setOpenCreateOrderDialog] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  const supabase = createClient();
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleChangeSearch,
  } = useDataTable();
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("orders")
        .select(
          `
            id, order_id, customer_name, status, payment_token,tables (name,id)
            `,
          { count: "exact" },
        )
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        const filters = [
          `order_id.ilike.%${currentSearch}%`,
          `customer_name.ilike.%${currentSearch}%`,
        ];

        query.or(filters.join(","));
      }

      const result = await query;

      if (result.error) {
        toast.error("Get Order data failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const { data: tables, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const result = await supabase
        .from("tables")
        .select("*")
        .order("created_at")
        .order("status");
      return result.data;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Table;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const totalPages = useMemo(() => {
    return orders && orders.count !== null
      ? Math.ceil(orders.count / currentLimit)
      : 0;
  }, [orders]);

  const [reservedState, reservedAction] = useActionState(
    updateReservation,
    INITIAL_STATE_ACTION,
  );

  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const handleReservation = async ({
    id,
    table_id,
    status,
  }: {
    id: string;
    table_id: string;
    status: string;
  }) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();
    Object.entries({ id, table_id, status }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      reservedAction(formData);
    });
  };

  useEffect(() => {
    if (
      reservedState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Update Reservation Failed", {
        description: reservedState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      reservedState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Update Reservation Success");
      refetch();
      refetchTables();
      lastHandledStatusRef.current = "success";
    }
  }, [reservedState, reservedAction, refetch, refetchTables]);

  const reservedActionList = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Link2Icon></Link2Icon>
          Process
        </span>
      ),
      action: (id: string, table_id: string) => {
        handleReservation({ id, table_id, status: "process" });
      },
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Ban className="text-red-500"></Ban>
          Cancel
        </span>
      ),
      action: (id: string, table_id: string) => {
        handleReservation({ id, table_id, status: "canceled" });
      },
    },
  ];

  const filteredData = useMemo(() => {
    return (orders?.data || []).map((order, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        order.order_id,
        order.customer_name,
        (order.tables as unknown as { name: string }).name,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-lime-600": order.status === "settled",
            "bg-sky-600": order.status === "process",
            "bg-amber-600": order.status === "reserved",
            "bg-red-600": order.status === "canceled",
          })}
        >
          {order.status}
        </div>,
        <DropdownAction
          menu={
            order.status === "reserved" && profile.role !== "kitchen"
              ? reservedActionList.map((item) => ({
                  label: item.label,
                  action: () =>
                    item.action(
                      order.id,
                      (order.tables as unknown as { id: string }).id,
                    ),
                }))
              : [
                  {
                    label: (
                      <Link
                        href={`/order/${order.order_id}`}
                        className="flex items-center gap-2"
                      >
                        <ScrollText></ScrollText>
                        Detail
                      </Link>
                    ),
                  },
                ]
          }
        ></DropdownAction>,
      ];
    });
  }, [orders]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></Input>
          {profile.role !== "kitchen" && (
            <Dialog
              open={openCreateOrderDialog}
              onOpenChange={setOpenCreateOrderDialog}
            >
              <DialogTrigger
                render={<Button variant={"outline"}>Create</Button>}
              ></DialogTrigger>
              <DialogCreateOrder
                refetch={refetch}
                refetchTables={refetchTables}
                onSuccess={() => setOpenCreateOrderDialog(false)}
                tables={tables}
              ></DialogCreateOrder>
            </Dialog>
          )}
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_ORDER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      ></DataTable>
      {/* <DialogUpdateTable
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
      ></DialogDeleteTable> */}
    </div>
  );
}
