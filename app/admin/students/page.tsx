'use client'
import React, { useState } from 'react';
import UserDetailModal from '@/components/admin/UserDetailModal';


const users = [
  {
    id: '#20462',
    name: 'Alice Roy',
    email: 'alice@email.com',
    grade: '10th Grade',
    city: 'Paris',
    lastActive: '2 days ago',
    status: 'Active',
  },
  {
    id: '#18933',
    name: 'Mark Lee',
    email: 'mark@email.com',
    grade: '10th Grade',
    city: 'Paris',
    lastActive: '15 days ago',
    status: 'Active',
  },
  {
    id: '#45169',
    name: 'Alice Roy',
    email: 'alice@email.com',
    grade: '10th Grade',
    city: 'Paris',
    lastActive: '5 days ago',
    status: 'Pending',
  },
  {
    id: '#34304',
    name: 'Mark Lee',
    email: 'mark@email.com',
    grade: '10th Grade',
    city: 'Paris',
    lastActive: '5 days ago',
    status: 'Pending',
  },
  {
    id: '#17188',
    name: 'Alice Roy',
    email: 'alice@email.com',
    grade: '8th Grade',
    city: 'Lyon',
    lastActive: '5 days ago',
    status: 'Canceled',
  },
  {
    id: '#73003',
    name: 'Mark Lee',
    email: 'mark@email.com',
    grade: '8th Grade',
    city: 'Lyon',
    lastActive: '5 days ago',
    status: 'Active',
  },
  {
    id: '#58825',
    name: 'Alice Roy',
    email: 'alice@email.com',
    grade: '8th Grade',
    city: 'Lyon',
    lastActive: '5 days ago',
    status: 'Active',
  },
  {
    id: '#44122',
    name: 'Mark Lee',
    email: 'mark@email.com',
    grade: '12th Grade',
    city: 'Lyon',
    lastActive: '5 days ago',
    status: 'Active',
  },
  {
    id: '#89094',
    name: 'Alice Roy',
    email: 'alice@email.com',
    grade: '12th Grade',
    city: 'Marseille',
    lastActive: '5 days ago',
    status: 'Inactive',
  },
  {
    id: '#85252',
    name: 'Emma Scot',
    email: 'emma@email.com',
    grade: '12th Grade',
    city: 'Marseille',
    lastActive: '5 days ago',
    status: 'Pending',
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-600';
    case 'Pending':
      return 'bg-orange-100 text-orange-600';
    case 'Canceled':
    case 'Inactive':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};


export default function StudentsPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <label>Show</label>
          <select className="border px-2 py-1 rounded">
            <option>10</option>
            <option>20</option>
          </select>
          <span>entries</span>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-1.5 rounded w-60"
        />

        <div className="flex gap-2">
          <select className="border px-2 py-1 rounded">
            <option>Grade Level</option>
          </select>
          <select className="border px-2 py-1 rounded">
            <option>City</option>
          </select>
          <select className="border px-2 py-1 rounded">
            <option>Status</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="bg-indigo-500 text-white px-4 py-1.5 rounded">
            Send Weekly Report
          </button>
          <button className="bg-indigo-500 text-white px-4 py-1.5 rounded">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[62vh]">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th className="py-2 px-4">Student ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Grade Level</th>
              <th className="py-2 px-4">City</th>
              <th className="py-2 px-4">Last Active</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={idx}
                onClick={() => handleRowClick(user)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src="https://i.pravatar.cc/30?img=3"
                    alt={user.name}
                    className="w-7 h-7 rounded-full"
                  />
                  {user.name}
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.grade}</td>
                <td className="py-3 px-4">{user.city}</td>
                <td className="py-3 px-4">{user.lastActive}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-indigo-500">
                  {/* Optional Action */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end mt-4 gap-2">
        <button className="px-3 py-1 border rounded text-gray-600">Previous</button>
        <button className="px-3 py-1 border rounded bg-indigo-500 text-white">1</button>
        <button className="px-3 py-1 border rounded">2</button>
        <button className="px-3 py-1 border rounded">3</button>
        <button className="px-3 py-1 border rounded text-gray-400" disabled>
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
