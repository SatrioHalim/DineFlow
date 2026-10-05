import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}
