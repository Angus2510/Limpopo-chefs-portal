"use client";

import React from 'react';

const IndividualRoles = ({ handlePermissionChange, permissions }) => {
  const sections = [
    { title: 'Dashboard', route: 'admin/dashboard', permissions: ['view', 'edit', 'upload'] },
    { title: 'Students', route: 'admin/students', permissions: ['view', 'edit', 'upload'] },
    {
      title: 'Finance',
      subSections: [
        { title: 'Paid', route: 'admin/finance/collect', permissions: ['view', 'edit', 'upload'] },
        { title: 'To Pay', route: 'admin/finance/payable', permissions: ['view', 'edit', 'upload'] },
        { title: 'Finance Sheet', route: 'admin/finance/sheet', permissions: ['view', 'edit', 'upload'] },
      ],
    },
    {
      title: 'Test/Tasks',
      subSections: [
        { title: 'All', route: 'admin/assignment', permissions: ['view', 'edit', 'upload'] },
        { title: 'Create', route: 'admin/assignment/create', permissions: ['view', 'edit', 'upload'] },
        { title: 'Mark', route: 'admin/assignment/mark', permissions: ['view', 'edit', 'upload'] },
      ],
    },
    {
      title: 'Attendance',
      subSections: [
        { title: 'Student Attendance', route: 'admin/attendance/student', permissions: ['view', 'edit', 'upload'] },
        { title: 'QR Attendance', route: 'admin/attendance/qr', permissions: ['view', 'edit', 'upload'] },
        { title: 'W.E.L Attendance', route: 'admin/attendance/wel', permissions: ['view', 'edit', 'upload'] },
      ],
    },
    {
      title: 'Results',
      subSections: [
        { title: 'Capture', route: 'admin/results/capture', permissions: ['view', 'edit', 'upload'] },
        { title: 'SOR', route: 'admin/results/sor', permissions: ['view', 'edit', 'upload'] },
      ],
    },
    { title: 'Learning Material', route: 'admin/uploads', permissions: ['view', 'edit', 'upload'] },
    { title: 'W.E.L', route: 'admin/well', permissions: ['view', 'edit', 'upload'] },
    {
      title: 'Admin',
      subSections: [
        { title: 'Accommodation', route: 'admin/admin/accommodation', permissions: ['view', 'edit', 'upload'] },
        { title: 'Graduate students', route: 'admin/admin/graduate', permissions: ['view', 'edit', 'upload'] },
        { title: 'Alumni', route: 'admin/admin/alumni', permissions: ['view', 'edit', 'upload'] },
      ],
    },
    {
      title: 'Reports',
      subSections: [
        { title: 'Moderation', route: 'admin/reports/moderation', permissions: ['view', 'edit', 'upload'] },
        { title: 'Account in arrears', route: 'admin/reports/arrears', permissions: ['view', 'edit', 'upload'] },
      ],
    },
    {
      title: 'Settings',
      subSections: [
        { title: 'Roles', route: 'admin/settings/roles', permissions: ['view', 'edit', 'upload'] },
        { title: 'Staff', route: 'admin/settings/staff', permissions: ['view', 'edit', 'upload'] },
        { title: 'Campus', route: 'admin/settings/campus', permissions: ['view', 'edit', 'upload'] },
        { title: 'Intake groups', route: 'admin/settings/intakegroup', permissions: ['view', 'edit', 'upload'] },
        { title: 'Outcomes', route: 'admin/settings/outcomes', permissions: ['view', 'edit', 'upload'] },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Section</th>
              {['View', 'Edit', 'Add'].map(permission => (
                <th key={permission} className="px-4 py-2 border">{permission}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map(section => (
              <React.Fragment key={section.title}>
                <tr className="bg-gray-200">
                  <td className="px-4 py-2 border font-semibold sticky left-0 bg-gray-200">{section.title}</td>
                  {!section.subSections && ['view', 'edit', 'upload'].map(permission => (
                    <td key={permission} className="px-4 py-2 border text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={permissions[section.route]?.[permission] || false}
                        onChange={() => handlePermissionChange(section.route, permission)}
                      />
                    </td>
                  ))}
                  {section.subSections && ['view', 'edit', 'upload'].map(permission => (
                    <td key={permission} className="px-4 py-2 border text-center"></td>
                  ))}
                </tr>
                {section.subSections && section.subSections.map(subSection => (
                  <tr key={subSection.title}>
                    <td className="px-4 py-2 border pl-8 sticky left-0 bg-white">{subSection.title}</td>
                    {['view', 'edit', 'upload'].map(permission => (
                      <td key={permission} className="px-4 py-2 border text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={permissions[subSection.route]?.[permission] || false}
                          onChange={() => handlePermissionChange(subSection.route, permission)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndividualRoles;
