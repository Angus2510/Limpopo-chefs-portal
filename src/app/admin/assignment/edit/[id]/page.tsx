import EditTest from './components/EditTest';

export default async function AttendanceCreate({ params }: { params: { id: string } }) {
        const assignmentId = params.id;
   
    return (
            <div>
               <EditTest id={assignmentId }/>
            </div>

    )
  }
  