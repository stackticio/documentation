import React from 'react';

// The Kanso mark, from the product's one-pager: an unclosed ensō, an abstract K,
// and a vermilion dot. Drawn on load unless the reader prefers reduced motion.
export function KansoMark() {
  return (
    <div className="k-brand" aria-hidden="true">
      <svg className="k-mark" viewBox="0 0 512 512">
        <path className="ring ring-a" d="M384 108 C349 75,304 56,256 56 C151 56,66 141,66 246 C66 328,119 398,193 423" strokeWidth="26" />
        <path className="ring ring-b" d="M208 424 C224 428,240 430,256 430 C352 430,430 352,430 256 C430 234,426 213,419 194" strokeWidth="10" opacity=".85" />
        <path className="letter" d="M208 160V366" strokeWidth="22" />
        <path className="letter" d="M208 274L292 192" strokeWidth="22" />
        <path className="letter" d="M208 274L304 366" strokeWidth="22" />
        <circle className="dot" cx="336" cy="172" r="34" />
      </svg>
      <div className="k-wordmark">kanso</div>
    </div>
  );
}

export function KHero({kicker, title, children, mark = true}) {
  return (
    <section className="k-hero">
      <div>
        {kicker && <div className="k-kicker"><b>簡 素</b>  ·  {kicker}</div>}
        {title && <div className="k-title">{title}</div>}
        {children && <div className="k-lede">{children}</div>}
      </div>
      {mark && <KansoMark />}
    </section>
  );
}

export function Chips({children}) {
  return <div className="k-chips">{children}</div>;
}

// kind: live (shipped), fly (in flight), designed
export function Chip({kind, children}) {
  return <span className={kind ? `k-chip ${kind}` : 'k-chip'}>{children}</span>;
}

export function Thesis({seal = '簡', color, children}) {
  const style = color ? {'--k-seal': `var(--k-${color})`} : undefined;
  return (
    <div className="k-thesis" style={style}>
      <span className="k-hanko">{seal}</span>
      <div>{children}</div>
    </div>
  );
}

// A page-level status line: what ships today and what is in flight.
export function Status({kind = 'fly', children}) {
  return <div className={`k-status ${kind}`}>{children}</div>;
}
