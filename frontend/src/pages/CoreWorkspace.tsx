import React from "react";
import { Link } from "react-router-dom";
import StrategicSprint from "@/components/StrategicSprint";

const CoreWorkspace = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Core Workspace</h1>
        <div className="space-x-4">
          <Link to="/my-forge" className="text-blue-600 hover:underline dark:text-blue-400">
            My Forge
          </Link>
          <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Landing Page
          </Link>
        </div>
      </div>
      <StrategicSprint />
    </div>
  );
};

export default CoreWorkspace;