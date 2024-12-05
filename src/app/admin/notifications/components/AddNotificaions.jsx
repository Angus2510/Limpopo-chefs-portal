"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import StudentSelect from '@/components/select/StudentSelect';
import CampusSelect from '@/components/select/CampusSelect';
import IntakeGroupSelect from '@/components/select/IntakeGroupSelect';
import { useCreateNotificationMutation } from '@/lib/features/notifications/notificatinsApiSlice';

const AddNotification = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedCampuses, setSelectedCampuses] = useState([]);
    const [selectedIntakeGroups, setSelectedIntakeGroups] = useState([]);
    const [createNotification, { isLoading }] = useCreateNotificationMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !message.trim()) {
            alert('Please enter both title and message.');
            return;
        }

        try {
            await createNotification({
                title,
                message,
                campuses: selectedCampuses,
                intakeGroups: selectedIntakeGroups,
                students: selectedStudents
            }).unwrap();
            alert('Notification added successfully!');
            router.push('/admin/notifications');
        } catch (error) {
            console.error('Failed to add notification: ', error);
            alert('Failed to add notification. Please try again.');
        }
    };

    return (
        <Card className="bg-white p-6 rounded-2xl shadow-xl">
            <h4 className="text-xl font-bold text-navy-700">Add Notification</h4>
            <p className="mt-2 text-base text-gray-600">Enter the details for the new notification.</p>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <div>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <div>
                            <textarea
                                id="message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <StudentSelect selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
                    <CampusSelect selectedCampuses={selectedCampuses} setSelectedCampuses={setSelectedCampuses} />
                    <IntakeGroupSelect selectedIntakeGroups={selectedIntakeGroups} setSelectedIntakeGroups={setSelectedIntakeGroups} />
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Notification'}
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddNotification;
