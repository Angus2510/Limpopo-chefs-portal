'use client';
import React, { useEffect } from 'react';
import ShortQuestion from './questions/ShortQuestion';
import LongQuestion from './questions/LongQuestion';
import MatchQuestion from './questions/MatchQuestion';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import SingleWordQuestion from './questions/SingleWordQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';
import Card from "@/components/card";
import { useGetAssignmentDetailsQuery } from '@/lib/features/assignment/assignmentsApiSlice';
import 'react-datetime/css/react-datetime.css';

function TestViewDetails({ id }) {
    const { data: testDetails, isFetching, isError, error } = useGetAssignmentDetailsQuery(id);

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.data?.message || 'Could not fetch the assignment details'}</div>;
    }

    return (
        <Card>
            <div className="space-y-12 p-6">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Test Details</h2>
                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">The test details</p> */}
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="testName" className="block text-sm font-medium leading-6 text-gray-900">Test Name</label>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{testDetails.title || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="testDate" className="block text-sm font-medium leading-6 text-gray-900">Test Date</label>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{new Date(testDetails.availableFrom).toLocaleString() || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="testDuration" className="block text-sm font-medium leading-6 text-gray-900">Duration</label>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{testDetails.duration ? `${testDetails.duration} minutes` : 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="testType" className="block text-sm font-medium leading-6 text-gray-900">Test Type</label>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{testDetails.type || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Students</label>
                            <ul>
                                {(testDetails.individualStudents || []).map((student, index) => (
                                    <li key={index}>{student.profile.firstName}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Campuses</label>
                            <ul>
                                {(testDetails.campus || []).map((campus, index) => (
                                    <li key={index}>{campus.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Intake Groups</label>
                            <ul>
                                {(testDetails.intakeGroups || []).map((group, index) => (
                                    <li key={index}>{group.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Outcomes</label>
                            <ul>
                                {(testDetails.outcome || []).map((outcome, index) => (
                                    <li key={index}>{outcome.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Test Questions</h2>
                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">All the test questions</p> */}
                    <div className="mt-10">
                        {(testDetails.questions || []).map((q, index) => (
                            <div key={index} className="mb-4">
                                <h2 className="text-xl font-semibold">Question {index + 1}</h2>
                                <p className="text-gray-800 mt-1">{q.text}</p>
                                {q.type === 'TrueFalse' && (
                                    <p className="text-sm font-medium text-gray-600">Answer: {q.correctAnswer}</p>
                                )}
                                {q.type === 'MultipleChoice' && (
                                    <div className="mb-4">
                                        {(q.options || []).map((option, idx) => (
                                            <div key={idx} className={`px-4 py-2 rounded-lg ${q.correctAnswer.includes(option.value) ? 'bg-brand-200' : 'bg-gray-200'}`}>
                                                {option.value} {q.correctAnswer.includes(option.value) ? '(Correct)' : ''}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {q.type === 'Match' && (q.options || []).map((pair, idx) => (
                                    <div key={idx} className="text-sm">
                                        {pair?.columnA?.startsWith('http') ? (
                                            <img src={pair.columnA} alt="Column A" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                        ) : (
                                            pair.columnA
                                        )} matches with {pair?.columnB?.startsWith('http') ? (
                                            <img src={pair.columnB} alt="Column B" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                        ) : (
                                            pair.columnB
                                        )}
                                    </div>
                                ))}
                                <span className="text-sm font-medium text-gray-600">
                                {q.mark} {q.mark === '1' ? 'Mark' : 'Marks'}
                                </span>
                            </div>
                        ))}
                        <div className="p-4 mt-2 text-xl font-semibold">
                            Total Marks: {(testDetails.questions || []).reduce((total, question) => total + (parseInt(question.mark, 10) || 0), 0)}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default TestViewDetails;
