"use client";

import React, { useState, useEffect } from 'react';
import { useGetRolesQuery, useAddNewRoleMutation, useDeleteRoleMutation, useUpdateRoleMutation } from '@/lib/features/roles/rolesApiSlice';

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
  { title: 'Notificaions', route: 'admin/notifications', permissions: ['View', 'Edit', 'Add'] },
  {
    title: 'Admin',
    subSections: [
      { title: 'Accommodation', route: 'admin/admin/accommodation', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Graduate students', route: 'admin/admin/graduate', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Alumni', route: 'admin/admin/alumni', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Change Student Intakegroup', route: 'admin/admin/change-student-intakegroup', permissions: ['View', 'Edit', 'Add'] },
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
      { title: 'Qualifications', route: 'admin/settings/qualification', permissions: ['View', 'Edit', 'Add'] },
      { title: 'Outcomes', route: 'admin/settings/outcomes', permissions: ['View', 'Edit', 'Add'] },
    ],
  },
];

const EditRoles = () => {
  const { data: rolesData, isLoading, isSuccess, isError, error } = useGetRolesQuery();
  const [addNewRole] = useAddNewRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [permissions, setPermissions] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      const rolesArray = Object.values(rolesData.entities);
      console.log('Fetched Roles:', rolesArray);

      const initialPermissions = {};

      rolesArray.forEach(role => {
        initialPermissions[role.roleName] = {};

        role.permissions.forEach(permission => {
          if (!initialPermissions[role.roleName][permission.page]) {
            initialPermissions[role.roleName][permission.page] = {
              View: permission.actions.view,
              Edit: permission.actions.edit,
              Add: permission.actions.upload,
            };
          }
        });
      });

      console.log('Initial Permissions:', initialPermissions);
      setPermissions(initialPermissions);
      setRoles(rolesArray.map(role => role.roleName));
    } else {
      console.error('Roles data is not an array:', rolesData);
    }
  }, [rolesData, isSuccess]);

  const handlePermissionChange = (role, section, permission) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [section]: {
          ...prev[role]?.[section],
          [permission]: !prev[role]?.[section]?.[permission],
        },
      },
    }));
  };

  const handleAddRole = () => {
    const newRoleName = prompt("Enter the new role name:");
    if (newRoleName) {
      const newRole = {
        roleName: newRoleName,
        description: `${newRoleName} roles and permissions`,
        permissions: sections.flatMap(section => 
          section.subSections ? section.subSections.map(subSection => ({
            page: subSection.route,
            actions: { view: false, edit: false, upload: false },
          })) : [{
            page: section.route,
            actions: { view: false, edit: false, upload: false },
          }]
        ),
      };

      addNewRole(newRole).unwrap().then(() => {
        setRoles(prevRoles => [...prevRoles, newRoleName]);
        setPermissions(prevPermissions => ({
          ...prevPermissions,
          [newRoleName]: sections.reduce((acc, section) => {
            acc[section.route] = {
              View: false,
              Edit: false,
              Add: false,
            };
            if (section.subSections) {
              section.subSections.forEach(subSection => {
                acc[subSection.route] = {
                  View: false,
                  Edit: false,
                  Add: false,
                };
              });
            }
            return acc;
          }, {}),
        }));
      });
    }
  };

  const handleDeleteRole = (roleName) => {
    if (confirm(`Are you sure you want to delete the role: ${roleName}?`)) {
      const role = Object.values(rolesData.entities).find(role => role.roleName === roleName);
      if (role) {
        deleteRole(role.id).unwrap().then(() => {
          setRoles(prevRoles => prevRoles.filter(role => role !== roleName));
          setPermissions(prevPermissions => {
            const newPermissions = { ...prevPermissions };
            delete newPermissions[roleName];
            return newPermissions;
          });
        });
      }
    }
  };

  const handleSavePermissions = () => {
    const promises = roles.map(roleName => {
      const role = Object.values(rolesData.entities).find(role => role.roleName === roleName);
      if (role) {
        const updatedPermissions = Object.keys(permissions[roleName]).map(page => ({
          page,
          actions: {
            view: permissions[roleName][page].View,
            edit: permissions[roleName][page].Edit,
            upload: permissions[roleName][page].Add,
          },
        }));
  
        const updatedRole = {
          roleName: roleName,
          description: role.description,
          permissions: updatedPermissions,
        };
  
        return updateRole({ id: role.id, formData: updatedRole }).unwrap();
      }
    });
  
    Promise.all(promises)
      .then(() => {
        alert('Permissions saved successfully');
      })
      .catch((error) => {
        alert('Failed to save permissions');
      });
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>
      <button
        onClick={handleAddRole}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Role
      </button>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Actions</th>
              {roles.map(role => (
                <th key={role} className="px-4 py-2 border">
                  <div className="flex items-center justify-between">
                    <span>{role}</span>
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="text-red-500 ml-2"
                    >
                      &times;
                    </button>
                  </div>
                </th>
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
                            checked={permissions[role]?.[section.route]?.[permission] || false}
                            onChange={() => handlePermissionChange(role, section.route, permission)}
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
                              checked={permissions[role]?.[subSection.route]?.[permission] || false}
                              onChange={() => handlePermissionChange(role, subSection.route, permission)}
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
      <button
        onClick={handleSavePermissions}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Save Permissions
      </button>
    </div>
  );
};

export default EditRoles;
