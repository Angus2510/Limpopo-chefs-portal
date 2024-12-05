import StaffView from './components/StaffView';
import Staff from "./components/StaffView";

export default async function SettingsStaff({ params }: { params: { id: string } }) {
const staffId = params.id;
    return (
      <div>
        <div>
          <StaffView staffId={staffId}/>
         </div>
       </div>
    )
  }