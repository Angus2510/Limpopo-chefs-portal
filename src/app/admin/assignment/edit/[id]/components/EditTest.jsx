'use client';
import React, { useState, useEffect } from 'react';
import TestDetailsForm from './TestDetailsForm';
import Card from "@/components/card";
import 'react-datetime/css/react-datetime.css';
import { useRouter } from 'next/navigation';
import { useGetAssignmentByIdQuery, useUpdateAssignmentMutation, useUploadFileMutation, useAddQuestionMutation, useUpdateQuestionMutation } from '@/lib/features/assignment/editAssignmentApiSlice';

function TestEditPage({ id }) {
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
    const [updateAssignment] = useUpdateAssignmentMutation();
    const [uploadFile] = useUploadFileMutation();
    const [addQuestion] = useAddQuestionMutation();
    const [updateQuestion] = useUpdateQuestionMutation();


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

    const handleUpdateAssignment = async () => {
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
            await updateAssignment({ id, data: assignmentPayload }).unwrap();
            console.log("Test/Task updated successfully: ", assignmentPayload);
            await handleQuestionUpdates();
            router.push(`/admin/assignment/${id}`);
        } catch (error) {
            console.error('Failed to update Test/Task:', error);
            alert('Failed to update assignment. Error: ' + (error.message));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleQuestionUpdates = async () => {
        const assignmentId = id;
    
        for (const question of testDetails.questions) {
            console.log("Processing question: ", question);
    
            // Create a deep copy of the question to avoid direct mutation
            const questionCopy = JSON.parse(JSON.stringify(question));
    
            if (questionCopy.type === 'Match' && questionCopy.options && questionCopy.options.length > 0) {
                const updatedOptions = await Promise.all(questionCopy.options.map(async (option) => {
                    console.log("Processing option: ", option);
                    const originalQuestion = originalTestDetails.questions.find(q => q._id === question._id);
                    const originalOption = originalQuestion?.options.find(opt => opt._id === option._id);
                    console.log("Original option: ", originalOption);
    
                    if (option.columnA instanceof File) {
                        if (!originalOption || option.columnA.name !== originalOption.columnA.split('/').pop()) {
                            const urlA = await handleFileUpload(option.columnA, assignmentId, question._id);
                            console.log("Updated columnA: ", urlA);
                            return { ...option, columnA: urlA };
                        }
                    }
    
                    if (option.columnB instanceof File) {
                        if (!originalOption || option.columnB.name !== originalOption.columnB.split('/').pop()) {
                            const urlB = await handleFileUpload(option.columnB, assignmentId, question._id);
                            console.log("Updated columnB: ", urlB);
                            return { ...option, columnB: urlB };
                        }
                    }
    
                    return option;
                }));
    
                questionCopy.options = updatedOptions;
                console.log("Updated options: ", questionCopy.options);
            }
    
            if (questionCopy.type === 'MultipleChoice' && questionCopy.options && questionCopy.options.length > 0) {
                questionCopy.options = questionCopy.options.map(opt => ({ value: opt.value, isCorrect: opt.isCorrect }));
                console.log("Updated MultipleChoice options: ", questionCopy.options);
            }
    
            const questionData = {
                ...questionCopy,
                options: questionCopy.options.map(opt => ({ ...opt })), // Ensure options is a new array
            };
            console.log("Prepared question data: ", questionData);
    
            if (question._id) {
                // Update existing question
                await updateQuestion({ assignmentId, id: question._id, data: questionData }).unwrap();
                console.log("Updated question: ", questionData);
            } else {
                // Add new question
                await addQuestion({ assignmentId, data: questionData }).unwrap();
                console.log("Added new question: ", questionData);
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
                onClick={handleUpdateAssignment}
                className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${isUpdating || isQuestionLoading ? 'disabled:bg-brand-300' : ''}`}
                disabled={isUpdating || isQuestionLoading}
            >
                Submit
            </button>
        </div>
    );
}

export default TestEditPage;
