import React, { useState } from "react";
import UploadXLSX from "./UploadXLSX";
import Lates from "./components/Lates";
import MissingReportPerStore from "./components/MissingReportPerStore";

function App() {
  const [formattedData, setFormattedData] = useState({});
  const [activeTab, setActiveTab] = useState("lates");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {Object.keys(formattedData).length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <UploadXLSX setFormattedData={setFormattedData} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white rounded-t-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab("lates")}
              className={` cursor-pointer flex-1 py-3 px-6 rounded-md transition-all duration-200 font-medium text-sm
                ${
                  activeTab === "lates"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Late Reports
            </button>
            <button
              onClick={() => setActiveTab("missing")}
              className={` cursor-pointer flex-1 py-3 px-6 rounded-md transition-all duration-200 font-medium text-sm
                ${
                  activeTab === "missing"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Missing Reports
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow-md p-6">
            {activeTab === "lates" && formattedData.lateCheck && (
              <div className="animate-fadeIn">
                <Lates data={formattedData.lateCheck} />
              </div>
            )}
            {activeTab === "missing" &&
              formattedData.missingReportsPerStore && (
                <div className="animate-fadeIn">
                  <MissingReportPerStore
                    data={formattedData.missingReportsPerStore}
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
