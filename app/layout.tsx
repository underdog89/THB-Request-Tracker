import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { getAccounts } from "@/lib/actions/accounts";

export const metadata: Metadata = {
  title: "Request Tracking Dashboard",
  description: "Multi-account request & commercial tracking",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accounts = await getAccounts();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <TopNav accounts={accounts} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
