import TestDetailsView from './components/TestViewDetails';

export default async function AssignmentView({ params }: { params: { id: string } }) {

    const assignmentId = params.id;
    return (
            <div>
               <TestDetailsView id={assignmentId}/>
            </div>

    )
  }