import { redirect } from "next/navigation";
import { getAccounts } from "@/lib/actions/accounts";

export default async function Home() {
  const accounts = await getAccounts();
  if (accounts.length > 0) {
    redirect(`/${accounts[0].slug}`);
  }
  redirect("/all");
}
