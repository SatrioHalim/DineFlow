"use client";

import LineCharts from "@/components/common/line-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { convertIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Dashboard() {
  const supabase = createClient();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);
  lastWeek.setHours(0, 0, 0, 0);

  const thisMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).toISOString();

  const lastMonth = new Date(new Date().getFullYear(), 0, 1).toISOString();

  const { data: orders } = useQuery({
    queryKey: ["orders-per-day"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("created_at")
        .eq("status", "settled")
        .gte("created_at", lastWeek.toISOString())
        .order("created_at");

      const counts: Record<string, number> = {};
      (data ?? []).forEach((order) => {
        const date = new Date(order.created_at).toISOString().slice(0, 10);
        counts[date] = (counts[date] || 0) + 1;
      });

      return Object.entries(counts).map(([name, total]) => ({ name, total }));
    },
  });

  const { data: revenue } = useQuery({
    queryKey: ["revenue-this-month"],
    queryFn: async () => {
      const { data: dataThisMonth } = await supabase
        .from("orders_menus")
        .select("quantity, menus (price), created_at")
        .gte("created_at", thisMonth); // gte : greater than or equal to

      const { data: dataLastMonth } = await supabase
        .from("orders_menus")
        .select("quantity, menus (price), created_at")
        .gte("created_at", lastMonth)
        .lt("created_at", thisMonth); // lt : less than

      const totalRevenueThisMonth = (dataThisMonth ?? []).reduce(
        (sum, item) => {
          const price = (item.menus as unknown as { price: number }).price;
          return sum + price * item.quantity;
        },
        0,
      ); // reduce : array function that reduces the array to a single value

      const totalRevenueLastMonth = (dataLastMonth ?? []).reduce(
        (sum, item) => {
          const price = (item.menus as unknown as { price: number }).price;
          return sum + price * item.quantity;
        },
        0,
      );

      const growthRate = (
        ((totalRevenueThisMonth - totalRevenueLastMonth) /
          totalRevenueLastMonth) *
        100
      ).toFixed(2); // toFixed : format number to 2 decimal places

      const daysInData = new Set(
        (dataThisMonth ?? []).map((item) => {
          return new Date(item.created_at).toISOString().slice(0, 10);
        }),
      ).size; // Set : a collection of unique values

      const averageRevenueThisMonth =
        daysInData > 0 ? totalRevenueThisMonth / daysInData : 0;

      return {
        totalRevenueThisMonth,
        totalRevenueLastMonth,
        averageRevenueThisMonth,
        growthRate,
      };
    },
  });

  const { data: totalOrder } = useQuery({
    queryKey: ["total-order"],
    queryFn: async () => {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact" })
        .eq("status", "settled")
        .gte("created_at", thisMonth);

      return count;
    },
  });

  const { data: lastOrder } = useQuery({
    queryKey: ["last-order"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,order_id,customer_name,status,tables(name,id)")
        .eq("status", "process")
        .limit(5)
        .order("created_at", { ascending: false });

      return data;
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {convertIDR(revenue?.totalRevenueThisMonth ?? 0)}
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <div className="text-muted-foreground text-sm">
              *Revenue this month
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average Revenue</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {convertIDR(revenue?.averageRevenueThisMonth ?? 0)}
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <div className="text-muted-foreground text-sm">
              *Average per day
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Order</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalOrder}</CardTitle>
          </CardHeader>
          <CardFooter>
            <div className="text-muted-foreground text-sm">
              *Order settled this month
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {revenue?.growthRate ?? 0}%
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <div className="text-muted-foreground text-sm">
              *Compared to last month
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Order Create Per Week</CardTitle>
            <CardDescription>
              Showing orders from {lastWeek.toLocaleDateString()} to{" "}
              {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <div className="w-full h-64 p-6">
            <LineCharts data={orders}></LineCharts>
          </div>
        </Card>
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Active Order</CardTitle>
            <CardDescription>Showing last 5 active orders</CardDescription>
          </CardHeader>
          <div className=" px-6">
            {lastOrder ? (
              lastOrder.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 justify-between mb-4"
                >
                  <div>
                    <h3 className="font-semibold">{order.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Table:{" "}
                      {(order.tables as unknown as { name: string }).name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Order ID: {order.order_id}
                    </p>
                  </div>
                  <Link href={`/order/${order.order_id}`}>
                    <Button className={"mt-2"} size={"sm"}>
                      Detail
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No active orders</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
