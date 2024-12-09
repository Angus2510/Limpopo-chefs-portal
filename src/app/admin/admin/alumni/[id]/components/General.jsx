import Card from "@/components/card"; // Importing the Card component to wrap the content
import React from "react"; // Importing React

// General component to display various general information of a student
const General = ({
  result,
  gender,
  mobileNumber,
  email,
  idNumber,
  cityAndGuildNumber,
  description,
}) => {
  return (
    <Card className={" w-full h-full p-3"}>
      {" "}
      {/* Card component wrapping the content */}
      {/* Header Section */}
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          General Information
        </h4>
        {/* Description text under the header */}
        <p className="mt-2 px-2 text-base text-gray-600">
          {description} {/* Displaying the description prop */}
        </p>
      </div>
      {/* Cards Section - A grid to display multiple data points */}
      <div className="grid grid-cols-2 gap-4 px-2">
        {/* Result Card */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Result</p>{" "}
          {/* Label for the card */}
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {result} {/* Displaying the result prop */}
          </p>
        </div>

        {/* Gender Card */}
        <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Gender</p>{" "}
          {/* Label for the card */}
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {gender} {/* Displaying the gender prop */}
          </p>
        </div>

        {/* Mobile Number Card */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Mobile Number</p>{" "}
          {/* Label for the card */}
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {mobileNumber} {/* Displaying the mobileNumber prop */}
          </p>
        </div>

        {/* Email Card */}
        <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Email</p>{" "}
          {/* Label for the card */}
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {email} {/* Displaying the email prop */}
          </p>
        </div>

        {/* ID/Passport Number Card */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">ID/Passport Number</p>{" "}
          {/* Label for the card */}
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {idNumber} {/* Displaying the idNumber prop */}
          </p>
        </div>

        {/* City & Guilds Registration No. Card */}
        <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">
            City & Guilds Registration No.
          </p>{" "}
          {/* Label for the card */}
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {cityAndGuildNumber} {/* Displaying the cityAndGuildNumber prop */}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default General;
