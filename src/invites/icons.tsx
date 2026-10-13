// Small hand-drawn icon set (24px grid, 2px stroke) so invite pages don't pull an icon library.
const P: Record<string, string> = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  message: 'M4 5h16v11H9l-5 4z',
  mail: 'M3 6h18v12H3z M3 7l9 6 9-6',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  share: 'M12 3v12 M7 8l5-5 5 5 M5 13v7h14v-7',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
  map: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z M12 12.2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  plus: 'M12 5v14 M5 12h14',
  trash: 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13',
  edit: 'M4 20h4L19 9l-4-4L4 16z M13 7l4 4',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  download: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 21h4',
  qr: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h2v2h-2z M18 18h2v2h-2z M14 18h2 M18 14h2',
  photo: 'M3 6h18v13H3z M3 16l5-5 4 4 3-3 6 6 M15.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  heart: 'M12 20s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.1-8 11-8 11z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
};

export type IconName = keyof typeof P;

export function Icon({ name, className, title }: { name: IconName; className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <path d={P[name]} />
    </svg>
  );
}

/** Kenji Invites mark: two interlocking rings. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="12.5" cy="17" r="7.5" stroke="#6e2638" strokeWidth="2.2" />
      <circle cx="19.5" cy="17" r="7.5" stroke="#b08a3e" strokeWidth="2.2" />
      <path d="M19.5 7.2l1.6-2.4h-3.2z" fill="#b08a3e" />
    </svg>
  );
}
