import CreateTest from './components/CreateTest';


export default async function AttendanceCreate({ params }: { params: { id: string } }) {
        const assignmentId = params.id;
    
    return (
            <div>
               <CreateTest id={assignmentId}/>
            </div>

    )
  }
  