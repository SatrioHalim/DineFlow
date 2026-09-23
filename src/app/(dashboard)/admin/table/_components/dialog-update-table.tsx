import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableForm,
  tableFormSchema,
} from "@/validations/table-validation";
import { INITIAL_STATE_TABLE } from "@/constants/table-constant";
import { updateTable } from "../actions";
import FormTable from "./form-table";

type DialogUpdateTableProps = {
  refetch: () => void;
  currentData?: Table;
  handleChangeAction?: (open: boolean) => void;
  open?: boolean;
};

export default function DialogUpdateTable({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: DialogUpdateTableProps) {
  const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
  });

  const [updateTableState, updateTableAction, isPendingupdateTable] =
    useActionState(updateTable, INITIAL_STATE_TABLE);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateTableAction(formData);
    });
  });

  useEffect(() => {
    if (
      updateTableState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Update Table failed", {
        description: updateTableState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      updateTableState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Update Table success");
      form.reset();
      refetch();
      lastHandledStatusRef.current = "success";
      handleChangeAction?.(false);
    }
  }, [updateTableState, updateTableAction, form, refetch]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("description", currentData.description);
      form.setValue("capacity", currentData.capacity.toString());
      form.setValue("status", currentData.status);
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingupdateTable}
        type="Update"
      ></FormTable>
    </Dialog>
  );
}
