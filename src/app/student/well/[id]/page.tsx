import SingleEstablishmentView from './components/SingleEstablishmentView'
import { redirect } from "next/navigation";
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';

export default async function WellView({ params }: { params: { id: string } }) {
  const wellId= params.id;
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
              <SingleEstablishmentView id={wellId}/>
            </div>

    )
  }
  