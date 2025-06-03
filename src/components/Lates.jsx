import React from "react";
import { checklist } from "../assets/checklist";

function getMinutesLate(actualTimeStr, scheduledTimeStr) {
  const parseTime12Hour = (timeStr) => {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes; // total minutes since midnight
  };

  const actualMinutes = parseTime12Hour(actualTimeStr);
  const scheduledMinutes = parseTime12Hour(scheduledTimeStr);

  const diffMinutes = actualMinutes - scheduledMinutes;

  return diffMinutes;
}

export default function Lates({ data }) {
  // Group tasks by store
  console.log(data);
  const tasksByStore = data.reduce((acc, task) => {
    if (!acc[task.storeName]) {
      acc[task.storeName] = [];
    }

    // Find matching checklist item
    const checklistItem = checklist.find((item) => {
      const taskTimeParts = task.time.split(" ");
      const taskTime = taskTimeParts[1] ? taskTimeParts[1].toUpperCase() : ""; // AM/PM part
      const itemTimeParts = item.time.split(" ");
      const itemTime = itemTimeParts[1] ? itemTimeParts[1].toUpperCase() : ""; // AM/PM part

      return item.storeName === task.name && itemTime === taskTime;
    });
    const scheduledTime = checklistItem ? checklistItem.time : "";

    acc[task.storeName].push({
      ...task,
      minutesLate: getMinutesLate(task.time, scheduledTime),
    });
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Late Tasks Overview
      </h1>
      <div className="space-y-4">
        {Object.entries(tasksByStore).map(([storeName, tasks]) => (
          <div
            key={storeName}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {storeName}
                </h2>
                <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                  {tasks.length} late {tasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {task.name}
                    </span>
                    <span className="text-sm text-gray-500">{task.date}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      {task.time}
                    </span>
                    <span className="text-sm text-red-500 italic">
                      {`${task.minutesLate} minutes late`}
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
