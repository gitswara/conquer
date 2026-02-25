import { useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import {
  THEME_OPTIONS,
  FONT_SIZE_OPTIONS,
  applyTheme,
  applyFontSize,
  readSavedThemeId,
  readSavedFontSizeId
} from '../../utils/appearance';

export default function SettingsPanel() {
  const [activeTheme, setActiveTheme] = useState(() => readSavedThemeId());
  const [fontSize, setFontSize] = useState(() => readSavedFontSizeId());

  return (
    <div className="section-stack">
      <PixelCard title="SETTINGS">
        <div className="section-stack">
          <section>
            <div className="field-label">THEME</div>
            <div className="theme-grid">
              {THEME_OPTIONS.map((theme) => {
                const selected = theme.id === activeTheme;
                return (
                  <button
                    key={theme.id}
                    className={`theme-option ${selected ? 'active' : ''}`}
                    onClick={() => {
                      const applied = applyTheme(theme.id);
                      setActiveTheme(applied);
                    }}
                    aria-label={`Apply ${theme.name} theme`}
                    aria-pressed={selected}
                    type="button"
                  >
                    <div className="theme-swatch" aria-hidden="true">
                      <span style={{ background: theme.background }} />
                      <span style={{ background: theme.accent }} />
                    </div>
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="field-label">FONT SIZE</div>
            <div className="row-wrap">
              {FONT_SIZE_OPTIONS.map((option) => (
                <PixelButton
                  key={option.id}
                  className={fontSize === option.id ? 'tab-active' : ''}
                  onClick={() => {
                    const applied = applyFontSize(option.id);
                    setFontSize(applied);
                  }}
                >
                  {option.label}
                </PixelButton>
              ))}
            </div>
          </section>
        </div>
      </PixelCard>
    </div>
  );
}
