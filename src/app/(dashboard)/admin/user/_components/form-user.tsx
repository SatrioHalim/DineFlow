import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { ROLE_LIST } from "@/constants/auth-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className={"text-xl"}>{type} User</DialogTitle>
        <DialogDescription>
          {type === "Create"
            ? "Register a new user"
            : "Make changes to the user here"}
        </DialogDescription>
      </DialogHeader>
      <form id="form-create-user" onSubmit={onSubmit} className="space-y-4">
        <FieldGroup>
          <FormInput
            form={form}
            name={"name" as Path<T>}
            label="Name"
            placeholder="Insert user name"
          ></FormInput>
          {type === "Create" && (
            <FormInput
              form={form}
              name={"email" as Path<T>}
              label="Email"
              placeholder="Insert user email"
              type="email"
              autoComplete="email"
            ></FormInput>
          )}
          <FormImage
            form={form}
            name={"avatar_url" as Path<T>}
            label="Avatar"
            preview={preview}
            setPreview={setPreview}
          ></FormImage>
          <FormSelect
            form={form}
            name={"role" as Path<T>}
            label="Role"
            selectItem={ROLE_LIST}
          ></FormSelect>
          {type === "Create" && (
            <FormInput
              form={form}
              name={"password" as Path<T>}
              label="Password"
              placeholder="*****"
              type="password"
            ></FormInput>
          )}
        </FieldGroup>
      </form>
      <DialogFooter>
        <DialogClose
          render={<Button variant={"outline"}>Cancel</Button>}
        ></DialogClose>
        <Button type="submit" form="form-create-user">
          {isLoading ? <Loader2 className="animate-spin"></Loader2> : type}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
