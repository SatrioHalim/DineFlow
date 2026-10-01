"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { HEADER_TABLE_DETAIL_ORDER } from "@/constants/order-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn, convertIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import Summary from "./summary";

export default function DetailOrder({ id }: { id: string }) {
  const supabase = createClient();
  const { currentLimit, currentPage, handleChangeLimit, handleChangePage } =
    useDataTable();
  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select(`id, customer_name, status, payment_url,tables (name,id)`)
        .eq("order_id", id)
        .single();

      if (result.error) {
        toast.error("Get Order data failed", {
          description: result.error.message,
        });
      }

      return result.data;
    },
    enabled: !!id,
  });

  const { data: orderMenu, isLoading: isLoadingOrderMenu } = useQuery({
    queryKey: ["orders_menu", order?.id, currentPage, currentLimit],
    queryFn: async () => {
      const result = await supabase
        .from("orders_menus")
        .select(` *, menus (id,name,image_url,price)`, { count: "exact" })
        .eq("order_id", order?.id)
        .order("status");

      if (result.error) {
        toast.error("Get Order Menu data failed", {
          description: result.error.message,
        });
      }

      return result;
    },
    enabled: !!order?.id,
  });

  const filteredData = useMemo(() => {
    return (orderMenu?.data || []).map((item, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2">
          <Image
            src={item.menus.image_url}
            alt={item.menus.name}
            width={40}
            height={40}
            className="rounded"
          ></Image>
          <div className="flex flex-col">
            {item.menus.name} x {item.quantity}
            <span className="text-xs text-muted-foreground">
              {item.notes || "No Notes"}
            </span>
          </div>
        </div>,
        <div>{convertIDR(item.menus.price * item.quantity)}</div>,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-gray-500": item.status === "pending",
            "bg-yellow-500": item.status === "process",
            "bg-blue-500": item.status === "ready",
            "bg-green-500": item.status === "served",
          })}
        >
          {item.status}
        </div>,
        "",
      ];
    });
  }, [orderMenu?.data]);

  const totalPages = useMemo(() => {
    return orderMenu && orderMenu.count !== null
      ? Math.ceil(orderMenu.count / currentLimit)
      : 0;
  }, [orderMenu]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-2xl font-bold">Detail Order</h1>
        <Link href={`/order/${id}/add`}>
          <Button>Add Order Item</Button>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="lg:w-2/3">
          <DataTable
            header={HEADER_TABLE_DETAIL_ORDER}
            isLoading={isLoadingOrderMenu}
            data={filteredData}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            onChangePage={handleChangePage}
            onChangeLimit={handleChangeLimit}
          ></DataTable>
        </div>
        <div className="lg:w-1/3">
          {order && (
            <Summary
              order={order}
              orderMenu={orderMenu?.data}
              id={id}
            ></Summary>
          )}
        </div>
      </div>
    </div>
  );
}
