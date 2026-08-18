"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";
import { LoginForm, loginSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner"; // bisa buat notif sukses ?

export function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>Login to access all features.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={onSubmit} className="space-y-4">
          <FieldGroup>
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Insert your email"
              type="email"
              autoComplete="email"
            ></FormInput>
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeholder="*****"
              type="password"
              autoComplete="current-password"
            ></FormInput>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-center">
          <Button type="submit" form="form-login" className={"w-60 mt-5"}>
            Login
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
