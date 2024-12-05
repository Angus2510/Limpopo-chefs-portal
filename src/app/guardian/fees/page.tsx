import { redirect } from "next/navigation";
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';
import Fees from './components/fees'

export default async function Student() {

  const cookieStore = require('next/headers').cookies;
  const accessToken = cookieStore().get('accessToken')?.value;

  let user: User | null = null;

  if (accessToken) {
    user = await fetchServerSession({ cookie: `accessToken=${accessToken}` });
  }

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/admin/test');
  }

    return (
            <div>
               <Fees guardianId={user.id}/>
           </div>

    );
  }
  