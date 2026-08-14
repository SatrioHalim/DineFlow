"use client";

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
import { Input } from "@/components/ui/input";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";
import { LoginForm, loginSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insert your email"
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-login-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="*****"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
