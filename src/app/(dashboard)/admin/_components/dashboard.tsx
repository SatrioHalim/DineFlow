"use client";

import InteractiveAreaChart from "@/components/common/interactive-area-chart";
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
    queryKey: ["revenue"],
    queryFn: async () => {
      const { data: dataThisMonth } = await supabase
        .from("orders_menus")
        .select("nominal, created_at")
        .gte("created_at", thisMonth); // gte : greater than or equal to

      const { data: dataLastMonth } = await supabase
        .from("orders_menus")
        .select("nominal, created_at")
        .gte("created_at", lastMonth)
        .lt("created_at", thisMonth); // lt : less than

      const totalRevenueThisMonth = (dataThisMonth ?? []).reduce(
        (sum, item) => {
          return sum + item.nominal;
        },
        0,
      ); // reduce : array function that reduces the array to a single value

      const totalRevenueLastMonth = (dataLastMonth ?? []).reduce(
        (sum, item) => {
          return sum + item.nominal;
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

  const { data: revenueTrend = [] } = useQuery({
    queryKey: ["revenue-trend"],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - 89);

      const { data, error } = await supabase
        .from("orders")
        .select("created_at, orders_menus(nominal)")
        .eq("status", "settled")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      const dailyRevenue: Record<string, number> = {};

      // Initialize 7 days, including days with no revenue.
      for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const key = date.toLocaleDateString("en-CA");
        dailyRevenue[key] = 0;
      }

      for (const order of data ?? []) {
        const date = new Date(order.created_at).toLocaleDateString("en-CA");

        const orderRevenue = (order.orders_menus ?? []).reduce(
          (sum, item) => sum + Number(item.nominal ?? 0),
          0,
        );

        if (date in dailyRevenue) {
          dailyRevenue[date] += orderRevenue;
        }
      }

      return Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
      }));
    },
  });

  console.log("revenueTrend", revenueTrend);

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
            <CardTitle className="text-3xl font-bold">
              {totalOrder ? totalOrder : 0}
            </CardTitle>
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
      <div className="mt-4">
        <InteractiveAreaChart data={revenueTrend}></InteractiveAreaChart>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Order Create Per Week</CardTitle>
            <CardDescription>
              Showing orders from {lastWeek.toLocaleDateString()} to{" "}
              {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          {orders ? (
            <div className="w-full h-64 p-6">
              <LineCharts data={orders}></LineCharts>
            </div>
          ) : (
            <div className="w-full h-64 p-6 flex items-center justify-center">
              <p className="text-muted-foreground text-2xl font-semibold">
                No data available
              </p>
            </div>
          )}
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
                      {(order?.tables as unknown as { name: string })?.name ??
                        "Takeaway order"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Order ID: {order?.order_id}
                    </p>
                  </div>
                  <Link href={`/order/${order?.order_id}`}>
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
