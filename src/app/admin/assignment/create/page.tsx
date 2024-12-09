import CreateTest from "./components/CreateTest"; // Import the CreateTest component to render for test creation
import { redirect } from "next/navigation"; // Import redirect function to navigate to a different page

import { fetchServerSession } from "@/utils/auth"; // Import function to fetch the server session for user authentication
import { User } from "@/types/types"; // Import User type definition for type safety

export default async function AttendanceCreate() {
  // Access the cookies from the request headers to retrieve the access token
  const cookieStore = require("next/headers").cookies;
  const accessToken = cookieStore().get("accessToken")?.value; // Get the access token from cookies

  let user: User | null = null; // Initialize user as null initially

  // If accessToken exists, fetch the user session details from the server
  if (accessToken) {
    user = await fetchServerSession({ cookie: `accessToken=${accessToken}` });
  }

  // If no user is found (i.e., no valid session), redirect to the sign-in page
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin/test"); // Redirect to the login page with a callback URL to return to the current page
  }

  // If user is authenticated, render the CreateTest component and pass the user ID as a prop
  return (
    <div>
      {/* Pass the authenticated user's ID to the CreateTest component */}
      <CreateTest id={user.id} />
    </div>
  );
}
