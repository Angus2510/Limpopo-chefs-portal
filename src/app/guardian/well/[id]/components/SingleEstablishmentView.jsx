"use client";

import React, { useEffect, useState } from "react";
import { useGetWelByIdQuery } from "@/lib/features/wel/welApiSlice";
import Image from "next/image";

const SingleEstablishmentView = ({ id }) => {
  const { data: establishment, isLoading, isError } = useGetWelByIdQuery(id);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [establishmentData, setEstablishmentData] = useState({
    name: "",
    location: "",
    accommodation: "",
    available: "",
    note: "",
  });

  useEffect(() => {
    if (establishment) {
      setEstablishmentData({
        name: establishment.title,
        location: establishment.location,
        accommodation: establishment.accommodation ? "Yes" : "No",
        available: establishment.available ? "Yes" : "No",
        note: establishment.note,
      });
    }
  }, [establishment]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading establishment data.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Establishment Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Establishment Name
          </label>
          <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {establishmentData.name}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {establishmentData.location}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Accommodation
          </label>
          <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {establishmentData.accommodation}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Available
          </label>
          <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {establishmentData.available}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Note
          </label>
          <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {establishmentData.note}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {establishment.photos.map((url, index) => (
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
              src={establishment.photos[selectedPhoto]}
              alt={`View ${selectedPhoto}`}
              className="w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 left-2 bg-gray-200 text-black rounded-full p-2 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleEstablishmentView;
