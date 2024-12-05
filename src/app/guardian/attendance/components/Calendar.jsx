"use client"
import React, { useEffect, useState } from 'react';
import { useGetGuardianAttendanceQuery } from '@/lib/features/guardian/guardianApiSlice';
import Card from '@/components/card/index';

const Calendar = ({ guardianId }) => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // Month is 1-based (1 = January, 12 = December)

    const params = { guardianId, year: currentYear, month: currentMonth };
    const { data: attendanceData, error, isLoading } = useGetGuardianAttendanceQuery(params);
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const [attendance, setAttendance] = useState(new Array(daysInMonth).fill('default'));

    useEffect(() => {
        if (attendanceData) {
            const updatedAttendance = new Array(daysInMonth).fill('default');
            attendanceData.forEach((record) => {
                const day = new Date(record.date).getDate();
                record.status.forEach((studentStatus) => {
                    switch (studentStatus.status) {
                        case 'P':
                            updatedAttendance[day - 1] = 'present';
                            break;
                        case 'A':
                            updatedAttendance[day - 1] = 'absent';
                            break;
                        case 'H':
                            updatedAttendance[day - 1] = 'holiday';
                            break;
                        case 'AR':
                            updatedAttendance[day - 1] = 'absentWithReason';
                            break;
                        case 'W.E.L':
                            updatedAttendance[day - 1] = 'workplace';
                            break;
                        default:
                            updatedAttendance[day - 1] = 'default';
                            break;
                    }
                });
            });
            setAttendance(updatedAttendance);
        }
    }, [attendanceData, daysInMonth]);

    const handlePreviousMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <Card>
        <div className="w-full max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousMonth} className="bg-brand-500 text-white px-2 py-1 rounded">Previous</button>
                <div className="text-center font-bold text-lg">
                    {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="bg-brand-500 text-white px-2 py-1 rounded">Next</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(day => (
                    <div
                        key={day}
                        className={`p-2 text-center ${attendance[day - 1] === 'present' ? 'bg-green-500' :
                            attendance[day - 1] === 'absent' ? 'bg-red-500' :
                            attendance[day - 1] === 'holiday' ? 'bg-gray-600' :
                            attendance[day - 1] === 'absentWithReason' ? 'bg-yellow-400' :
                            attendance[day - 1] === 'workplace' ? 'bg-green-800' :
                            'bg-gray-300'}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">Key:</h2>
                <ul className="flex flex-wrap gap-2">
                    <li className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-green-500"></span> Present
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-red-500"></span> Absent
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-gray-600"></span> Holiday
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-yellow-400"></span> Absent With Reason
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-green-800"></span> Workplace
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-gray-300"></span> Default
                    </li>
                </ul>
            </div>
        </div>
        </Card>
    );
};

export default Calendar;
