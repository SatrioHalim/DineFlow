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

  const [preview, setPreview] = useState<
    { file: File; displayUrl: string } | undefined
  >(undefined);

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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className={"text-xl"}>Create User</DialogTitle>
        <DialogDescription>register a new user</DialogDescription>
      </DialogHeader>
      <form id="form-create-user" onSubmit={onSubmit} className="space-y-4">
        <FieldGroup>
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Insert user name"
          ></FormInput>
          <FormInput
            form={form}
            name="email"
            label="Email"
            placeholder="Insert user email"
            type="email"
            autoComplete="email"
          ></FormInput>
          <FormSelect
            form={form}
            name="role"
            label="Role"
            selectItem={ROLE_LIST}
          ></FormSelect>
          <FormImage
            form={form}
            name="avatar_url"
            label="Avatar"
            preview={preview}
            setPreview={setPreview}
          ></FormImage>
          <FormInput
            form={form}
            name="password"
            label="Password"
            placeholder="*****"
            type="password"
          ></FormInput>
        </FieldGroup>
      </form>
      <DialogFooter>
        <DialogClose
          render={<Button variant={"outline"}>Cancel</Button>}
        ></DialogClose>
        <Button type="submit" form="form-create-user">
          {isPendingcreateUser ? (
            <Loader2 className="animate-spin"></Loader2>
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
