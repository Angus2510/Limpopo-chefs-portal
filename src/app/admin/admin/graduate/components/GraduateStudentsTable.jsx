'use client';
import React, { useState } from "react";
import DataTable from "./DataTable";
import Card from "@/components/card/index";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAllStudents, useGetStudentsQuery, useUpdateStudentMutation } from "@/lib/features/students/studentsApiSlice";
import { useGetIntakeGroupsQuery, selectAllIntakeGroups } from "@/lib/features/intakegroup/intakeGroupApiSlice";
import { useGetCampusesQuery, selectAllCampuses } from "@/lib/features/campus/campusApiSlice";
import { useGraduateStudentsMutation } from '@/lib/features/graduate/graduateApiSlice';

const GraduateStudentsTable = () => {
  const router = useRouter();

  const { data: studentsNormalized } = useGetStudentsQuery();
  const students = useSelector(selectAllStudents);

  const { data: intakeGroupsNormalized } = useGetIntakeGroupsQuery();
  const { data: campusesNormalized } = useGetCampusesQuery();

  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  const [updateStudent] = useUpdateStudentMutation();
  const [graduateStudents] = useGraduateStudentsMutation();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const intakeGroupOptions = intakeGroups.map(group => ({ label: group.title, value: group.title }));
  const campusOptions = campuses.map(campus => ({ label: campus.title, value: campus.title }));

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

  const transformedStudents = students.map(student => ({
    ...student,
    campus: student.campus.map(group => group.title).join(', '),
    intakeGroup: student.intakeGroup.map(group => group.title).join(', '),
  }));

  const columns = [
    { Header: "Student No", accessor: "admissionNumber" },
    { Header: "First Name", accessor: "profile.firstName" },
    { Header: "Last Name", accessor: "profile.lastName" },
    { Header: "Date of Birth", accessor: "profile.dateOfBirth" },
    { Header: "Gender", accessor: "profile.gender" },
    { Header: "Mobile Number", accessor: "profile.mobileNumber" },
  ];

  const handleCurrentResultsChange = async (id, value) => {
    try {
      await updateStudent({ id, formData: { currentResult: value } }).unwrap();
    } catch (error) {
      console.error('Failed to update student result:', error);
    }
  };

  const handleGraduateStudents = async (selectedIds, passFailStatus) => {
    setIsGeneratingReport(true);
    try {
      const graduatedStudents = selectedIds.map(id => ({
        id,
        currentResult: passFailStatus.find(status => status.id === id)?.value,
      }));
      console.log(graduatedStudents)
      await graduateStudents(graduatedStudents).unwrap();
      alert('Students graduated successfully');
    } catch (error) {
      console.error('Failed to graduate students:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Graduate Students</h1>
      </div>
      <DataTable
        data={transformedStudents}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search students..."
        onGraduateStudents={handleGraduateStudents}
        isGenerating={isGeneratingReport}
        onPassFailChange={handleCurrentResultsChange}
      />
    </Card>
  );
};

export default GraduateStudentsTable;
