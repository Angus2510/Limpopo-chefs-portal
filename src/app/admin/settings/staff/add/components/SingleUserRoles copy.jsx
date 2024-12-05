"use client";

import React, { useState } from 'react';

const IndividualRoles = ({ roles, handlePermissionChange, permissions }) => {
    const sections = [
        { title: 'Dashboard', route: 'admin/dashboard', permissions: ['View', 'Edit', 'Add'] },
        { title: 'Students', route: 'admin/students', permissions: ['View', 'Edit', 'Add'] },
        {
          title: 'Finance',
          subSections: [
            { title: 'Paid', route: 'admin/finance/collect', permissions: ['View', 'Edit', 'Add'] },
            { title: 'To Pay', route: 'admin/finance/payable', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Finance Sheet', route: 'admin/finance/sheet', permissions: ['View', 'Edit', 'Add'] },
          ],
        },
        {
          title: 'Test/Tasks',
          subSections: [
            { title: 'All', route: 'admin/assignment', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Create', route: 'admin/assignment/create', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Mark', route: 'admin/assignment/mark', permissions: ['View', 'Edit', 'Add'] },
          ],
        },
        {
          title: 'Attendance',
          subSections: [
            { title: 'Student Attendance', route: 'admin/attendance/student', permissions: ['View', 'Edit', 'Add'] },
            { title: 'QR Attendance', route: 'admin/attendance/qr', permissions: ['View', 'Edit', 'Add'] },
            { title: 'W.E.L Attendance', route: 'admin/attendance/wel', permissions: ['View', 'Edit', 'Add'] },
          ],
        },
        {
          title: 'Results',
          subSections: [
            { title: 'Capture', route: 'admin/results/capture', permissions: ['View', 'Edit', 'Add'] },
            { title: 'SOR', route: 'admin/results/sor', permissions: ['View', 'Edit', 'Add'] },
          ],
        },
        { title: 'Learning Material', route: 'admin/uploads', permissions: ['View', 'Edit', 'Add'] },
        { title: 'W.E.L', route: 'admin/well', permissions: ['View', 'Edit', 'Add'] },
        {
          title: 'Admin',
          subSections: [
            { title: 'Accommodation', route: 'admin/admin/accommodation', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Graduate students', route: 'admin/admin/graduate', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Alumni', route: 'admin/admin/alumni', permissions: ['View', 'Edit', 'Add'] },
          ],
        },
        {
          title: 'Reports',
          subSections: [
            { title: 'Moderation', route: 'admin/reports/moderation', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Account in arrears', route: 'admin/reports/arrears', permissions: ['View', 'Edit', 'Add'] },
          ],
        },
        {
          title: 'Settings',
          subSections: [
            { title: 'Roles', route: 'admin/settings/roles', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Staff', route: 'admin/settings/staff', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Campus', route: 'admin/settings/campus', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Intake groups', route: 'admin/settings/intakegroup', permissions: ['View', 'Edit', 'Add'] },
            { title: 'Outcomes', route: 'admin/settings/outcomes', permissions: ['View', 'Edit', 'Add'] },
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
                  {!section.subSections && ['View', 'Edit', 'Add'].map(permission => (
                    <td key={permission} className="px-4 py-2 border text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={permissions[roles]?.[section.title]?.[permission] || false}
                        onChange={() => handlePermissionChange(roles, section.title, permission)}
                      />
                    </td>
                  ))}
                  {section.subSections && ['View', 'Edit', 'Add'].map(permission => (
                    <td key={permission} className="px-4 py-2 border text-center"></td>
                  ))}
                </tr>
                {section.subSections && section.subSections.map(subSection => (
                  <tr key={subSection.title}>
                    <td className="px-4 py-2 border pl-8 sticky left-0 bg-white">{subSection.title}</td>
                    {['View', 'Edit', 'Add'].map(permission => (
                      <td key={permission} className="px-4 py-2 border text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={permissions[roles]?.[subSection.title]?.[permission] || false}
                          onChange={() => handlePermissionChange(roles, subSection.route, subSection.title, permission)}
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
