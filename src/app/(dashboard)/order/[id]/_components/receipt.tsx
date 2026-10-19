import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Receipt = ({
  order,
  orderMenu,
  orderId,
}: {
  order: {
    customer_name: string;
    tables: {
      name: string;
    }[];
    status: string;
    created_at: string;
  };
  orderMenu:
    | {
        menus: Menu;
        quantity: number;
        status: string;
        id: string;
        nominal: number;
      }[]
    | null
    | undefined;
  orderId: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="relative">
      <Button onClick={reactToPrintFn}>Print Receipt</Button>
      <div
        ref={contentRef}
        className="absolute -z-10 top-0 left-0 w-full bg-white p-6 text-black font-mono text-xs"
      >
        {/* Header */}
        <header className="text-center pb-4 border-b border-dashed border-gray-400">
          <h4 className="text-2xl font-bold tracking-tight font-sans">
            DineFlow
          </h4>
          <p className="mt-1 text-[10px] uppercase tracking-widest">
            Pantang Pulang Sebelum Kenyang
          </p>
          <p className="mt-1 text-[10px] text-gray-600">
            24 Kingsway Street, Covent Garden, London WC2B 6LH, United Kingdom
          </p>
        </header>

        {/* Transaction Information */}
        <section className="py-4 border-b border-dashed border-gray-400 space-y-2">
          <div className="flex justify-between gap-3">
            <span>Bill No.</span>
            <span className="font-bold text-right break-all">{orderId}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Table</span>
            <span className="font-bold text-right">
              {(order?.tables as unknown as { name: string })?.name ?? "-"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Customer</span>
            <span className="font-bold text-right wrap-break-word">
              {order?.customer_name || "Walk-in Customer"}
            </span>
          </div>

          <div className="flex justify-between items-start gap-3">
            <span>Date</span>
            <span className="font-bold text-right">
              {order?.created_at
                ? new Date(order.created_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </span>
          </div>
        </section>

        {/* Order Items */}
        <section className="py-4 border-b border-dashed border-gray-400 space-y-3">
          <div className="flex justify-between font-bold uppercase text-[10px]">
            <span>Item / Qty</span>
            <span>Amount</span>
          </div>

          {orderMenu?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="wrap-break-word leading-relaxed">
                  {item.menus.name}
                </p>
                <p className="text-gray-600 mt-0.5">Qty: {item.quantity}</p>
              </div>

              <p className="shrink-0 text-right tabular-nums">
                {convertIDR(item.nominal)}
              </p>
            </div>
          ))}
        </section>

        {/* Payment Summary */}
        <section className="py-4 space-y-2">
          <div className="flex justify-between gap-3">
            <span>Subtotal</span>
            <span className="text-right tabular-nums">
              {convertIDR(totalPrice)}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Tax</span>
            <span className="text-right tabular-nums">{convertIDR(tax)}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Service Charge</span>
            <span className="text-right tabular-nums">
              {convertIDR(service)}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-400 my-3" />

          <div className="flex justify-between items-start gap-3 font-sans">
            <span className="text-sm font-bold">GRAND TOTAL</span>
            <span className="text-sm font-bold text-right tabular-nums">
              {convertIDR(grandTotal)}
            </span>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-dashed border-gray-400 pt-4 mt-1 text-center">
          <p className="font-bold">Thank You for Dining With Us!</p>
          <p className="mt-1 text-gray-600">We hope to serve you again.</p>
          <p className="mt-3 text-[10px] text-gray-500">Powered by Shag.byte</p>
        </footer>
      </div>
    </div>
  );
};

export default Receipt;
