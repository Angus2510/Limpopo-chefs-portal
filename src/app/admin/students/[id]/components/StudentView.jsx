"use client"
import React from 'react';
import Banner from "./Banner";
import General from "./General";
import EditBlock from './EditBLock';
import ActionList from './ActionList';
import StudentDetailsTable from './StudentDetailsTable';
import { useRouter } from 'next/navigation';
import DisabledBanner from './DisabledBanner';

import { useGetStudentByIdQuery } from '@/lib/features/students/studentsApiSlice';
import { useGetStudentFeesByIdQuery } from '@/lib/features/finance/financeApiSlice';

export default function Student({studentId}) {
  const router = useRouter();

 const id =studentId;

  const {
    data: studentData,
    isFetching,
    isSuccess,
    isError,
    error
  } = useGetStudentByIdQuery(studentId);

  const {
    data: studentFees,
    isFetching: isFetchingFees,
    isSuccess: isSuccessFees,
    isError: isErrorFees,
    error: errorFees
  } = useGetStudentFeesByIdQuery(studentId);

  const student = studentData?.entities[studentId];
  const isDisabled = student ? !student.active : false;
  const disabledReason = student?.inactiveReason || '';
  const amount = studentFees?.amount?.[0] || 0;
  const dueDate = studentFees?.dueDate?.[0] ? new Date(studentFees.dueDate[0]).toLocaleDateString() : '';
  const formatAccommodation = (accommodations) => {
    return accommodations.map(acc => `${acc.roomNumber}, ${acc.address}`).join('; ');
  };
  
  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.data?.message || 'Could not fetch the student'}</div>;
  }

  return (
    <div className="flex w-full flex-col gap-5 mb-5">
        {isDisabled && (
        <DisabledBanner reason={disabledReason} />
      )}
      {student ? (
        <div>
         <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
            <Banner
              name={`${student.profile.firstName} ${student.profile.lastName}`}
              avatar={student.profile.avatar}
              intakeGroup={student.intakeGroup?.map(c => c.title).join(', ')}
              studentNo={student.admissionNumber}
              campus={student.campus?.map(c => c.title).join(', ')}
              arrears ={amount}
              dueDate={dueDate}

            />
            <General
              accommodation={formatAccommodation(student.accommodations)}
              description={student.profile.description}
              gender={student.profile.gender}
              mobileNumber={student.profile.mobileNumber}
              email={student.email}
              idNumber={student.profile.idNumber}
              cityAndGuildNumber={student.profile.cityAndGuildNumber}
            />
          </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <EditBlock text={student.importantInformation} studentId={id} />
            <ActionList studentId={id} isDisabled ={isDisabled}/>
            </div>
         
           <div className="mt-5">
            <StudentDetailsTable studentId={id}/>
          </div>
        </div>
      ) : (
        <div>No student found.</div>
      )}
    </div>
  );
}
