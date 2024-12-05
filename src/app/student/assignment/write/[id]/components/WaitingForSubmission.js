'use client';

import React, { useState } from 'react';

const WaitingForSubmission = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Submission Pending</h2>
        <p className="mb-4">We are trying to submit your test. Please wait...</p>
        <button 
          onClick={onRetry} 
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Retry Submission
        </button>
      </div>
    </div>
  );
};

export default WaitingForSubmission;
