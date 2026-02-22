import { useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import { SUBJECT_SWATCHES } from '../../constants/colors';

export default function AddSubjectModal({ open, onClose, onSubmit }) {
  const [subjectName, setSubjectName] = useState('');
  const [color, setColor] = useState(SUBJECT_SWATCHES[0]);

  return (
    <PixelModal
      open={open}
      onClose={onClose}
      title="+ ADD SUBJECT"
      footer={
        <div className="row-wrap">
          <PixelButton
            onClick={() => {
              if (!subjectName.trim()) return;
              onSubmit({ subjectName: subjectName.trim(), color });
              setSubjectName('');
              setColor(SUBJECT_SWATCHES[0]);
            }}
          >
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
        className="pixel-input-cursor"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />
      <p className="pixel-label" style={{ fontSize: 10 }}>COLOR TAG</p>
      <div className="row-wrap">
        {SUBJECT_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            onClick={() => setColor(swatch)}
            style={{
              width: 28,
              height: 28,
              border: color === swatch ? '2px solid #fff' : '2px solid transparent',
              background: swatch,
              cursor: 'pointer'
            }}
            aria-label={`Select color ${swatch}`}
          />
        ))}
      </div>
    </PixelModal>
  );
}
