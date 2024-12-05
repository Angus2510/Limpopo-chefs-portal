"use client";

import React, { useState } from 'react';

const sections = [
  { title: 'Dashboard', permissions: ['View', 'Edit', 'Upload'] },
  { title: 'Students', permissions: ['View', 'Edit', 'Upload'] },
  {
    title: 'Finance',
    subSections: [
      { title: 'Paid', permissions: ['View', 'Edit', 'Add'] },
      { title: 'To Pay', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Finance Sheet', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
  {
    title: 'Test/Tasks',
    subSections: [
      { title: 'All', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Create', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Mark', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
  {
    title: 'Attendance',
    subSections: [
      { title: 'Student Attendance', permissions: ['View', 'Edit', 'Add'] },
      { title: 'QR Attendance', permissions: ['View', 'Edit', 'Add'] },
      { title: 'W.E.L Attendance', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
  {
    title: 'Results',
    subSections: [
      { title: 'Capture', permissions: ['View', 'Edit', 'Add'] },
      { title: 'SOR', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
  { title: 'Learning Material', permissions: ['View', 'Edit', 'Upload'] },
  { title: 'W.E.L', permissions: ['View', 'Edit', 'Upload'] },
  {
    title: 'Admin',
    subSections: [
      { title: 'Accommodation', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Campus', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Intake groups', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Outcomes', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Staff', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Graduate students', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Alumni', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
  {
    title: 'Reports',
    subSections: [
      { title: 'Moderation', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Account in arrears', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
  {
    title: 'Settings',
    subSections: [
      { title: 'Roles', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Staff', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
];

const roles = ['Admin', 'Lecturer', 'Senior Lecturer','Junior Lecturer', 'Student Support','Front Office Staff']; // Added new roles

const EditRoles = () => {
  const [permissions, setPermissions] = useState({});

  const handlePermissionChange = (role, section, subSection, permission) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [section]: {
          ...prev[role]?.[section],
          [subSection]: {
            ...prev[role]?.[section]?.[subSection],
            [permission]: !prev[role]?.[section]?.[subSection]?.[permission],
          },
        },
      },
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Actions</th>
              {roles.map(role => (
                <th key={role} className="px-4 py-2 border">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map(section => (
              <React.Fragment key={section.title}>
                <tr className="bg-gray-200">
                  <td className="px-4 py-2 border font-semibold sticky left-0 bg-gray-200">{section.title}</td>
                  {roles.map(role => (
                    <td key={role} className="px-4 py-2 border text-center">
                      {section.permissions && section.permissions.map(permission => (
                        <label key={permission} className="inline-flex items-center mx-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={permissions[role]?.[section.title]?.[section.title]?.[permission] || false}
                            onChange={() => handlePermissionChange(role, section.title, section.title, permission)}
                          />
                          <span className="ml-1">{permission}</span>
                        </label>
                      ))}
                    </td>
                  ))}
                </tr>
                {section.subSections && section.subSections.map(subSection => (
                  <tr key={subSection.title}>
                    <td className="px-4 py-2 border pl-8 sticky left-0 bg-white">{subSection.title}</td>
                    {roles.map(role => (
                      <td key={role} className="px-4 py-2 border text-center">
                        {subSection.permissions.map(permission => (
                          <label key={permission} className="inline-flex items-center mx-2">
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={permissions[role]?.[section.title]?.[subSection.title]?.[permission] || false}
                              onChange={() => handlePermissionChange(role, section.title, subSection.title, permission)}
                            />
                            <span className="ml-1">{permission}</span>
                          </label>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Save Permissions
      </button>
    </div>
  );
};

export default EditRoles;
