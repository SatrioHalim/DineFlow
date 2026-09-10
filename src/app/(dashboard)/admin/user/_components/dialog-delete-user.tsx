import DialogDelete from "@/components/common/dialog-delete";
import { Profile } from "@/types/auth";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { deleteUser } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";

export default function DialogDeleteUser({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Profile;
  handleChangeAction: (open: boolean) => void;
  open: boolean;
}) {
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [deleteUserState, deleteUserAction, isPendingDeleteUser] =
    useActionState(deleteUser, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    if (!currentData?.id) {
      toast.error("User data not found");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentData.id as string);

    if (currentData.avatar_url) {
      formData.append("avatar_url", currentData.avatar_url as string);
    }

    lastHandledStatusRef.current = undefined;
    startTransition(() => {
      deleteUserAction(formData);
    });
  };

  useEffect(() => {
    if (
      deleteUserState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Delete User Failed", {
        description: deleteUserState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      deleteUserState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Delete user success");
      refetch();
      lastHandledStatusRef.current = "success";
      handleChangeAction?.(false);
    }
  }, [deleteUserState, deleteUserAction, refetch]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteUser}
      onSubmit={onSubmit}
      title="User"
    ></DialogDelete>
  );
}
