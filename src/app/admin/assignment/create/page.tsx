import { fetchServerSession } from "@/utils/auth"; // Import function to fetch the server session for user authentication
import { User } from "@/types/types"; // Import User type definition for type safety
import TestDetailsForm from "./components/TestDetailsForm"; // Import the TestDetailsForm component
import { redirect } from "next/navigation"; // Import redirect function

export default async function AttendanceCreate({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // Get the id from params

  // Access the cookies from the request headers to retrieve the access token
  const cookieStore = require("next/headers").cookies;
  const accessToken = cookieStore().get("accessToken")?.value; // Get the access token from cookies

  let user: User | null = null; // Initialize user as null initially

  // If accessToken exists, fetch the user session details from the server
  if (accessToken) {
    user = await fetchServerSession({ cookie: `accessToken=${accessToken}` });
  }

  // If user is not authenticated, redirect to the login page
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin/test"); // Redirect to the login page with a callback URL to return to the current page
  }

  // If user is authenticated, render the TestDetailsForm component and pass the user ID as a prop
  return (
    <div>
      {/* Pass the authenticated user's ID to the TestDetailsForm component */}
      <TestDetailsForm id={user.id} />
    </div>
  );
}
