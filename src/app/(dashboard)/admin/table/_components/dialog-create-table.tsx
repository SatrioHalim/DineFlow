import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TableForm, tableFormSchema } from "@/validations/table-validation";
import { INITIAL_STATE_TABLE, INITIAL_TABLE } from "@/constants/table-constant";
import FormTable from "./form-table";
import { createTable } from "../actions";

type DialogCreateTableProps = {
  refetch: () => void;
  onSuccess?: () => void;
};

export default function DialogCreateTable({
  refetch,
  onSuccess,
}: DialogCreateTableProps) {
  const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: INITIAL_TABLE,
  });

  const [createTableState, createTableAction, isPendingcreateTable] =
    useActionState(createTable, INITIAL_STATE_TABLE);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      createTableAction(formData);
    });
  });

  useEffect(() => {
    if (
      createTableState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Create Table Failed", {
        description: createTableState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      createTableState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Create Table Success");
      form.reset();
      onSuccess?.();
      refetch();
      lastHandledStatusRef.current = "success";
    }
  }, [createTableState, createTableAction, form, onSuccess, refetch]);

  return (
    <FormTable
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateTable}
      type="Create"
    ></FormTable>
  );
}
