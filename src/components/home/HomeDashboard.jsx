import { useMemo } from 'react';
import SyllabusProgressBar from './SyllabusProgressBar';
import DaysRemainingWidget from './DaysRemainingWidget';
import StreakWidget from './StreakWidget';
import WeeklyGraph from './WeeklyGraph';
import MotivationalQuote from './MotivationalQuote';

export default function HomeDashboard({ config, topics, sessions, quoteSeed }) {
  const gridStyle = useMemo(
    () => ({
      display: 'grid',
      gap: 18,
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    }),
    []
  );

  return (
    <div className="section-stack">
      <SyllabusProgressBar topics={topics} />
      <div style={gridStyle}>
        <DaysRemainingWidget config={config} />
        <StreakWidget />
      </div>
      <WeeklyGraph sessions={sessions} />
      <MotivationalQuote rerollKey={quoteSeed} />
    </div>
  );
}
