import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CartSection({
  order,
}: {
  order:
    | {
        customer_name: string;
        tables: {
          name: string;
        }[];
        status: string;
      }
    | undefined
    | null;
}) {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        {order && (
          <div className="space-y-4">
            <div>
              <Label className="space-y-2">Name</Label>
              <Input value={order?.customer_name} disabled></Input>
            </div>
            <div>
              <Label className="space-y-2">Table</Label>
              <Input
                value={(order?.tables as unknown as { name: string })?.name}
                disabled
              ></Input>
            </div>
          </div>
        )}
        <Separator></Separator>
      </CardContent>
    </Card>
  );
}
