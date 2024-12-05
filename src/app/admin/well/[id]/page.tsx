import SingleEstablishmentView from './components/SingleEstablishmentView';

export default async function Well({ params }: { params: { id: string } }) {

const wellId= params.id;

    return (
            <div>
               <SingleEstablishmentView id={wellId}/>
            </div>

    )
  }
  