import StudentView from "./components/StudentView";

export default async function AlumniView({
  params,
}: {
  params: { id: string };
}) {
  const studentId = params.id;
  return (
    <div>
      <div>
        <StudentView alumniId={studentId} />
      </div>
    </div>
  );
}
