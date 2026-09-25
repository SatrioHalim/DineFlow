import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Table } from "@/validations/table-validation";
import { createOrder } from "../actions";
import { OrderForm, orderFormSchema } from "@/validations/order-validation";
import {
  INITIAL_ORDER,
  INITIAL_STATE_ORDER,
  STATUS_CREATE_ORDER,
} from "@/constants/order-constant";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type DialogCreateOrderProps = {
  refetch: () => void;
  refetchTables: () => void;
  onSuccess?: () => void;
  tables: Table[] | undefined | null;
};

export default function DialogCreateOrder({
  refetch,
  refetchTables,
  onSuccess,
  tables,
}: DialogCreateOrderProps) {
  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: INITIAL_ORDER,
  });

  const [createOrderState, createOrderAction, isPendingcreateOrder] =
    useActionState(createOrder, INITIAL_STATE_ORDER);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      createOrderAction(formData);
    });
  });

  useEffect(() => {
    if (
      createOrderState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Create Order Failed", {
        description: createOrderState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      createOrderState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Create Order Success");
      form.reset();
      onSuccess?.();
      refetch();
      refetchTables();
      lastHandledStatusRef.current = "success";
    }
  }, [
    createOrderState,
    createOrderAction,
    form,
    onSuccess,
    refetch,
    refetchTables,
  ]);

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className={"text-xl"}>Create Order</DialogTitle>
        <DialogDescription>Add a new order from customer</DialogDescription>
      </DialogHeader>
      <form id="form-create-table" onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4 max-h-[50vh] px-1 overflow-y-auto">
          <FieldGroup className="pb-2">
            <FormInput
              form={form}
              name="customer_name"
              label="Customer Name"
              placeholder="Insert customer name here"
            ></FormInput>
            <FormSelect
              form={form}
              name="table_id"
              label="Table"
              selectItem={(tables ?? []).map((table: Table) => ({
                value: `${table.id}`,
                label: `${table.name} - ${table.status} (${table.capacity} seats)`,
                disabled: table.status !== "available",
              }))}
            ></FormSelect>
            <FormSelect
              form={form}
              name="status"
              label="Status"
              selectItem={STATUS_CREATE_ORDER}
            ></FormSelect>
          </FieldGroup>
        </div>
      </form>
      <DialogFooter>
        <DialogClose
          render={<Button variant={"outline"}>Cancel</Button>}
        ></DialogClose>
        <Button type="submit" form="form-create-table">
          {isPendingcreateOrder ? (
            <Loader2 className="animate-spin"></Loader2>
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
