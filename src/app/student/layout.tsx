import Navbar from "@/components/navbar";
import Sidebar from '@/components/sidebar/sidebar';
import Footer from "@/components/footer/Footer";

import NotificationRequest from '@/components/notifications/NotificationPermission'
import { SocketProvider } from '@/contexts/SocketContext';
import { fetchServerSession } from '@/utils/auth';
import { User } from '@/types/types';
import { redirect } from "next/navigation";

export default async function StudentLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
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
      <>
      <SocketProvider userId={user?.id}>
      {user && (
        <NotificationRequest id={user?.id} userType="Student" />
      )}
     <Sidebar />
     <Sidebar />
        <div className="h-full w-full bg-lightPrimary dark:!bg-dmgray-900">
        <main className='mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]'>
          <div className="h-full">
            <Navbar />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                 {children}
            </div>
            <div className="p-3">
             <Footer />
            </div>
          </div>
        </main>
        </div>
        </SocketProvider>
      </>
    );
  }