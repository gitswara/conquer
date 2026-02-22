function PixelRects({ color, pixels, unit = 2 }) {
  return pixels.map(([x, y, w = 1, h = 1], index) => (
    <rect
      key={`${color}-${index}-${x}-${y}`}
      x={x * unit}
      y={y * unit}
      width={w * unit}
      height={h * unit}
      fill={color}
    />
  ));
}

const KNIGHT_STEEL = [
  [26, 18, 4, 1], [25, 19, 6, 1], [24, 20, 8, 2],
  [26, 22, 4, 1], [25, 23, 6, 1], [25, 24, 6, 1],
  [26, 25, 4, 1], [27, 26, 2, 2],
  [23, 21, 2, 6], [32, 21, 2, 6],
  [23, 28, 4, 2], [30, 28, 4, 2], [26, 30, 4, 2]
];

const KNIGHT_ACCENT = [[26, 21, 4, 1], [26, 24, 4, 1], [27, 27, 2, 1]];
const KNIGHT_GOLD = [[26, 31, 1, 2], [29, 31, 1, 2], [27, 33, 2, 1]];

const SHIELD_MAIN = [
  [36, 18, 8, 1], [35, 19, 10, 1], [34, 20, 12, 2],
  [34, 22, 12, 2], [35, 24, 10, 2], [36, 26, 8, 2],
  [37, 28, 6, 2], [38, 30, 4, 2]
];
const SHIELD_RIM = [[35, 19, 1, 8], [44, 19, 1, 8], [37, 30, 6, 1]];

const DRAGON_DARK = [
  [118, 20, 8, 1], [116, 21, 12, 1], [114, 22, 15, 2],
  [113, 24, 18, 2], [112, 26, 19, 2], [113, 28, 17, 2],
  [115, 30, 13, 2], [118, 32, 8, 2], [120, 34, 6, 2],
  [130, 24, 6, 2], [134, 26, 4, 2], [136, 28, 2, 2],
  [108, 22, 4, 2], [106, 24, 4, 2], [104, 26, 4, 2],
  [103, 28, 3, 2], [102, 30, 3, 2], [121, 36, 4, 2]
];

const DRAGON_LIGHT = [
  [118, 23, 4, 1], [117, 25, 6, 1], [117, 27, 6, 1],
  [118, 29, 4, 1], [132, 25, 2, 1], [133, 27, 2, 1]
];

const DRAGON_EYE = [[126, 23, 1, 1], [127, 23, 1, 1]];
const DRAGON_HORN = [[121, 19, 2, 1], [124, 18, 2, 1], [127, 19, 2, 1]];

const FIRE_RED = [
  [95, 24, 8, 2], [88, 25, 7, 2], [81, 26, 7, 2], [74, 27, 7, 2],
  [67, 28, 7, 2], [60, 29, 7, 2], [54, 30, 6, 2], [50, 31, 4, 2]
];
const FIRE_ORANGE = [
  [97, 25, 6, 1], [90, 26, 5, 1], [83, 27, 5, 1], [76, 28, 5, 1],
  [69, 29, 5, 1], [63, 30, 4, 1], [57, 31, 3, 1], [53, 32, 2, 1]
];
const FIRE_YELLOW = [
  [99, 25, 2, 1], [92, 26, 2, 1], [85, 27, 2, 1], [78, 28, 2, 1],
  [71, 29, 2, 1], [65, 30, 1, 1], [59, 31, 1, 1]
];

const GROUND = [[0, 40, 160, 8], [0, 38, 160, 1], [0, 39, 160, 1]];
const GROUND_DETAIL = [[12, 39, 4, 1], [38, 39, 3, 1], [72, 39, 4, 1], [108, 39, 3, 1], [142, 39, 4, 1]];

export default function PixelBattleScene() {
  return (
    <svg
      className="quest-scene-art"
      viewBox="0 0 320 96"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pixel art scene of a knight shielding against dragon fire"
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width="320" height="96" fill="transparent" />

      <PixelRects color="#4a1f74" pixels={GROUND} />
      <PixelRects color="#6f3ba0" pixels={GROUND_DETAIL} />

      <PixelRects color="#5b2d8d" pixels={KNIGHT_STEEL} />
      <PixelRects color="#dbeafe" pixels={KNIGHT_ACCENT} />
      <PixelRects color="#facc15" pixels={KNIGHT_GOLD} />

      <PixelRects color="#6544a8" pixels={SHIELD_MAIN} />
      <PixelRects color="#f1f5f9" pixels={SHIELD_RIM} />

      <PixelRects color="#7f1d1d" pixels={FIRE_RED} />
      <PixelRects color="#f97316" pixels={FIRE_ORANGE} />
      <PixelRects color="#fde047" pixels={FIRE_YELLOW} />

      <PixelRects color="#3b0764" pixels={DRAGON_DARK} />
      <PixelRects color="#7e22ce" pixels={DRAGON_LIGHT} />
      <PixelRects color="#ef4444" pixels={DRAGON_EYE} />
      <PixelRects color="#e9d5ff" pixels={DRAGON_HORN} />
    </svg>
  );
}
