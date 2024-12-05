"use client"
import React from 'react';
import Banner from "./Banner";
import General from "./General";
import EditBlock from './EditBLock';
import { useRouter } from 'next/navigation';
import ActionList from './ActionList';
import { useGetStaffByIdQuery } from '@/lib/features/staff/staffApiSlice';

export default function Staff({staffId}) {
  const router = useRouter();


  const {
    data: staff,
    isFetching,
    isSuccess,
    isError, 
    error
  } = useGetStaffByIdQuery(staffId);

  const isDisabled = staff ? !staff.active : false;

  return (
    <div className="flex w-full flex-col gap-5">
      {staff ? (
        <div>
         <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
            <Banner
              name={staff.profile.firstName}
              avatar={staff.avatar}
              role={staff.role}
              staffNo={staff.username}
              department={staff.department}
            />
            <General
              roles={staff.roles?.map(c => c.roleName).join(', ')}
              description={staff.profile.description}
              gender={staff.profile.gender}
              mobileNumber={staff.profile.mobileNumber}
              email={staff.email}
              idNumber={staff.profile.idNumber}
              dateOfBirth={staff.profile.dateOfBirth}
            />
          <ActionList staffId={staffId} isDisabled ={isDisabled}/>

          <EditBlock/>

          </div>
        </div>
      ) : (
        <div>No staff member found.</div>
      )}
    </div>
  );
}
