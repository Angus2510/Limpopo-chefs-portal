import EditStudentForm from './components/EditStudentForm';

export default async function StudentsAdd({ params }: { params: { id: string } }) {

    const id = params.id;
      
    return (
      <div>
        <EditStudentForm id={id}/>
       </div>
    )
  }