import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { deleteMenu } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { Menu } from "@/validations/menu-validation";

export default function DialogDeleteMenu({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Menu;
  handleChangeAction: (open: boolean) => void;
  open: boolean;
}) {
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [deleteMenuState, deleteMenuAction, isPendingDeleteMenu] =
    useActionState(deleteMenu, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    if (!currentData?.id) {
      toast.error("Menu data not found");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentData.id as string);

    if (currentData.image_url) {
      formData.append("image_url", currentData.image_url as string);
    }

    lastHandledStatusRef.current = undefined;
    startTransition(() => {
      deleteMenuAction(formData);
    });
  };

  useEffect(() => {
    if (
      deleteMenuState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Delete Menu Failed", {
        description: deleteMenuState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      deleteMenuState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Delete menu success");
      refetch();
      lastHandledStatusRef.current = "success";
      handleChangeAction?.(false);
    }
  }, [deleteMenuState, deleteMenuAction, refetch]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteMenu}
      onSubmit={onSubmit}
      title="Menu"
    ></DialogDelete>
  );
}
