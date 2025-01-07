"use client";

import React, { useState } from "react";
import DataTable from "@/components/tables/BasicTable";
import { useRouter } from "next/navigation";
import { FiSearch, FiEye, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import Card from "@/components/card/index";
import { useSelector } from "react-redux";
import {
  selectAllQrAttendances,
  useGetQrAttendanceQuery,
  useDeleteQrAttendanceMutation,
} from "@/lib/features/attendance/qrAttendanceApiSlice";

import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup";
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice";
import ConfirmDeletePopup from "@/components/popup/ConfirmDeletePopup";
import Image from "next/image";

import Modal from "./qrModal";

const QRCodeAttendance = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [intakeGroupFilter, setIntakeGroupFilter] = useState("");
  const [campusFilter, setCampusFilter] = useState("");
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const {
    data: qrAttendances,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetQrAttendanceQuery();

  const {
    data: intakeGroupsNormalized,
    isLoading: intakeGroupsLoading,
    isError: intakeGroupsError,
    error: intakeGroupsFetchError,
    refetch: refetchIntakeGroups,
  } = useGetIntakeGroupsQuery();
  const {
    data: campusesNormalized,
    isLoading: campusesLoading,
    isError: campusesError,
    error: campusesFetchError,
    refetch: refetchCampuses,
  } = useGetCampusesQuery();

  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  const intakeGroupOptions = intakeGroups.map((group) => ({
    label: group.title,
    value: group.title,
  }));
  const campusOptions = campuses.map((campus) => ({
    label: campus.title,
    value: campus.title,
  }));

  const attendanceQRData = useSelector(selectAllQrAttendances);

  const [deleteQrAttendance] = useDeleteQrAttendanceMutation();

  const handleViewQR = (event, item) => {
    event.stopPropagation();
    setSelectedQRCode(item.signedQrCodeUrl);
    setIsModalOpen(true);
  };

  const handleRowClick = (item) => {
    setSelectedQRCode(item.signedQrCodeUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQRCode(null);
  };

  const handleDelete = (event, qr) => {
    event.stopPropagation();
    setSelectedQRCode(qr);
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedQRCode) {
      try {
        await deleteQrAttendance({ id: selectedQRCode.id });
        setPopupOpen(false);
        setSelectedQRCode(null);
      } catch (error) {
        console.error("Error deleting QR attendance:", error);
      }
    }
  };

  const filters = [
    {
      id: "intakeGroup",
      options: intakeGroupOptions,
      defaultOption: "All Intakes",
    },
    {
      id: "campus",
      options: campusOptions,
      defaultOption: "All Campuses",
    },
  ];

  const columns = [
    { Header: "Intake Group", accessor: "intakeGroup" },
    { Header: "Campus", accessor: "campus" },
    { Header: "Date", accessor: "attendanceDate" },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => handleViewQR(event, row.original)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEye />
          </button>
          <button
            onClick={(event) => handleDelete(event, row.original)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-end items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/attendance/qr/add")}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600  mr-4"
          >
            <FiPlus /> Add QR
          </button>
        </div>
      </div>
      <DataTable
        data={attendanceQRData}
        columns={columns}
        filters={filters}
        onRowClick={handleRowClick}
        searchPlaceholder="Search attendance QR..."
      />
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedQRCode && (
          <Image
            src={selectedQRCode}
            alt="QR Code"
            width={500}
            height={500}
            className="mx-auto max-w-full max-h-full"
          />
        )}
      </Modal>

      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedQRCode ? selectedQRCode.intakeGroup : ""}
      />
    </Card>
  );
};

export default QRCodeAttendance;
