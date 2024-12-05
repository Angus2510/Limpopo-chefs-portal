"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import { useAddNewCampusMutation } from '@/lib/features/campus/campusApiSlice';

const AddCampus = () => {
    const router = useRouter();
    const [campusName, setCampusName] = useState('');
    const [addNewCampus, { isLoading }] = useAddNewCampusMutation();

    const handleCancelClick = () => {
        router.push('/admin/settings/campus');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!campusName.trim()) {
            alert('Please enter a campus name.');
            return;
        }

        try {
            await addNewCampus({ title: campusName }).unwrap();
            alert(`Campus "${campusName}" added successfully!`);
            router.push('/admin/settings/campus');
        } catch (error) {
            console.error('Failed to add campus: ', error);
            alert('Failed to add campus. Please try again.');
        }
    };

    return (
        <Card className="bg-white p-6 rounded-2xl shadow-xl">
            <h4 className="text-xl font-bold text-navy-700">Add Campus</h4>
            <p className="mt-2 text-base text-gray-600">Enter the name of the new campus.</p>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="campusName" className="block text-sm font-medium text-gray-700">Campus Name</label>
                        <div>
                        <input
                            type="text"
                            id="campusName"
                            value={campusName}
                            onChange={e => setCampusName(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                            required
                        />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Campus'}
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

export default AddCampus;
