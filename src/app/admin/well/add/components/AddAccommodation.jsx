"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card'; 
import { useAddNewWelMutation } from '@/lib/features/wel/welApiSlice'; 

const AddAccommodation = () => {
    const router = useRouter();

    const [addNewWel, { isLoading, isSuccess, isError, error }] = useAddNewWelMutation();


    // State variables for form fields
    const [establishmentName, setEstablishmentName] = useState('');
    const [location, setLocation] = useState('');
    const [accommodation, setAccommodation] = useState('');
    const [photos, setPhotos] = useState([]);

    const handlePhotoChange = (event) => {
        setPhotos(event.target.files);
    };

    useEffect(() => {
        if (isSuccess) {
            router.push('/admin/well'); 
        }
    }, [isSuccess, router]);

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoading) {
            const formData = new FormData();

        formData.append('title', establishmentName);
        formData.append('location', location);
        formData.append('accommodation', accommodation);

        Array.from(photos).forEach((photo) => {
            formData.append('photos', photo);
          });

        try {
            const result = await addNewWel(formData).unwrap();
            console.log('Wel added successfully', result);
        } catch (err) {
            console.error('Failed to add wel', err);
        }

    }
    };

    // Rendering the component
    return (
        <Card className="bg-white p-6 rounded-2xl shadow-xl">
            <h4 className="text-xl font-bold text-navy-700">Add Accommodation</h4>
            <p className="mt-2 text-base text-gray-600">Fill in the details below to add a new accommodation.</p>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="space-y-4">
                    {/* Establishment Name input */}
                    <div>
                        <label htmlFor="establishmentName" className="block text-sm font-medium text-gray-700">Establishment Name</label>
                        <input
                            type="text"
                            id="establishmentName"
                            value={establishmentName}
                            onChange={e => setEstablishmentName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* Location input */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* Accommodation input */}
                    <div>
                        <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">Accommodation</label>
                        <input
                            type="checkbox"
                            id="accommodation"
                            checked={accommodation}
                            onChange={e => setAccommodation(e.target.checked)}
                            className="mt-1"
                        />
                    </div>
                    {/* Photo input */}
                    <div>
                        <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700">Upload Photo</label>
                        <input
                            id="photo-upload"
                            type="file"
                            onChange={handlePhotoChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                            required
                            multiple
                        />
                    </div>
                </div>
                {/* Submit button */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                        Add Accommodation
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddAccommodation;
