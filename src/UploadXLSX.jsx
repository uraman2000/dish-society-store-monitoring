import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { checklist, stores } from "./assets/checklist";

function UploadXLSX({ setFormattedData }) {
  const fileInputRef = useRef();
  const [selectedDate, setSelectedDate] = useState("6/02/25");

  function mapTaskNameToStandard(taskName) {
    // Direct matches from checklist
    if (
      taskName === "DISH SOCIETY - FOH OPENING" ||
      taskName === "DISH SOCIETY - TRANSITION" ||
      taskName === "DISH SOCIETY - FOH CLOSING" ||
      taskName === "Line Check"
    ) {
      return taskName;
    }

    // Map deep clean variations
    if (taskName.includes("FOH Deep Clean")) {
      return "DISH - FOH Deep Clean";
    }

    if (taskName.includes("BOH Deep Clean")) {
      return "DISH - BOH Deep Clean";
    }

    // Return original if no mapping found
    return taskName;
  }

  const formatData = (data) => {
    const formattedData = data.slice(1).map((row) => ({
      name: row["__EMPTY"].trim() || "",
      storeName: row["__EMPTY_2"].trim() || "",
      date: row["__EMPTY_5"].trim() || "",
      time:
        row["__EMPTY_5"].split(" ")[1] + " " + row["__EMPTY_5"].split(" ")[2] ||
        "",
    }));
    return formattedData
      .map((item) => ({
        ...item,
        name: mapTaskNameToStandard(item.name),
      }))
      .filter((item) => item.date.startsWith(selectedDate));
  };

  function isThirtyMinutesLate(actualTimeStr, scheduledTimeStr) {
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

    return diffMinutes >= 30;
  }

  const checkName = (checklistStoreName, dataStoreName) => {
    return dataStoreName.includes(checklistStoreName);
  };

  const findLateCheck = (formattedData) => {
    const array = [];
    formattedData.find((data) => {
      const checkList = checklist.find(
        (check) =>
          checkName(check.storeName, data.name) &&
          data.time.split(" ")[1] === check.time.split(" ")[1]
      );

      if (checkList && isThirtyMinutesLate(data.time, checkList.time)) {
        array.push(data);
      }
      return false;
    });
    return array;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    const formatted = formatData(json);

        // console.log("lateCheck", findLateCheck(formatted));

        // console.log(
        //   "missingReportsPerStore",
        //   getMissingReportsPerStore(checklist, formatted, stores)
        // );

    setFormattedData({
      lateCheck: findLateCheck(formatted),
      missingReportsPerStore: getMissingReportsPerStore(
        checklist,
        formatted,
        stores
      ),
    });
  };

  function getMissingReportsPerStore(checklist, reports, stores) {
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, " ").trim();

    const missingReportsPerStore = {};

    stores.forEach((store) => {
      const normalizedStore = normalize(store);
      missingReportsPerStore[store] = [];

      checklist.forEach((item) => {
        const normalizedChecklistName = normalize(item.storeName);

        const matchFound = reports.some((report) => {
          const reportName = normalize(report.name);
          const reportStore = normalize(report.storeName);

          // Check if report name exists in checklist name AND store matches
          return (
            normalizedChecklistName.includes(reportName) &&
            reportStore === normalizedStore
          );
        });

        if (!matchFound) {
          // If no matching report found, this checklist item is missing for the store
          missingReportsPerStore[store].push(item);
        }
      });
    });

    return missingReportsPerStore;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-lg p-8 gap-6 w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Store Monitoring Dashboard
      </h2>

      {/* Date Input */}
      <div className="w-full max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date (mm/dd/yy)
        </label>
        <div className="relative">
          <input
            type="text"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="mm/dd/yy"
            className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="w-full">
        <label
          htmlFor="xlsx-upload"
          className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-8 hover:bg-blue-50 transition-all duration-200 bg-blue-50/30"
        >
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-blue-500 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M4.75 19.25h14.5A2.25 2.25 0 0021.5 17V7A2.25 2.25 0 0019.25 4.75H4.75A2.25 2.25 0 002.5 7v10a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <span className="text-blue-600 font-medium text-lg mb-1">
              Upload XLSX File
            </span>
            <span className="text-gray-500 text-sm">
              Click or drag and drop your file here
            </span>
          </div>
          <input
            id="xlsx-upload"
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <p className="text-gray-500 text-sm mt-3 text-center">
          Supported formats: .xlsx, .xls
        </p>
      </div>
    </div>
  );
}

export default UploadXLSX;
