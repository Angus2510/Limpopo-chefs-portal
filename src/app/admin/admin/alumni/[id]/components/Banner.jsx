import React, { useState } from "react"; // Import React and useState hook
import Card from "@/components/card"; // Import Card component for layout
import Image from "next/image"; // Import Image component from Next.js for optimized image loading

// Helper function to get initials from the student's full name
const getInitials = (name) => {
  const initials = name
    .split(" ") // Split name by spaces to separate first and last names
    .map((part) => part[0]) // Get the first letter of each part of the name
    .join(""); // Join the initials together
  return initials.toUpperCase(); // Convert initials to uppercase
};

const Banner = ({
  name,
  avatar,
  intakeGroup,
  studentNo,
  campus,
  arrears,
  dueDate,
}) => {
  const [imageError, setImageError] = useState(false); // State to track if there's an error with loading the avatar image
  const initials = getInitials(name); // Get initials for the student from their name

  return (
    <Card className={"items-center w-full h-full p-[16px] bg-cover"}>
      {" "}
      {/* Card component to wrap content */}
      {/* Banner section with background image and avatar */}
      <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover bg-[url('/img/profile/banner.png')]">
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-gray-400 dark:!border-navy-700">
          {/* Check if avatar exists and no error occurred while loading it */}
          {avatar && !imageError ? (
            <Image
              className="h-full w-full rounded-full" // Apply rounded style to image
              src={avatar} // Image source for the student's avatar
              alt="" // Alt text for accessibility
              onError={() => setImageError(true)} // On error, set imageError to true
            />
          ) : (
            // If there's an error loading the image or no avatar is provided, show initials instead
            <span className="text-xl font-medium text-white">{initials}</span>
          )}
        </div>
      </div>
      {/* Information about the student */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {name}
        </h4>{" "}
        {/* Student's name */}
        <p className="text-base font-normal text-gray-600">
          {intakeGroup}
        </p>{" "}
        {/* Intake group */}
      </div>
      {/* Additional information section (student number and campus) */}
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {studentNo}
          </p>{" "}
          {/* Student number */}
          <p className="text-sm font-normal text-gray-600">Student Number</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {campus}
          </p>{" "}
          {/* Campus */}
          <p className="text-sm font-normal text-gray-600">Campus</p>
        </div>
      </div>
    </Card>
  );
};

export default Banner;
