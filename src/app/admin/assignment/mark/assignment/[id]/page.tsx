import MarkTestDetails from './components/MarkTestDetails'
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';
import { redirect } from "next/navigation";



export default async function AssignmentMarkTest({ params }: { params: { id: string } }) {
  const cookieStore = require('next/headers').cookies;
  const accessToken = cookieStore().get('accessToken')?.value;

  let user: User | null = null;

  if (accessToken) {
    user = await fetchServerSession({ cookie: `accessToken=${accessToken}` });
  }

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/admin/test');
  }
  const id = params.id;

    return (
            <div>
              <MarkTestDetails id={id} staffId={user.id}/>
            </div>

    )
  }