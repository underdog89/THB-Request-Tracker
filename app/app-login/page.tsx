import { Suspense } from "react";
import { AppLoginForm } from "./AppLoginForm";

export default function AppLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Suspense fallback={null}>
        <AppLoginForm />
      </Suspense>
    </div>
  );
}
