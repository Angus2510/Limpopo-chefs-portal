import { redirect } from "next/navigation";
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';

export default async function Assignment() {

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
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-semibold mb-4">Test Submitted</h1>
          <p className="text-lg mb-4">Your test has been submitted.</p>
          <p className="text-md text-gray-600">Thank you for completing the test.</p>
        </div>
      </div>

    );
  }