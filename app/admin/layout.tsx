'use client';

import React, { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user, loading } = useAuthStore();
  const router = useRouter();


  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show nothing while checking auth
  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white">
          <div className="flex justify-between items-center py-2 px-4">
            <p className="text-[24px] text-[212121]">Dashboard</p>
            <div className='flex gap-4 items-center'>
              <div className='flex relative border-[1px] border-[#CCCCCC] rounded-[100px] h-[32px] w-[200px]'>
                <>
                  <svg className='absolute top-[50%] translate-y-[-50%] left-[5px]' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.44865 15.5633C12.3031 15.5633 15.4278 12.4386 15.4278 8.58415C15.4278 4.72966 12.3031 1.60498 8.44865 1.60498C4.59416 1.60498 1.46948 4.72966 1.46948 8.58415C1.46948 12.4386 4.59416 15.5633 8.44865 15.5633Z" stroke="#212121" stroke-opacity="0.5" stroke-width="1.65296" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.1624 16.2979L14.6931 14.8286" stroke="#212121" stroke-opacity="0.5" stroke-width="1.65296" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </>
                <input placeholder='search' className='indent-[25px]' />
              </div>
              <>
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.0725 20.7264V15.9436C27.0704 13.8126 26.3141 11.7511 24.9377 10.1242C23.5613 8.49728 21.6536 7.40997 19.5524 7.0548V5.41541C19.5524 5.01651 19.3939 4.63396 19.1118 4.3519C18.8298 4.06984 18.4472 3.91138 18.0483 3.91138C17.6494 3.91138 17.2669 4.06984 16.9848 4.3519C16.7028 4.63396 16.5443 5.01651 16.5443 5.41541V7.0548C14.4431 7.40997 12.5354 8.49728 11.159 10.1242C9.78257 11.7511 9.02633 13.8126 9.02417 15.9436V20.7264C8.1465 21.0367 7.38628 21.6109 6.84775 22.3702C6.30922 23.1295 6.01873 24.0369 6.01611 24.9678V27.9758C6.01611 28.3747 6.17457 28.7573 6.45663 29.0393C6.73869 29.3214 7.12125 29.4799 7.52014 29.4799H12.2428C12.5891 30.7543 13.3452 31.8794 14.3944 32.6815C15.4437 33.4837 16.7276 33.9182 18.0483 33.9182C19.369 33.9182 20.653 33.4837 21.7022 32.6815C22.7514 31.8794 23.5075 30.7543 23.8539 29.4799H28.5765C28.9754 29.4799 29.358 29.3214 29.64 29.0393C29.9221 28.7573 30.0806 28.3747 30.0806 27.9758V24.9678C30.078 24.0369 29.7875 23.1295 29.2489 22.3702C28.7104 21.6109 27.9502 21.0367 27.0725 20.7264V20.7264ZM12.0322 15.9436C12.0322 14.348 12.6661 12.8178 13.7943 11.6896C14.9225 10.5613 16.4528 9.92749 18.0483 9.92749C19.6439 9.92749 21.1741 10.5613 22.3024 11.6896C23.4306 12.8178 24.0645 14.348 24.0645 15.9436V20.4557H12.0322V15.9436ZM18.0483 30.9839C17.5234 30.9807 17.0084 30.8402 16.5546 30.5764C16.1008 30.3125 15.7239 29.9345 15.4614 29.4799H20.6353C20.3728 29.9345 19.9959 30.3125 19.5421 30.5764C19.0883 30.8402 18.5733 30.9807 18.0483 30.9839ZM27.0725 26.4718H9.02417V24.9678C9.02417 24.5689 9.18263 24.1863 9.46469 23.9043C9.74675 23.6222 10.1293 23.4637 10.5282 23.4637H25.5685C25.9674 23.4637 26.3499 23.6222 26.632 23.9043C26.9141 24.1863 27.0725 24.5689 27.0725 24.9678V26.4718Z" fill="#324054" />
                </svg>
              </>
              <div className='min-h-[50px] min-w-[50px] max-h-[50px] max-w-[50px] bg-[#7372B7] rounded-[100px] flex justify-center items-center'>A</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 