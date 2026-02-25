import { useMemo, useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import { uid } from '../../utils/id';
import AddSubjectModal from './AddSubjectModal';
import AddTopicModal from './AddTopicModal';
import AddSubtopicModal from './AddSubtopicModal';

const TOTAL_STEPS = 4;

export default function SetupWizard({ subjects, topics, onAddSubject, onAddTopic, onAddSubtopic, onFinish }) {
  const [step, setStep] = useState(1);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [syllabusDeadline, setSyllabusDeadline] = useState('');
  const [revisionPeriods, setRevisionPeriods] = useState([]);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);

  const topicCount = topics.length;
  const subtopicCount = useMemo(
    () => topics.reduce((acc, topic) => acc + topic.subtopics.length, 0),
    [topics]
  );

  const canContinueStep1 = examName.trim() && examDate && syllabusDeadline && syllabusDeadline <= examDate;
  const canContinueStep3 = topicCount > 0;

  function addRevision() {
    if (revisionPeriods.length >= 5) return;
    setRevisionPeriods((prev) => [...prev, { id: uid('rev'), label: '', startDate: '', endDate: '' }]);
  }

  function updateRevision(id, patch) {
    setRevisionPeriods((prev) => prev.map((period) => (period.id === id ? { ...period, ...patch } : period)));
  }

  function removeRevision(id) {
    setRevisionPeriods((prev) => prev.filter((period) => period.id !== id));
  }

  function handleStepEnter(event) {
    if (event.key !== 'Enter') return;
    if (!('value' in event.target)) return;

    const rawValue = String(event.target.value || '').trim();
    if (!rawValue) return;

    event.preventDefault();

    if (step === 1 && canContinueStep1) {
      setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    } else if (step === 2) {
      setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    } else if (step === 3 && canContinueStep3) {
      setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    }
  }

  return (
    <div className="section-stack">
      <PixelCard title={`STEP [${step}/${TOTAL_STEPS}]`}>
        {step === 1 ? (
          <div className="section-stack">
            <label className="pixel-label" style={{ fontSize: 10 }}>EXAM NAME</label>
            <input
              className="pixel-input-cursor"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              onKeyDown={handleStepEnter}
            />

            <label className="pixel-label" style={{ fontSize: 10 }}>EXAM DATE</label>
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} onKeyDown={handleStepEnter} />

            <label className="pixel-label" style={{ fontSize: 10 }}>SYLLABUS COMPLETION TARGET DATE</label>
            <input
              type="date"
              value={syllabusDeadline}
              onChange={(e) => setSyllabusDeadline(e.target.value)}
              onKeyDown={handleStepEnter}
            />

            {!canContinueStep1 ? (
              <div className="muted" style={{ fontSize: 12 }}>
                Target date must be on or before exam date.
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="section-stack">
            <div className="muted">Add 0 to 5 revision periods.</div>
            {revisionPeriods.map((period) => (
              <div key={period.id} className="pixel-card" style={{ padding: 10 }}>
                <input
                  placeholder="Label (e.g. Revision Round 1)"
                  value={period.label}
                  onChange={(e) => updateRevision(period.id, { label: e.target.value })}
                  onKeyDown={handleStepEnter}
                />
                <div className="row-wrap" style={{ marginTop: 8 }}>
                  <input
                    type="date"
                    value={period.startDate}
                    onChange={(e) => updateRevision(period.id, { startDate: e.target.value })}
                    aria-label="Revision start date"
                    onKeyDown={handleStepEnter}
                  />
                  <input
                    type="date"
                    value={period.endDate}
                    onChange={(e) => updateRevision(period.id, { endDate: e.target.value })}
                    aria-label="Revision end date"
                    onKeyDown={handleStepEnter}
                  />
                  <PixelButton variant="danger" onClick={() => removeRevision(period.id)}>
                    DELETE
                  </PixelButton>
                </div>
              </div>
            ))}
            <PixelButton onClick={addRevision} disabled={revisionPeriods.length >= 5}>
              + ADD REVISION PERIOD
            </PixelButton>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="section-stack">
            <div>
              Current: {topicCount} topics, {subtopicCount} subtopics.
            </div>
            <div className="row-wrap">
              <PixelButton onClick={() => setShowSubjectModal(true)}>+ ADD SUBJECT</PixelButton>
              <PixelButton onClick={() => setShowTopicModal(true)}>+ ADD TOPIC</PixelButton>
              <PixelButton onClick={() => setShowSubtopicModal(true)}>+ ADD SUBTOPIC</PixelButton>
            </div>
            {!canContinueStep3 ? (
              <div className="muted" style={{ fontSize: 12 }}>Add at least one topic to continue.</div>
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="section-stack">
            <div><strong>EXAM:</strong> {examName}</div>
            <div><strong>EXAM DATE:</strong> {examDate}</div>
            <div><strong>SYLLABUS DEADLINE:</strong> {syllabusDeadline}</div>
            <div><strong>REVISION PERIODS:</strong> {revisionPeriods.length}</div>
            <div><strong>TOPICS:</strong> {topicCount}</div>
            <PixelButton
              variant="success"
              onClick={() =>
                onFinish({
                  examName,
                  examDate,
                  syllabusDeadline,
                  revisionPeriods,
                  createdAt: new Date().toISOString()
                })
              }
            >
              ⚔️ BEGIN QUEST
            </PixelButton>
          </div>
        ) : null}
      </PixelCard>

      <div className="row-wrap">
        <PixelButton onClick={() => setStep((prev) => Math.max(1, prev - 1))} disabled={step === 1}>
          BACK
        </PixelButton>
        <PixelButton
          onClick={() => setStep((prev) => Math.min(TOTAL_STEPS, prev + 1))}
          disabled={(step === 1 && !canContinueStep1) || (step === 3 && !canContinueStep3) || step === TOTAL_STEPS}
        >
          NEXT
        </PixelButton>
      </div>

      <AddSubjectModal
        open={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        onSubmit={(payload) => {
          onAddSubject(payload);
          setShowSubjectModal(false);
        }}
      />
      <AddTopicModal
        open={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        subjects={subjects}
        topics={topics}
        onSubmit={(payload) => {
          onAddTopic(payload);
          setShowTopicModal(false);
        }}
      />
      <AddSubtopicModal
        open={showSubtopicModal}
        onClose={() => setShowSubtopicModal(false)}
        topics={topics}
        onSubmit={({ topicId, name }) => {
          onAddSubtopic(topicId, name);
          setShowSubtopicModal(false);
        }}
      />
    </div>
  );
}
