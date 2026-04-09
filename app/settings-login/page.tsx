import { Suspense } from "react";
import { SettingsLoginForm } from "./SettingsLoginForm";

export default function SettingsLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Suspense fallback={null}>
        <SettingsLoginForm />
      </Suspense>
    </div>
  );
}
