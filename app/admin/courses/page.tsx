import React from 'react';

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Course Card Template */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Course Title</h3>
                <p className="mt-1 text-sm text-gray-500">Course Description</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Students</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">12 weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <span className="font-medium">$99.99</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button className="flex-1 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No courses available. Create your first course to get started.</p>
        </div>
      </div>
    </div>
  );
} 