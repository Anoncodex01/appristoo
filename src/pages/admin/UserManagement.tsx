import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserForm } from '../../components/admin/UserForm';
import { UserTable } from '../../components/admin/UserTable';
import { useUsers } from '../../hooks/useUsers';

export function UserManagement() {
  const [showForm, setShowForm] = useState(false);
  const { users, loading, error, reloadUsers } = useUsers();

  return (
    <AdminLayout
      title="User Management"
      description="Manage users and their permissions"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-gray-600">Add and manage user permissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <UserTable users={users} loading={loading} onRefresh={reloadUsers} />

      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            reloadUsers();
          }}
        />
      )}
    </AdminLayout>
  );
}