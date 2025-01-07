// src/app/admin/test/page.tsx
import { redirect } from "next/navigation";
import Timesheet from "./components/Timesheet";
import { fetchServerSession } from "@/utils/auth";
import { User } from "@/types/types";

export default async function Dashboard() {
  const cookieStore = require("next/headers").cookies;
  const accessToken = cookieStore().get("accessToken")?.value;

  let user: User | null = null;

  if (accessToken) {
    user = await fetchServerSession({ cookie: `accessToken=${accessToken}` });
  }

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/student/dashboard");
  }

  console.log("User ID:", user.id);

  return (
    <div>
      <Timesheet studentId={user.id} />
    </div>
  );
}
