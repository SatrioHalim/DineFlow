import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrderTakeaway } from "../actions";
import {
  OrderTakeawayForm,
  orderTakeawayFormSchema,
} from "@/validations/order-validation";
import {
  INITIAL_ORDER_TAKEAWAY,
  INITIAL_STATE_ORDER_TAKEAWAY,
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type DialogCreateOrderProps = {
  closeDialog: () => void;
};

export default function DialogCreateOrderTakeaway({
  closeDialog,
}: DialogCreateOrderProps) {
  const form = useForm<OrderTakeawayForm>({
    resolver: zodResolver(orderTakeawayFormSchema),
    defaultValues: INITIAL_ORDER_TAKEAWAY,
  });

  const [createOrderState, createOrderAction, isPendingcreateOrder] =
    useActionState(createOrderTakeaway, INITIAL_STATE_ORDER_TAKEAWAY);
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
      closeDialog();
      lastHandledStatusRef.current = "success";
    }
  }, [createOrderState, createOrderAction, form, closeDialog]);

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className={"text-xl"}>Create Order Takeaway</DialogTitle>
        <DialogDescription>Add a new order from customer</DialogDescription>
      </DialogHeader>
      <form id="form-create-table" onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4 max-h-[50vh] p-1 overflow-y-auto">
          <FieldGroup className="pb-2">
            <FormInput
              form={form}
              name="customer_name"
              label="Customer Name"
              placeholder="Insert customer name here"
            ></FormInput>
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
