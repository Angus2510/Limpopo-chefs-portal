import { redirect } from "next/navigation";
import EditStaffForm from './components/EditStaffForm';


export default async function SettingsStaffEdit({ params }: { params: { id: string } }) {
  const id = params.id;
    return (
      <div>
        <div>
            <EditStaffForm id={id}/>
         </div>
       </div>
    )
  }