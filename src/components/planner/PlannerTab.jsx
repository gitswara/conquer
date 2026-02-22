import PixelButton from '../ui/PixelButton';
import SetupWizard from './SetupWizard';
import ScheduleTab from './ScheduleTab';
import SyllabusTable from './SyllabusTable';

export default function PlannerTab({
  config,
  topics,
  plannerSubtab,
  onSetSubtab,
  onSetConfig,
  onUpdateConfig,
  onAddSubject,
  onAddTopic,
  onAddSubtopic,
  onUpdateSubtopic,
  onToggleSubtopic,
  onDeleteSubject,
  onDeleteTopic,
  onDeleteSubtopic,
  onFinishSetup
}) {
  if (!config) {
    return (
      <SetupWizard
        topics={topics}
        onAddSubject={onAddSubject}
        onAddTopic={onAddTopic}
        onAddSubtopic={onAddSubtopic}
        onFinish={(payload) => {
          onSetConfig(payload);
          onFinishSetup?.();
        }}
      />
    );
  }

  return (
    <div className="section-stack">
      <div className="toolbar-panel">
        <div className="field-label">PLANNER VIEW</div>
        <div className="row-wrap">
          <PixelButton className={plannerSubtab === 'SCHEDULE' ? 'tab-active' : ''} onClick={() => onSetSubtab('SCHEDULE')}>
            📅 SCHEDULE
          </PixelButton>
          <PixelButton className={plannerSubtab === 'SYLLABUS' ? 'tab-active' : ''} onClick={() => onSetSubtab('SYLLABUS')}>
            📋 SYLLABUS
          </PixelButton>
        </div>
      </div>

      {plannerSubtab === 'SCHEDULE' ? (
        <ScheduleTab config={config} onUpdateConfig={onUpdateConfig} />
      ) : (
        <SyllabusTable
          topics={topics}
          onAddSubject={onAddSubject}
          onAddTopic={onAddTopic}
          onAddSubtopic={onAddSubtopic}
          onUpdateSubtopic={onUpdateSubtopic}
          onToggleSubtopic={onToggleSubtopic}
          onDeleteSubject={onDeleteSubject}
          onDeleteTopic={onDeleteTopic}
          onDeleteSubtopic={onDeleteSubtopic}
        />
      )}
    </div>
  );
}
