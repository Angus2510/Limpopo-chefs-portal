import IntakeEdit from './components/IntakEdit'

export default async function StudentsAdd({ params }: { params: { id: string } }) {

    const id = params.id;
      
    return (
      <div>
        <IntakeEdit id ={id}/>
       </div>
    )
  }