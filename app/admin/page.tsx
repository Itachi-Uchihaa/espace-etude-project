import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((card) => (
          <div className="flex flex-col gap-3 justify-between p-4 rounded-[15px] shadow-md bg-white border border-[#CCCCCC]">
            <div className='flex justify-between items-center'>
              <div className='flex flex-col justify-between gap-2'>
                <p className="text-sm text-gray-500">Total Students</p>
                <h2 className="text-3xl font-bold text-gray-900">40,689</h2>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13a4 4 0 00-4 4v3h8v-3a4 4 0 00-4-4z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {/* <ArrowUpRight className="w-4 h-4 text-emerald-500" /> */}
              <p className="text-sm text-emerald-500 font-medium">8.5%</p>
              <p className="text-sm text-gray-500">Up from Last Month</p>
            </div>
          </div>
        ))
        }
      </div>

      <div className="p-4 space-y-4">
        {/* Top Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Map */}
          <div className="col-span-2 h-64 border rounded-lg bg-white p-4">
            <h2 className="font-semibold text-lg">Map</h2>
          </div>

          {/* Students Per Country */}
          <div className="h-64 border rounded-lg bg-white p-4">
            <h2 className="font-semibold text-lg">Students Per Country</h2>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Most Active Days */}
          <div className="h-60 border rounded-lg bg-white p-4">
            <h2 className="font-semibold text-lg">Most Active Days</h2>
          </div>

          {/* Peak Usage Hours */}
          <div className="h-60 border rounded-lg bg-white p-4 col-span-2">
            <h2 className="font-semibold text-lg">Peak Usage Hours</h2>
          </div>

          {/* Most Viewed Subjects */}
          <div className="h-60 border rounded-lg bg-white p-4">
            <h2 className="font-semibold text-lg">Most Viewed Subjects</h2>
          </div>

          {/* Inactive Students */}
          <div className="h-60 border rounded-lg bg-white p-4 col-span-2">
            <h2 className="font-semibold text-lg">Inactive Students</h2>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="h-72 border rounded-lg bg-white p-4">
          <h2 className="font-semibold text-lg">Revenue Trends</h2>
        </div>
      </div>


    </div>
  );
} 