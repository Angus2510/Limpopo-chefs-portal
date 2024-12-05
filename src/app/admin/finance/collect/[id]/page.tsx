import StudentView from './components/StudentView';

export default async function FinanceCollect({ params }: { params: { id: string } }) {


        const studentId = params.id;

    return (
            <div>
            <StudentView studentId={studentId}/>
            </div>

    )
  }
  