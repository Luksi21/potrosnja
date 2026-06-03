/** Stylized bottle silhouette tinted via `currentColor`. Decorative only. */
export function BottleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g fill="currentColor">
        <rect x="21" y="5" width="6" height="8" rx="1.5" />
        <path d="M18 15.5c0-1.1.6-2.1 1.6-2.6l.4-.2h8l.4.2c1 .5 1.6 1.5 1.6 2.6v2.7c0 1 .4 2 1.2 2.7l1.4 1.2c1.5 1.3 2.4 3.2 2.4 5.2V40a3 3 0 0 1-3 3H15.5a3 3 0 0 1-3-3V27c0-2 .9-3.9 2.4-5.2l1.4-1.2c.8-.7 1.3-1.7 1.3-2.7v-2.4Z" />
      </g>
      <rect x="13.5" y="30" width="21" height="10.5" rx="1.5" fill="#ffffff" opacity="0.2" />
    </svg>
  );
}
