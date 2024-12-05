'use client';

import React from 'react';
import Banner from "./Banner";
import General from "./General";
import EditBlock from './EditBLock';
import StudentDetailsTable from './StudentDetailsTable';
import { useRouter } from 'next/navigation';
import ActionList from './ActionList';

import { useGetAlumniByIdQuery } from '@/lib/features/alumni/alumniApiSlice';

export default function Alumni({ alumniId }) {
  const router = useRouter();

  const {
    data: alumniData,
    isFetching,
    isSuccess,
    isError,
    error
  } = useGetAlumniByIdQuery(alumniId);

  const alumni = alumniData?.entities[alumniId];

  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.data?.message || 'Could not fetch the alumni'}</div>;
  }

  return (
    <div className="flex w-full flex-col gap-5 mb-5">
      {alumni ? (
        <div>
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
            <Banner
              name={alumni?.profile?.firstName || 'N/A'}
              avatar={alumni?.profile?.avatar}
              intakeGroup={alumni?.intakeGroup?.map(c => c.title).join(', ')}
              studentNo={alumni?.admissionNumber}
              campus={'Alumni'}
            />
            <General
              result={alumni?.currentResult || 'Fail'}
              description={alumni?.profile?.description || ' '}
              gender={alumni?.profile?.gender || 'N/A'}
              mobileNumber={alumni?.profile?.mobileNumber || 'N/A'}
              email={alumni?.email || 'N/A'}
              idNumber={alumni?.profile?.idNumber || 'N/A'}
              cityAndGuildNumber={alumni?.profile?.cityAndGuildNumber || 'N/A'}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <EditBlock text={alumni?.importantInformation || 'N/A'} studentId={alumniId} />
            <ActionList studentId={alumniId}/>
          </div>

          <div className="mt-5">
            <StudentDetailsTable studentId={alumniId} />
          </div>
        </div>
      ) : (
        <div>No alumni found.</div>
      )}
    </div>
  );
}
