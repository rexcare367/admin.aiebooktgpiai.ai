import React from "react";
import PropTypes from "prop-types";
import { Award } from "lucide-react";
import UserAvatar from "./UserAvatar";

function LeaderboardItem({ reader, index, activeTab }) {
  return (
    <div className="grid grid-cols-4 items-center border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
      <div className="items-center gap-4 col-span-1 hidden lg:flex">
        <UserAvatar rank={index + 1} color="border-amber-500" />
        <p className="font-medium text-slate-800 dark:text-slate-100">{reader?.user_ic}</p>
      </div>

      <div className="flex items-center gap-4 col-span-3 lg:col-span-2">
        {reader?.avatar_url ? (
          <img src={reader?.avatar_url} alt="avatar" className="w-12 h-12 rounded-full" />
        ) : (
          <img src={`/${activeTab}.png`} alt="avatar" className="w-12 h-12 rounded-full" />
        )}
        <div>
          <p className="block lg:hidden font-medium text-slate-800 dark:text-slate-100">
            {reader?.user_ic}
          </p>
          <p className="font-medium text-slate-800 dark:text-slate-100 text-xs lg:text-lg">
            {reader.name ?? `Test-${activeTab}`}
          </p>
          {reader.school && (
            <p className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">
              {reader.school ?? "Test-School"}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 col-span-1">
        <Award className="h-5 w-5 text-amber-500" />
        <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
          {reader.value}%
        </span>
        <span className="hidden lg:block text-sm text-slate-500 dark:text-slate-400">Score</span>
      </div>
    </div>
  );
}

LeaderboardItem.propTypes = {
  reader: PropTypes.shape({
    user_ic: PropTypes.string,
    name: PropTypes.string,
    school: PropTypes.string,
    value: PropTypes.number,
    avatar_url: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default LeaderboardItem;
