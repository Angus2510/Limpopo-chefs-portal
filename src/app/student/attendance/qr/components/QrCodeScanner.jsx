"use client";
import React from 'react';
import QrCodeScanner from '@/components/qrCodeScanner/index';

export default function Attendance({studentId,inakteGroup}) {
  console.log(inakteGroup)
  return (
    <div>
      <QrCodeScanner
      studentId={studentId}
      inakteGroup ={inakteGroup}
      />
    </div>
  );
}