import React from 'react';

export default function Lates({ data }) {
  // Group tasks by store
  console.log(data);
  const tasksByStore = data.reduce((acc, task) => {
    if (!acc[task.storeName]) {
      acc[task.storeName] = [];
    }
    acc[task.storeName].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Late Tasks Overview</h1>
      <div className="space-y-4">
        {Object.entries(tasksByStore).map(([storeName, tasks]) => (
          <div key={storeName} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">{storeName}</h2>
                <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                  {tasks.length} late {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {tasks.map((task, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{task.name}</span>
                    <span className="text-sm text-gray-500">{task.date}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      {task.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
