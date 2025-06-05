import React from "react";
import PropTypes from "prop-types";
import { Award, School } from "lucide-react";

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: "student",
      label: "Student",
      shortLabel: "Student",
      icon: (
        <Award
          className={`h-4 w-4 ${activeTab === "student" ? "text-amber-500" : "text-slate-500"}`}
        />
      ),
    },
    {
      id: "school",
      label: "School",
      shortLabel: "School",
      icon: (
        <School
          className={`h-4 w-4 ${activeTab === "school" ? "text-amber-500" : "text-slate-500"}`}
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-md transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-white dark:bg-slate-800 shadow-sm"
              : "hover:bg-white/50 dark:hover:bg-slate-800/50"
          }`}
        >
          {tab.icon}
          <span className="hidden sm:inline font-medium text-sm">{tab.label}</span>
          <span className="sm:hidden font-medium text-sm">{tab.shortLabel}</span>
        </button>
      ))}
    </div>
  );
}

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default TabNavigation;
