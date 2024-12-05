import React, { useEffect, useState } from 'react';
import { FaPlug, FaUnlink } from 'react-icons/fa';

const NetworkIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`fixed top-0 right-0 m-4 p-2 rounded flex items-center`}>
      {isOnline ? (
        <FaPlug className="text-green-500" size={24} />
      ) : (
        <FaUnlink className="text-red-500" size={24} />
      )}
    </div>
  );
};

export default NetworkIndicator;
