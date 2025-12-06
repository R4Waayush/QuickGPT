import React from "react";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Chatbox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";

const App = () => {
  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-white dark:bg-gradient-to-b dark:from-[#242124] dark:to-[#000000] text-gray-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Chatbox />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;