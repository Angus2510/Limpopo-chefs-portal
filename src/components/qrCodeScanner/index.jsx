"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/card';
import { FiCheckCircle } from 'react-icons/fi';
import { useAddAttendanceMutation } from '@/lib/features/attendance/attendanceApiSlice';
import { useGetQrByIdQuery } from '@/lib/features/attendance/qrAttendanceApiSlice';
import { useRouter } from 'next/navigation';

const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

const QrCodeScanner = ({ studentId, inakteGroup }) => {
  const [scanResult, setScanResult] = useState('');
  const [qrId, setQrId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  const [addAttendance] = useAddAttendanceMutation();
  const { data: qrData, error: qrError } = useGetQrByIdQuery(qrId, {
    skip: !qrId,
  });
  const router = useRouter();

  const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        const defaultDevice = isMobileDevice()
          ? videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0]
          : videoDevices[0];
        setCurrentDeviceId(defaultDevice.deviceId);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Error fetching devices.');
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      getDevices();
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Error accessing camera. Please grant camera permissions.');
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !currentDeviceId) {
      setCurrentDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  const handleScan = async (data) => {
    if (data) {
      setScanResult(JSON.stringify(data)); 
      try {
        const parsedData = JSON.parse(data.text); 
        const url = new URL(parsedData.qrRedirectURL);
        const pathSegments = url.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        setQrId(id);
      } catch (error) {
        console.error('Error parsing QR code data:', error);
        setError('Error parsing QR code data.');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Camera error: ' + err.message);
  };

  const handleSwitchCamera = () => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      setCurrentDeviceId(devices[nextIndex].deviceId);
    }
  };

  const handleScanAgain = () => {
    setScanResult('');
    setQrId(null);
  };

  const handleSave = async () => {
    if (!qrData) {
      alert('No QR data available');
      return;
    }

    const attendanceRecord = {
      student: studentId,
      status: 'P'
    };

    const payload = {
      intakeGroupId: inakteGroup,
      campusId: qrData.campus.id,
      attendance: [{
        date: qrData.attendanceDate,
        attendees: [attendanceRecord]
      }]
    };

    try {
      await addAttendance(payload).unwrap();
      alert('Attendance saved successfully');
      router.push('/student/attendance');
      router.refresh();
    } catch (error) {
      alert('Failed to save attendance:', error);
      console.error('Failed to save attendance:', error);
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <Card className="w-full p-10">
      <header className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-navy-700">Scan QR Code to Mark Attendance</h1>
      </header>
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
      <div className="mt-4 flex gap-4">
        <button onClick={handleSwitchCamera} className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600">
          Switch Camera
        </button>
        <button onClick={handleScanAgain} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
          Scan Again
        </button>
      </div>
      {currentDeviceId && hasPermission && (
        <QrScanner
          key={currentDeviceId}
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={previewStyle}
          constraints={{ video: { deviceId: currentDeviceId } }}
        />
      )}
      {qrError && (
        <div className="mt-4 text-red-500">
          <p>{qrError.message}</p>
        </div>
      )}
      {qrData && (
        <div className="mt-4">
          <p>Campus: {qrData.campus.title}</p>
          <p>Intake Group: {qrData.intakeGroup.map(group => group.title).join(', ')}</p>
          <p>Date: {new Date(qrData.attendanceDate).toLocaleDateString()}</p>
        </div>
      )}
      {qrData && (
        <div className="mt-4 flex gap-4">
          <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            <FiCheckCircle />
            Mark Attendance
          </button>
        </div>
      )}
    </Card>
  );
};

export default QrCodeScanner;
