import EditOutcome from './components/EditOutcome'


export default async function SettingsOutcomesEdit({ params }: { params: { id: string } }) {

  const id = params.id;
    return (
            <div>
                <EditOutcome id={id}/>
            </div>

    )
  }
  