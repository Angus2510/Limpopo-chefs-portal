import Timesheet from "./components/Timesheet";
import type { Metadata } from "next";
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';
import { redirect } from "next/navigation";
  export const metadata: Metadata = {
    title: "Limpopo Chefs | Portal | Dashboard",
    description: "Limpopo Chefs Student Portal Home",
  };

  
export default async function Dashboard() {
  const cookieStore = require('next/headers').cookies;
  const accessToken = cookieStore().get('accessToken')?.value;

  if (!accessToken) {
    redirect('/auth/signin');
  }

  const user: User | null = await fetchServerSession({ cookie: `accessToken=${accessToken}` });

  if (!user) {
    redirect('/auth/signin');
  }
    return (
            <div>
               <Timesheet id={user.id}/>
            </div>

    )
  }
  