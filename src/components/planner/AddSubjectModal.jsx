import { useEffect, useRef, useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';

export default function AddSubjectModal({ open, onClose, onSubmit }) {
  const [subjectName, setSubjectName] = useState('');
  const subjectNameRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    subjectNameRef.current?.focus();
  }, [open]);

  function handleSave() {
    if (!subjectName.trim()) return;
    onSubmit({ subjectName: subjectName.trim() });
    setSubjectName('');
  }

  return (
    <PixelModal
      open={open}
      onClose={onClose}
      title="+ ADD SUBJECT"
      footer={
        <div className="row-wrap">
          <PixelButton onClick={handleSave}>
            SAVE
          </PixelButton>
          <PixelButton onClick={onClose}>CANCEL</PixelButton>
        </div>
      }
    >
      <label className="pixel-label" htmlFor="subjectName" style={{ fontSize: 10 }}>
        SUBJECT NAME
      </label>
      <input
        id="subjectName"
        ref={subjectNameRef}
        className="pixel-input-cursor"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          handleSave();
        }}
      />
    </PixelModal>
  );
}
