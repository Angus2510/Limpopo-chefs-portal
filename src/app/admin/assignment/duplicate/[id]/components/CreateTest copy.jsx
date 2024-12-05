'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TestDetailsForm from './TestDetailsForm';
import Card from "@/components/card";
import 'react-datetime/css/react-datetime.css';

function DuplicateAssignmentPage({ id }) {
    const [testDetails, setTestDetails] = useState({
        title: '',
        type: '',
        intakeGroups: [],
        availableFrom: '',
        individualStudents: [],
        campus: [],
        outcome: [],
        duration: 0,
        lecturer: '',
        questions: [],
    });
    const [originalTestDetails, setOriginalTestDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isQuestionLoading, setIsQuestionLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await fetch(`http://localhost:3500/assignments/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTestDetails(data);
                setOriginalTestDetails(JSON.parse(JSON.stringify(data)));
                setIsFetching(false);
            } catch (error) {
                console.error('Failed to fetch the assignment:', error);
                setIsFetching(false);
            }
        };

        fetchAssignment();
    }, [id]);

    const handleFileUpload = async (file, assignmentId, questionId) => {
        const formData = new FormData();
        formData.append('fileData', file);
        const response = await fetch(`http://localhost:3500/assignments/upload?assignmentId=${assignmentId}&questionId=${questionId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload file: ${errorText}`);
        }

        const result = await response.json();
        return result.url;
    };

    const handleCreateAssignment = async () => {
        setIsUpdating(true);
        const assignmentPayload = {
            title: testDetails.title,
            type: testDetails.type,
            intakeGroups: testDetails.intakeGroups,
            individualStudents: testDetails.individualStudents,
            campus: testDetails.campus,
            outcome: testDetails.outcome,
            availableFrom: testDetails.availableFrom,
            lecturer: testDetails.lecturer,
            duration: testDetails.duration,
        };

        try {
            const response = await fetch(`http://localhost:3500/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignmentPayload),
            });

            if (!response.ok) {
                throw new Error('Failed to create the assignment');
            }

            const newAssignment = await response.json();
            await handleQuestionUpdates(newAssignment._id);
            alert('Duplicate assignment created successfully!');
            router.push(`/admin/assignment/${newAssignment._id}`); // Redirect on success
        } catch (error) {
            alert('Failed to create duplicate assignment. Error: ' + (error.message));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleQuestionUpdates = async (newAssignmentId) => {
        const assignmentId = newAssignmentId;

        for (const question of testDetails.questions) {
            const newQuestion = { ...question };
            delete newQuestion._id; // Remove _id for new question

            if (question.type === 'Match' && question.options && question.options.length > 0) {
                for (const option of newQuestion.options) {
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
                }
            }

            if (question.type === 'MultipleChoice' && question.options && question.options.length > 0) {
                newQuestion.options = newQuestion.options.map(opt => ({ value: opt.value, isCorrect: opt.isCorrect }));
            }

            const questionResponse = await fetch(`http://localhost:3500/assignments/${assignmentId}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });

            if (!questionResponse.ok) {
                throw new Error('Failed to add question');
            }
        }
    };

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Duplicate Assignment</h1>
            <TestDetailsForm 
                testDetails={testDetails}
                updateTestDetail={setTestDetails}
            />
            <button 
                onClick={handleCreateAssignment}
                className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${isUpdating || isQuestionLoading ? 'disabled:bg-brand-300' : ''}`}
                disabled={isUpdating || isQuestionLoading}
            >
                Submit Duplicate Assignment
            </button>
        </div>
    );
}

export default DuplicateAssignmentPage;
