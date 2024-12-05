// app/components/WaitingForNetwork.js
'use client';

import React, { useEffect, useState } from 'react';

const WaitingForNetwork = ({ onNetworkRestore }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      onNetworkRestore();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onNetworkRestore]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Waiting for Network</h2>
        <p className="mb-4">Your test is ready to be submitted as soon as the network is restored. Please wait...</p>
      </div>
    </div>
  );
};

export default WaitingForNetwork;
