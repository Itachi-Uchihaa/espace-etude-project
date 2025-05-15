'use client'
import { useState } from "react";

const gradeData = {
  "Grade 01": Array(4).fill("Algebra Basics"),
  "Grade 02": Array(4).fill("Algebra Basics"),
};

export default function EducationContentTab() {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="p-6">
      {/* Top Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Search Courses"
          className="border border-gray-300 rounded-full px-4 py-2 w-[280px] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-4">
          <select
            className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="All">Grade Level</option>
            <option value="Grade 01">Grade 01</option>
            <option value="Grade 02">Grade 02</option>
          </select>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-indigo-500 text-white rounded-full px-6 py-2 font-semibold"
            >
              + Add
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                {["Course", "Exercise", "Quiz"].map((item) => (
                  <div
                    key={item}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Groups */}
      {Object.entries(gradeData)
        .filter(([grade]) => selectedGrade === "All" || selectedGrade === grade)
        .map(([grade, courses]) => (
          <div key={grade} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{grade}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {courses.map((title, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow border overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src="https://via.placeholder.com/300x180?text=Online+English+Lessons"
                      alt={title}
                      className="w-full h-40 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow text-gray-700 font-medium">
                      Mathematics
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      ⏱ Last Update 2 Days Ago
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 text-sm">
                        Delete
                      </button>
                      <button className="bg-indigo-500 text-white rounded px-4 py-1 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
