"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Success() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const orderId = searchParams.get("order_id");

  const { mutate } = useMutation({
    mutationKey: ["mutateUpdateStatusOrder"],
    mutationFn: async () => {
      await supabase
        .from("orders")
        .update({
          status: "settled",
        })
        .eq("order_id", orderId);
    },
  });

  useEffect(() => {
    mutate();
  }, [orderId]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <CheckCircle className="size-15 text-green-400"></CheckCircle>
      <h1 className="text-2xl font-bold">Payment Success</h1>
      <Link href={"/order"}>
        <Button>Back To Order</Button>
      </Link>
    </div>
  );
}
