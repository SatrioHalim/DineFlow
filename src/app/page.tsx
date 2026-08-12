import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div>
      <Button className={'dark:bg-amber-300'}>Hello</Button>
      <DarkModeToggle />
    </div>
  );
}
