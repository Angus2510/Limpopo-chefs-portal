'use client';
import React, { useState } from 'react';
import TestDetailsForm from './TestDetailsForm';
import { useAddAssignmentMutation, useUploadFileMutation } from '@/lib/features/assignment/assignmentsApiSlice';
import { useAddQuestionToAssignmentMutation } from '@/lib/features/assignment/questionsApiSlice';

function TestCreationPage({id}) {
    const [testDetails, setTestDetails] = useState({
        title: '',
        type: '',
        intakeGroups: [],
        availableFrom: '',
        students: [],
        campuses: '',
        outcomes: '',
        duration: 0,
        lecturer: id,
        questions: [],
    });

    console.log(id)
    const [addAssignment, { isLoading: isAssignmentLoading }] = useAddAssignmentMutation();
    const [addQuestionToAssignment, { isLoading: isQuestionLoading }] = useAddQuestionToAssignmentMutation();

    const handleFileUpload = async (file, assignmentId, questionId) => {
        console.log('Preparing to upload file:', file);
        const formData = new FormData();
        formData.append('fileData', file);
        
        const result = await uploadFile({ assignmentId, questionId, formData }).unwrap();
        console.log('File upload result:', result);
        return result.url;
    };

    const handleSubmitTest = async () => {
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
            const result = await addAssignment(assignmentPayload).unwrap();
            console.log('Assignment created:', result);

            const assignmentId = result._id;

            for (const question of testDetails.questions) {
                console.log('Processing question:', question);

                if (question.type === 'Match' && question.options && question.options.length > 0) {
                    for (const option of question.options) {
                        console.log('Processing option:', option);

                        if (option.columnA instanceof File) {
                            console.log('File A detected:', option.columnA);
                            const urlA = await handleFileUpload(option.columnA, assignmentId, question._id);
                            option.columnA = urlA;
                        }
                        if (option.columnB instanceof File) {
                            console.log('File B detected:', option.columnB);
                            const urlB = await handleFileUpload(option.columnB, assignmentId, question._id);
                            option.columnB = urlB;
                        }
                    }
                }

                // Structure MultipleChoice options correctly
                if (question.type === 'MultipleChoice' && question.options && question.options.length > 0) {
                    question.options = question.options.map(opt => ({ value: opt.value, isCorrect: opt.isCorrect }));
                }

                await addQuestionToAssignment({ assignmentId, question }).unwrap();
            }

            alert('Test/Task and questions added successfully!');
        } catch (error) {
            console.error('Failed to create Test/task:', error);
            alert('Failed to create Test/Task. Error: ' + (error.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <TestDetailsForm 
                testDetails={testDetails}
                updateTestDetail={setTestDetails}
            />
            <button 
                onClick={handleSubmitTest}
                className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${isAssignmentLoading || isQuestionLoading ? 'disabled:bg-brand-300' : ''}`}
                disabled={isAssignmentLoading || isQuestionLoading}
            >
                Submit
            </button>
        </div>
    );
}

export default TestCreationPage;
