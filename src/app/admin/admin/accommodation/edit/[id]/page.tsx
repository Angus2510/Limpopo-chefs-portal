import EditAccommodation from "./components/EditAccommodation";

export default async function AccommodationEdit({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  return (
    <div>
      <EditAccommodation id={id} />
    </div>
  );
}
