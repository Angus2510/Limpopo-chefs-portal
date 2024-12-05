"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import { useAddNewQualificationMutation } from '@/lib/features/qualification/qualificationApiSlice';

const AddQualification = () => {
    const router = useRouter();
    const [qualificationName, setQualificationName] = useState('');
    const [addNewQualification, { isLoading }] = useAddNewQualificationMutation();

    const handleCancelClick = () => {
        router.push('/admin/settings/qualification');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!qualificationName.trim()) {
            alert('Please enter a qualification name.');
            return;
        }

        try {
            await addNewQualification({ title: qualificationName }).unwrap();
            alert(`Qualification "${qualificationName}" added successfully!`);
            router.push('/admin/settings/qualification');
        } catch (error) {
            console.error('Failed to add qualification: ', error);
            alert('Failed to add qualification. Please try again.');
        }
    };

    return (
        <Card className="bg-white p-6 rounded-2xl shadow-xl">
            <h4 className="text-xl font-bold text-navy-700">Add Qualification</h4>
            <p className="mt-2 text-base text-gray-600">Enter the name of the new qualification.</p>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="qualificationName" className="block text-sm font-medium text-gray-700">Qualification Name</label>
                        <input
                            type="text"
                            id="qualificationName"
                            value={qualificationName}
                            onChange={e => setQualificationName(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                            required
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Qualification'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddQualification;
