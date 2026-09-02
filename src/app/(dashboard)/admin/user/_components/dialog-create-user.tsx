import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
  ROLE_LIST,
} from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { createUser } from "../actions";
import { toast } from "sonner";
import FormSelect from "@/components/common/form-select";
import FormImage from "@/components/common/form-image";
import { Preview } from "@/types/general";
import FormUser from "./form-user";

type DialogCreateUserProps = {
  refetch: () => void;
  onSuccess: () => void;
};

export default function DialogCreateUser({
  refetch,
  onSuccess,
}: DialogCreateUserProps) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingcreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar_url") {
        if (preview?.file) {
          formData.append(key, preview.file);
        }
        return;
      }

      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      createUserAction(formData);
    });
  });

  useEffect(() => {
    if (
      createUserState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Create User Failed", {
        description: createUserState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      createUserState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Create user success");
      form.reset();
      onSuccess();
      refetch();
      setPreview(undefined);
      lastHandledStatusRef.current = "success";
    }
  }, [createUserState, createUserAction, form, onSuccess, refetch]);

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateUser}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    ></FormUser>
  );
}
