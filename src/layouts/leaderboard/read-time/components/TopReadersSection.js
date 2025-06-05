import React from "react";
import PropTypes from "prop-types";
import { Clock } from "lucide-react";
import Icon from "@mui/material/Icon";
import SoftButton from "components/SoftButton";
import LeaderboardItem from "./LeaderboardItem";

function TopReadersSection({ leaderboard, activeTab, onExport }) {
  return (
    <section className="leaderboard-section">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Read Time</h2>
        </div>
        <SoftButton variant="outlined" color="info" size="small" onClick={onExport}>
          <Icon>file_download</Icon>&nbsp; Export to Excel
        </SoftButton>
      </div>

      <div className="space-y-6">
        {leaderboard?.map((reader, index) => (
          <LeaderboardItem
            key={`${index}-${reader.name}`}
            reader={reader}
            index={index}
            activeTab={activeTab}
          />
        ))}
      </div>
    </section>
  );
}

TopReadersSection.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      user_ic: PropTypes.string,
      name: PropTypes.string,
      school: PropTypes.string,
      value: PropTypes.number,
      avatar_url: PropTypes.string,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default TopReadersSection;
