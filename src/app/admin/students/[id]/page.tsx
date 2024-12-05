import StudentView from './components/StudentView';

export default async function Student({ params }: { params: { id: string } }) {

    const studentId = params.id;

    return (
      <div>
        <div>
         <StudentView studentId={studentId}/>
         </div>
       </div>
    )
  }