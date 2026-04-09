"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { verifySettingsPin } from "@/lib/actions/auth";

export function SettingsLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") ?? "/";
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await verifySettingsPin(pin);
    setLoading(false);
    if (result.ok) {
      router.push(next);
    } else {
      setError("Incorrect PIN. Try again.");
      setPin("");
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Settings Access</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your admin PIN to access settings.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="pin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            PIN
          </label>
          <input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter PIN"
            autoFocus
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Unlock Settings"}
        </button>
      </form>
    </div>
  );
}
