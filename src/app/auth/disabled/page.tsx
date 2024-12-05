import { redirect } from "next/navigation";
import Disabled from './components/Disabled'
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';


export default async function AttendanceCreate() {
  const cookieStore = require('next/headers').cookies;
  const accessToken = cookieStore().get('accessToken')?.value;

  let user: User | null = null;

  if (accessToken) {
    user = await fetchServerSession({ cookie: `accessToken=${accessToken}` });
  }

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/admin/test');
  }
  console.log(user)
    return (
            <div>
               <Disabled Reason={user.inactiveReason}/>
            </div>

    )
  }
  