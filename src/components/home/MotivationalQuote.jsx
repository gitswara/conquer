import { useEffect, useState } from 'react';
import PixelCard from '../ui/PixelCard';
import { randomQuote } from '../../constants/quotes';

export default function MotivationalQuote({ rerollKey }) {
  const [quote, setQuote] = useState(() => randomQuote());

  useEffect(() => {
    setQuote(randomQuote());
  }, [rerollKey]);

  return (
    <PixelCard>
      <blockquote style={{ margin: 0, textAlign: 'center', fontStyle: 'italic' }}>
        <span style={{ color: 'var(--accent-secondary)', fontSize: 24 }}>“</span>
        {quote}
        <span style={{ color: 'var(--accent-secondary)', fontSize: 24, marginLeft: 2 }}>”</span>
      </blockquote>
    </PixelCard>
  );
}
