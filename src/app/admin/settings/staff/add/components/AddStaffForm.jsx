"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Card from "@/components/card/index";
import RoleSelect from "@/components/select/RoleSelect";
import IndividualRoles from "./SingleUserRoles";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAddNewStaffMutation } from "@/lib/features/staff/staffApiSlice";
import Image from "next/image";

export default function NewStaffForm() {
  const [addNewStaff, { isSuccess, isLoading, isError, error }] =
    useAddNewStaffMutation();
  const router = useRouter();

  // Staff Member State
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [homeLanguage, setHomeLanguage] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showIndividualRoles, setShowIndividualRoles] = useState(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (isSuccess) {
      router.push("/admin/settings/staff");
    }
  }, [isSuccess, router]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      alert("File is too large. Maximum size is 5MB.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handlePermissionChange = (page, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [permission]: !prev[page]?.[permission],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      const formData = new FormData();

      if (photo) formData.append("photo", photo);

      formData.append("username", username);
      formData.append("email", email);
      formData.append("profile[firstName]", firstName);
      formData.append("profile[lastName]", lastName);
      formData.append("profile[dateOfBirth]", dateOfBirth);
      formData.append("profile[idNumber]", idNumber);
      formData.append("profile[gender]", gender);
      formData.append("profile[homeLanguage]", homeLanguage);
      formData.append("profile[position]", position);
      formData.append("profile[department]", department);
      formData.append("profile[designation]", designation);
      formData.append("profile[mobileNumber]", mobileNumber);
      selectedRoles.forEach((role, index) => {
        formData.append(`roles[${index}]`, role);
      });

      const userPermissionsArray = Object.keys(permissions).map((page) => ({
        page,
        permissions: permissions[page],
      }));

      formData.append("userPermissions", JSON.stringify(userPermissionsArray));

      try {
        const result = await addNewStaff(formData).unwrap();
        console.log("Staff added successfully", result);
      } catch (err) {
        console.error("Failed to save the staff member:", err);
      }
    }
  };

  return (
    <Card>
      <form
        className="m-10"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Staff Member Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              All the details about the staff member
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div
                  {...getRootProps()}
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-gray-600">Drop the files here ...</p>
                  ) : (
                    <div className="text-center">
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-600 focus-within:ring-offset-2 hover:text-brand-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            {...getInputProps()}
                          />
                        </label>
                        <span className="pl-1">or drag and drop</span>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {photo && (
                        <p className="mt-2 text-sm text-gray-600">
                          {photo.name}
                        </p>
                      )}
                      {photoPreview && (
                        <div className="mt-2">
                          <Image
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-full mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date of Birth
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Gender
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    autoComplete="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ID Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="idNumber"
                    id="idNumber"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="homeLanguage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Home Language
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="homeLanguage"
                    id="homeLanguage"
                    value={homeLanguage}
                    onChange={(e) => setHomeLanguage(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Position
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Department
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Designation
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="designation"
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mobile Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <RoleSelect
                  selectedRoles={selectedRoles}
                  setSelectedRoles={setSelectedRoles}
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Individual Access
            </h2>
            <button
              className="flex items-center text-sm font-semibold leading-6 text-gray-900 mt-4"
              onClick={(e) => {
                e.preventDefault();
                setShowIndividualRoles(!showIndividualRoles);
              }}
            >
              {showIndividualRoles
                ? "Hide Individual Roles"
                : "Show Individual Roles"}
              {showIndividualRoles ? (
                <FiChevronUp className="ml-1" />
              ) : (
                <FiChevronDown className="ml-1" />
              )}
            </button>
            {showIndividualRoles && (
              <IndividualRoles
                handlePermissionChange={handlePermissionChange}
                permissions={permissions}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => router.push("/admin/settings/staff")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.5a.5.5 0 011 0V4a8 8 0 01-8 8zm8 8a8 8 0 008-8h1.5a.5.5 0 010 1H20a8 8 0 00-8 8z"
                ></path>
              </svg>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}
