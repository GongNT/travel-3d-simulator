// Decorative flat-illustration SVGs for the ocean/forest/sun theme - hand-drawn
// shapes, not photos, so there's nothing to license.

export function MountainSilhouette() {
  return (
    <svg
      className="decor-mountains"
      viewBox="0 0 900 220"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,220 L110,70 L200,150 L300,40 L430,180 L520,90 L640,220 Z"
        fill="var(--forest-deep)"
        opacity="0.35"
      />
      <path
        d="M260,220 L360,110 L460,220 Z M520,220 L660,60 L820,220 Z M700,220 L780,140 L900,220 Z"
        fill="var(--forest-deep)"
        opacity="0.55"
      />
    </svg>
  )
}

export function PalmSilhouette({ side = 'left' }) {
  return (
    <svg
      className={`decor-palm decor-palm--${side}`}
      viewBox="0 0 160 320"
      aria-hidden="true"
    >
      <path
        d="M80,300 C74,230 78,150 92,90"
        stroke="#5b3a22"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <g fill="var(--forest)">
        <path d="M92,90 C60,70 30,75 6,60 C34,95 60,100 90,104 Z" />
        <path d="M92,90 C50,60 30,30 10,10 C48,40 78,60 96,98 Z" />
        <path d="M92,90 C90,50 80,20 80,0 C104,30 106,60 100,100 Z" />
        <path d="M92,90 C120,55 140,30 158,14 C126,42 108,64 96,98 Z" />
        <path d="M92,90 C130,78 150,80 160,68 C136,100 112,102 90,104 Z" />
      </g>
    </svg>
  )
}
