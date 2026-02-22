import { format } from 'date-fns';
import PixelCard from '../ui/PixelCard';
import PixelTooltip from '../ui/PixelTooltip';
import { getCurrentWeekDays, toISODate } from '../../utils/dateUtils';

function getDailyMinutesByWeek(sessions) {
  const days = getCurrentWeekDays();
  const map = new Map(days.map((date) => [toISODate(date), { minutes: 0, topicIds: new Set() }]));

  for (const session of sessions) {
    const day = session.startTime?.slice(0, 10);
    if (map.has(day)) {
      const entry = map.get(day);
      entry.minutes += session.durationMinutes;
      if (session.topicId) {
        entry.topicIds.add(session.topicId);
      }
    }
  }

  return days.map((date) => {
    const key = toISODate(date);
    const entry = map.get(key);
    const minutes = entry?.minutes || 0;
    return {
      key,
      dayLabel: format(date, 'EEE').toUpperCase(),
      minutes,
      hours: minutes / 60,
      topicCount: entry?.topicIds?.size || 0
    };
  });
}

function formatHoursMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function getYAxisMax(data) {
  const maxDailyHours = Math.max(0, ...data.map((day) => day.hours));
  const roundedEven = Math.ceil(maxDailyHours / 2) * 2;
  return Math.max(14, roundedEven);
}

export default function WeeklyGraph({ sessions }) {
  const data = getDailyMinutesByWeek(sessions);
  const today = toISODate(new Date());
  const totalMinutes = data.reduce((acc, day) => acc + day.minutes, 0);

  const maxHours = getYAxisMax(data);
  const yTicks = Array.from({ length: maxHours / 2 }, (_, index) => (index + 1) * 2);
  const chartHeight = 180;

  return (
    <PixelCard title="THIS WEEK'S GRIND">
      <div className="retro-grid" style={{ marginTop: 10, paddingTop: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 10 }}>
          <div style={{ position: 'relative', height: chartHeight }}>
            {yTicks.map((tick) => (
              <span
                key={tick}
                className="muted"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: `${(tick / maxHours) * chartHeight - 8}px`,
                  fontSize: 10
                }}
              >
                {tick}h
              </span>
            ))}
          </div>

          <div style={{ position: 'relative', height: chartHeight }}>
            {yTicks.map((tick) => (
              <div
                key={tick}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${(tick / maxHours) * chartHeight}px`,
                  borderTop: '1px dashed rgba(79, 24, 130, 0.16)'
                }}
              />
            ))}

            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: 12,
                alignItems: 'end'
              }}
            >
              {data.map((item) => {
                const barHeight = Math.max(item.minutes > 0 ? 8 : 4, Math.round((item.hours / maxHours) * chartHeight));
                const isToday = item.key === today;
                return (
                  <div key={item.key} style={{ display: 'grid', gridTemplateRows: '1fr auto', justifyItems: 'center', gap: 8 }}>
                    <PixelTooltip
                      label={
                        <div>
                          <div>{formatHoursMinutes(item.minutes)}</div>
                          <div className="muted" style={{ fontSize: 10 }}>
                            {item.topicCount} topic{item.topicCount === 1 ? '' : 's'} covered
                          </div>
                        </div>
                      }
                    >
                      <div
                        style={{
                          width: '70%',
                          minWidth: 16,
                          maxWidth: 40,
                          height: barHeight,
                          border: '2px solid var(--border-dim)',
                          borderRadius: 4,
                          background: isToday ? 'var(--graph-bar-today)' : 'var(--graph-bar)',
                          boxShadow: isToday ? '0 0 0 3px rgba(147, 51, 234, 0.2)' : 'none',
                          alignSelf: 'end'
                        }}
                      />
                    </PixelTooltip>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? 'var(--accent-primary)' : 'var(--text-dim)' }}>
                      {item.dayLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8, fontSize: 14 }}>WEEKLY TOTAL: {formatHoursMinutes(totalMinutes)}</div>
    </PixelCard>
  );
}
