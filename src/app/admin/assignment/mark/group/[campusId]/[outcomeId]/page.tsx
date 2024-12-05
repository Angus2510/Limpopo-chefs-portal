import MarkTable from './components/MarkTable'
export default async function Assignment({ params }: { params:{ campusId: string, outcomeId: string }}) {
 const campusId = params.campusId;
 const outcomeId = params.outcomeId;
    return (
            <div>
                <MarkTable
                campus= {campusId}
                outcome ={outcomeId}
                />
            </div>

    )
  }
  