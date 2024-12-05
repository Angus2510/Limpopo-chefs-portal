"use client"
import React from 'react';
import Banner from "./Banner";
import General from "./General";
import EditBlock from './EditBLock';
import { useRouter } from 'next/navigation';
import CollectFeesTable from './CollectFeesTable';
import Card from '@/components/card/index';
import { useGetStudentByIdQuery } from '@/lib/features/students/studentsApiSlice';

export default function Student({studentId}) {
  const router = useRouter();
  const id = studentId
  
  console.log(id)
  const {
    data: studentData,
    isFetching,
    isSuccess,
    isError,
    error
  } = useGetStudentByIdQuery(studentId);

  const student = studentData?.entities[studentId];

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
    <div className="flex w-full flex-col gap-5">
      {student ? (
        <div>
        <Banner
              name={student.profile.firstName}
              avatar={student.profile.avatar}
              intakeGroup={student.intakeGroup?.map(c => c.title).join(', ')}
              studentNo={student.admissionNumber}
              campus={student.campus?.map(c => c.title).join(', ')}
              arrears ='R0'
              dueDate=' '

            />
         <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
         
           <General
              accommodation={formatAccommodation(student.accommodations)}
              description={student.profile.description}
              gender={student.profile.gender}  
              mobileNumber={student.profile.mobileNumber}
              email={student.email}
              idNumber={student.profile.idNumber}
              cityAndGuildNumber={student.profile.cityAndGuildNumber}
            />
          <EditBlock text={student.importantInformation} studentId={id} />
          </div>
        <Card className='mt-6 p-10'>
        <CollectFeesTable id = {id}/>
        </Card>
        </div>
      ) : (
        <div>No student found.</div>
      )}
    </div>
  );
}
