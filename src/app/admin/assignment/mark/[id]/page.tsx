import MarkTable from './components/MarkTable'
export default async function AssignmentMark({ params }: { params: { id: string } }) {
        const id = params.id;
    return (
        <div>
          <MarkTable id ={id}/>
        </div>

    )
  }
  