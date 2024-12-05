import { redirect } from "next/navigation";
import DownloadsTable from './components/Downloads'
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';
 
export default async function Downloads() {
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
            <DownloadsTable studentId={user.id}/>
            </div>

    )
  }