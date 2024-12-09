"use client";

import React, { useEffect, useState } from "react";
import {
  useGetWelByIdQuery,
  useUpdateWelMutation,
  useDeleteWelMutation,
} from "@/lib/features/wel/welApiSlice";
import { useRouter } from "next/navigation";
import ConfirmDeletePopup from "@/components/popup/ConfirmDeletePopup";
import Image from "next/image";

const SingleEstablishmentView = ({ id }) => {
  const { data: establishment, isLoading, isError } = useGetWelByIdQuery(id);
  const [updateWel, { isLoading: isUpdating }] = useUpdateWelMutation();
  const [deleteWel, { isLoading: isDeleting }] = useDeleteWelMutation();
  const router = useRouter();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [files, setFiles] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false); // State for confirmation popup

  const [establishmentData, setEstablishmentData] = useState({
    name: "",
    location: "",
    accommodation: "",
    available: "",
    note: "",
    deletePhotoPaths: [],
    photos: [],
  });

  useEffect(() => {
    if (establishment) {
      setEstablishmentData({
        name: establishment.title,
        location: establishment.location,
        accommodation: establishment.accommodation ? "Yes" : "No",
        available: establishment.available ? "Yes" : "No",
        note: establishment.note,
        deletePhotoPaths: [],
        photos: establishment.photos || [],
      });
    }
  }, [establishment]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading establishment data.</div>;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEstablishmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", establishmentData.name);
    formData.append("location", establishmentData.location);
    formData.append("accommodation", establishmentData.accommodation === "Yes");
    formData.append("available", establishmentData.available === "Yes");
    formData.append("note", establishmentData.note);
    formData.append(
      "deletePhotoPaths",
      JSON.stringify(establishmentData.deletePhotoPaths)
    );

    for (const file of files) {
      formData.append("photos", file);
    }

    try {
      await updateWel({ id, formData }).unwrap();
      alert("Details updated!");
      // Refetch data to update the UI with the latest data
      await useGetWelByIdQuery.refetch();
    } catch (error) {
      console.error("Failed to update establishment:", error);
    }
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = establishmentData.photos.filter(
      (_, i) => i !== index
    );
    setEstablishmentData((prevState) => ({
      ...prevState,
      deletePhotoPaths: [
        ...(prevState.deletePhotoPaths || []),
        establishmentData.photos[index],
      ],
      photos: updatedPhotos, // Update photos list
    }));
    setSelectedPhoto(null);
  };

  const handleDelete = async () => {
    try {
      await deleteWel(id).unwrap();
      alert("Establishment deleted!");
      router.push("/admin/well");
    } catch (error) {
      console.error("Failed to delete establishment:", error);
    }
  };
  const handleDeleteClick = () => {
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    setPopupOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Establishment Details</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Establishment Name
          </label>
          <input
            type="text"
            name="name"
            value={establishmentData.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={establishmentData.location}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Accommodation
          </label>
          <select
            name="accommodation"
            value={establishmentData.accommodation}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Available
          </label>
          <select
            name="available"
            value={establishmentData.available}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Note
          </label>
          <input
            type="text"
            name="note"
            value={establishmentData.note}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="photo-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleUpdate}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Update Details
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Delete
          </button>
        </div>
      </form>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {establishmentData.photos.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`View ${index}`}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => setSelectedPhoto(index)}
          />
        ))}
      </div>
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg max-w-4xl mx-auto">
            <Image
              src={establishmentData.photos[selectedPhoto]}
              alt={`View ${selectedPhoto}`}
              className="w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 left-2 bg-gray-200 text-black rounded-full p-2 text-sm"
            >
              ✕
            </button>
            <button
              onClick={() => handleDeletePhoto(selectedPhoto)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={establishmentData.name}
      />
    </div>
  );
};

export default SingleEstablishmentView;
