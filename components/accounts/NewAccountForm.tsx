"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount } from "@/lib/actions/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewAccountForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSaving(true);
    setError("");
    try {
      const account = await createAccount(trimmed);
      router.push(`/${account.slug}/settings`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Unique constraint")) {
        setError("An account with this name already exists.");
      } else {
        setError("Failed to create account. Please try again.");
      }
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          Account Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme Hospital"
          autoFocus
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <p className="text-xs text-gray-400">
          A URL-friendly slug will be generated automatically (e.g. &ldquo;Acme Hospital&rdquo; → /acme-hospital).
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? "Creating..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
