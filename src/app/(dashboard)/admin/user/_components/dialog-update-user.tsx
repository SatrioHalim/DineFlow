import { INITIAL_STATE_UPDATE_USER } from "@/constants/auth-constant";
import {
  UpdateUserForm,
  updateUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "../actions";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import FormUser from "./form-user";
import { Profile } from "@/types/auth";
import { Dialog } from "@/components/ui/dialog";

type DialogUpdateUserProps = {
  refetch: () => void;
  currentData?: Profile;
  handleChangeAction?: (open: boolean) => void;
  open?: boolean;
};

export default function DialogUpdateUser({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: DialogUpdateUserProps) {
  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  const [updateUserState, updateUserAction, isPendingupdateUser] =
    useActionState(updateUser, INITIAL_STATE_UPDATE_USER);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();
    if (currentData?.avatar_url !== data.avatar_url) {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatar_url") {
          if (preview?.file) {
            formData.append(key, preview.file);
          }
          return;
        }

        formData.append(key, String(value ?? ""));
      });
      formData.append("old_avatar_url", currentData?.avatar_url ?? "");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateUserAction(formData);
    });
  });

  useEffect(() => {
    if (
      updateUserState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Update user failed", {
        description: updateUserState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      updateUserState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Update user success");
      form.reset();
      refetch();
      lastHandledStatusRef.current = "success";
      handleChangeAction?.(false);
    }
  }, [updateUserState, updateUserAction, form, refetch]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name as string);
      form.setValue("role", currentData.role as string);
      form.setValue("avatar_url", currentData.avatar_url as string);
      setPreview({
        file: new File([], currentData.avatar_url as string),
        displayUrl: currentData.avatar_url as string,
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingupdateUser}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      ></FormUser>
    </Dialog>
  );
}
