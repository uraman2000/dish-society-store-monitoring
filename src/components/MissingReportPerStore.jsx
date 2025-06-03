import React, { useState } from 'react';

export default function MissingReportPerStore({ data }) {
  const [expandedStores, setExpandedStores] = useState({});

  const toggleStore = (location) => {
    setExpandedStores(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  // Filter out stores with no tasks
  const storesWithTasks = Object.entries(data).filter(([_, tasks]) => tasks.length > 0);

  return (
    <div className="p-6 space-y-2">
      {storesWithTasks.length > 0 ? (
        storesWithTasks.map(([location, tasks]) => (
          <div key={location} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleStore(location)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-medium text-gray-900">{location}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800">
                  {tasks.length} tasks
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedStores[location] ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`transition-all duration-200 ease-in-out ${expandedStores[location] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {task.storeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800">
                              {task.time}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No stores have reported tasks
        </div>
      )}
    </div>
  );
}
