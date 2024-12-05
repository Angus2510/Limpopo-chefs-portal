'use client';
import React, { useState, useEffect } from 'react';
import TestDetailsForm from './TestDetailsForm';
import 'react-datetime/css/react-datetime.css';
import { useRouter } from 'next/navigation';
import { useGetAssignmentByIdQuery, useAddAssignmentMutation, useUploadFileMutation, useAddQuestionMutation } from '@/lib/features/assignment/editAssignmentApiSlice';

function DuplicateAssignmentPage({ id }) {
    const [testDetails, setTestDetails] = useState({
        title: '',
        type: '',
        intakeGroups: [],
        availableFrom: '',
        students: [],
        campuses: [],
        outcomes: [],
        duration: 0,
        lecturer: '',
        questions: [],
    });
    const [originalTestDetails, setOriginalTestDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isQuestionLoading, setIsQuestionLoading] = useState(false);
    const router = useRouter();

    const { data: assignment, isFetching: isFetchingAssignment } = useGetAssignmentByIdQuery(id);
    const [addAssignment] = useAddAssignmentMutation();
    const [uploadFile] = useUploadFileMutation();
    const [addQuestion] = useAddQuestionMutation();

    useEffect(() => {
        if (assignment && !isFetchingAssignment) {
            console.log("useEffect ran");
            console.log("Fetched assignment data:", assignment);

            const assignmentData = assignment.entities[assignment.ids[0]];
            console.log("Assignment data:", assignmentData);

            const updatedAssignmentData = {
                title: assignmentData.title || '',
                type: assignmentData.type || '',
                intakeGroups: assignmentData.intakeGroups || [],
                availableFrom: assignmentData.availableFrom || '',
                students: assignmentData.individualStudents || [],
                campuses: assignmentData.campus || [],
                outcomes: assignmentData.outcome || [],
                duration: assignmentData.duration || 0,
                lecturer: assignmentData.lecturer || '',
                questions: assignmentData.questions || [],
            };

            console.log("Setting updated assignment data:", updatedAssignmentData);

            setTestDetails(updatedAssignmentData);
            setOriginalTestDetails(JSON.parse(JSON.stringify(updatedAssignmentData)));
            setIsFetching(false);
            console.log("Updated assignment data set:", updatedAssignmentData);
        }
    }, [assignment, isFetchingAssignment]);

    const handleFileUpload = async (file, assignmentId, questionId) => {
        const formData = new FormData();
        formData.append('fileData', file);
        try {
            const result = await uploadFile({ assignmentId, questionId, formData }).unwrap();
            console.log("File uploaded successfully: ", result.url);
            return result.url;
        } catch (error) {
            console.error('Failed to upload file:', error);
            throw new Error('Failed to upload file');
        }
    };

    const handleCreateAssignment = async () => {
        setIsUpdating(true);
        const assignmentPayload = {
            title: testDetails.title,
            type: testDetails.type,
            intakeGroups: testDetails.intakeGroups,
            individualStudents: testDetails.students,
            campus: testDetails.campuses,
            outcome: testDetails.outcomes,
            availableFrom: testDetails.availableFrom,
            lecturer: testDetails.lecturer,
            duration: testDetails.duration,
        };

        try {
            const newAssignment = await addAssignment(assignmentPayload).unwrap();
            console.log("Assignment created successfully: ", newAssignment);
            await handleQuestionUpdates(newAssignment._id);
            alert('Duplicate Test/Task created successfully!');
            router.push(`/admin/assignment/${newAssignment._id}`);
        } catch (error) {
            console.error('Failed to create assignment:', error);
            alert('Failed to create duplicate Test/Task. Error: ' + (error.message));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleQuestionUpdates = async (newAssignmentId) => {
        const assignmentId = newAssignmentId;

        for (const question of testDetails.questions) {
            const newQuestion = JSON.parse(JSON.stringify(question)); // Create deep copy of the question
            delete newQuestion._id; 

            if (question.type === 'Match' && question.options && question.options.length > 0) {
                const updatedOptions = await Promise.all(newQuestion.options.map(async (option) => {
                    const originalQuestion = originalTestDetails.questions.find(q => q._id === question._id);
                    const originalOption = originalQuestion?.options.find(opt => opt._id === option._id);

                    if (option.columnA instanceof File) {
                        if (!originalOption || option.columnA.name !== originalOption.columnA.split('/').pop()) {
                            const urlA = await handleFileUpload(option.columnA, assignmentId, question._id);
                            option.columnA = urlA;
                        }
                    } else if (typeof option.columnA === 'string') {
                        option.columnA = originalOption?.columnA || option.columnA;
                    }

                    if (option.columnB instanceof File) {
                        if (!originalOption || option.columnB.name !== originalOption.columnB.split('/').pop()) {
                            const urlB = await handleFileUpload(option.columnB, assignmentId, question._id);
                            option.columnB = urlB;
                        }
                    } else if (typeof option.columnB === 'string') {
                        option.columnB = originalOption?.columnB || option.columnB;
                    }

                    return option;
                }));

                newQuestion.options = updatedOptions;
            }

            if (question.type === 'MultipleChoice' && question.options && question.options.length > 0) {
                newQuestion.options = newQuestion.options.map(opt => ({ value: opt.value, isCorrect: opt.isCorrect }));
            }

            try {
                await addQuestion({ assignmentId, data: newQuestion }).unwrap();
                console.log("Question added successfully: ", newQuestion);
            } catch (error) {
                console.error('Failed to add question:', error);
                throw new Error('Failed to add question');
            }
        }
    };

    if (isFetching || isFetchingAssignment) {
        return <div>Loading...</div>;
    }

    if (isUpdating) {
        return <div>Updating...</div>;
    }
    return (
        <div className="container mx-auto p-4">
            <TestDetailsForm
                testDetails={testDetails}
                updateTestDetail={setTestDetails}
            />
            <button
                onClick={handleCreateAssignment}
                className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${isUpdating || isQuestionLoading ? 'disabled:bg-brand-300' : ''}`}
                disabled={isUpdating || isQuestionLoading}
            >
                Submit
            </button>
        </div>
    );
}

export default DuplicateAssignmentPage;
