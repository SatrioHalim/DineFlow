import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { deleteTable } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { Table } from "@/validations/table-validation";

export default function DialogDeleteTable({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Table;
  handleChangeAction: (open: boolean) => void;
  open: boolean;
}) {
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [deleteTableState, deleteTableAction, isPendingDeleteTable] =
    useActionState(deleteTable, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    if (!currentData?.id) {
      toast.error("Table data not found");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentData.id as string);

    lastHandledStatusRef.current = undefined;
    startTransition(() => {
      deleteTableAction(formData);
    });
  };

  useEffect(() => {
    if (
      deleteTableState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Delete Table Failed", {
        description: deleteTableState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      deleteTableState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Delete Table success");
      refetch();
      lastHandledStatusRef.current = "success";
      handleChangeAction?.(false);
    }
  }, [deleteTableState, deleteTableAction, refetch]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteTable}
      onSubmit={onSubmit}
      title="Table"
    ></DialogDelete>
  );
}
