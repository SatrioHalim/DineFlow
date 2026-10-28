"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertIDR } from "@/lib/utils";
import { useMemo, useState } from "react";

type RevenueData = {
  date: string;
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#00bba7",
  },
} satisfies ChartConfig;

const formatDate = (value: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("id-ID", {
    ...options,
    timeZone: "Asia/Jakarta",
  });

export default function InteractiveAreaChart({
  data = [],
}: {
  data: RevenueData[];
}) {
  const [timeRange, setTimeRange] = useState("7d");

  const filteredData = useMemo(() => {
    const days = Number.parseInt(timeRange, 10);
    const latestDate = data.reduce(
      (latest, item) => (item.date > latest ? item.date : latest),
      data[0]?.date ?? "",
    );

    if (!latestDate) return [];

    const endDate = new Date(`${latestDate}T12:00:00`);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (days - 1));

    const startKey = [
      startDate.getFullYear(),
      String(startDate.getMonth() + 1).padStart(2, "0"),
      String(startDate.getDate()).padStart(2, "0"),
    ].join("-");

    return data.filter(
      (item) => item.date >= startKey && item.date <= latestDate,
    );
  }, [data, timeRange]);

  const description =
    timeRange === "7d"
      ? "Daily revenue for the last 7 days"
      : timeRange === "30d"
        ? "Daily revenue for the last 30 days"
        : "Daily revenue for the last 90 days";

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-3 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <Select
          value={timeRange}
          onValueChange={(value) => {
            if (value !== null) {
              setTimeRange(value);
            }
          }}
        >
          <SelectTrigger
            className="w-full sm:w-[160px]"
            aria-label="Select revenue period"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 8, right: 12, top: 12 }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) =>
                formatDate(value, { day: "numeric", month: "short" })
              }
            />

            <YAxis
              width={65}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                value >= 1_000_000
                  ? `Rp ${(value / 1_000_000).toFixed(1)}jt`
                  : value >= 1_000
                    ? `Rp ${(value / 1_000).toFixed(0)}rb`
                    : `Rp ${value}`
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    formatDate(String(value), {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                  formatter={(value) => convertIDR(Number(value))}
                />
              }
            />

            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="url(#fillRevenue)"
              connectNulls
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
