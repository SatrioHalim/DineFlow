"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILTER_MENU } from "@/constants/order-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import CardMenu from "./card-menu";
import LoadingCardMenu from "./loading-cart-menu";
import CartSection from "./cart";

export default function AddOrderItem({ id }: { id: string }) {
  const supabase = createClient();
  const {
    currentSearch,
    handleChangeSearch,
    currentFilter,
    handleChangeFilter,
  } = useDataTable();

  const { data: menus, isLoading: isLoadingMenu } = useQuery({
    queryKey: ["menus", currentSearch, currentFilter],
    queryFn: async () => {
      const query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .order("created_at")
        .eq("is_available", true)
        .ilike("name", `%${currentSearch}%`);

      if (currentFilter) {
        query.eq("category", currentFilter);
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

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="space-y-4 lg:w-2/3">
        <div className="flex flex-col items-center justify-between gap-4 w-full lg:flex-row">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <h1 className="text-2xl font-bold">Menu</h1>
            <div className="flex gap-2 ">
              {FILTER_MENU.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => handleChangeFilter(item.value)}
                  variant={currentFilter === item.value ? "default" : "outline"}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></Input>
        </div>
        {isLoadingMenu && !menus ? (
          <LoadingCardMenu></LoadingCardMenu>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-4">
            {menus?.data?.map((menu) => (
              <CardMenu menu={menu} key={`menu-${menu.id}`}></CardMenu>
            ))}
          </div>
        )}
        {!isLoadingMenu && menus?.data?.length === 0 && (
          <div className="text-center w-full font-semibold">Menu not found</div>
        )}
      </div>
      <div className="lg:w-1/3">
        <CartSection order={order}></CartSection>
      </div>
    </div>
  );
}
