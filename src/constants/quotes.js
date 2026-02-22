export const MOTIVATIONAL_QUOTES = [
  'Small progress each day adds up to epic results.',
  'Discipline is the bridge between goals and rank.',
  'Your future score is built in today\'s session.',
  'Focus now, celebrate later.',
  'You do not need motivation. You need momentum.',
  'One page at a time still wins the quest.',
  'Consistency beats intensity when exams get hard.',
  'You are one focused hour away from improvement.',
  'Study like your goal date is non-negotiable.',
  'The grind is temporary. Mastery stays.',
  'Every solved problem upgrades your character.',
  'Progress is quiet. Keep showing up.',
  'Train your attention; scores will follow.',
  'Avoid perfection. Finish the mission.',
  'You are not behind if you keep moving.',
  'The syllabus is big. So is your capacity.',
  'Courage is opening the hard chapter first.',
  'Late starts still become great finishes.',
  'Your streak is a contract with your future self.',
  'Focus is a superpower in a distracted world.',
  'Master the basics, then conquer the paper.',
  'A calm mind solves faster than a rushed one.'
];

export function randomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
