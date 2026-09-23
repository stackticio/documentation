import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export function Hero({eyebrow, title, children}) {
  return (
    <section className="stk-hero">
      {eyebrow && <div className="stk-eyebrow">{eyebrow}</div>}
      {title && <div className="stk-hero-title">{title}</div>}
      {children && <p>{children}</p>}
    </section>
  );
}

export function Cards({children, cols}) {
  return <div className={cols === 2 ? 'stk-grid cols-2' : 'stk-grid'}>{children}</div>;
}

export function Card({to, href, kicker, title, children}) {
  const target = to || href;
  const inner = (
    <>
      {kicker && <span className="stk-card-kicker">{kicker}</span>}
      {title && <span className="stk-card-title">{title}</span>}
      <span className="stk-card-body">{children}</span>
    </>
  );
  if (!target) return <div className="stk-card">{inner}</div>;
  return <Link className="stk-card" to={target}>{inner}</Link>;
}

export function Stats({children}) {
  return <div className="stk-stats">{children}</div>;
}

export function Stat({value, label}) {
  return (
    <div className="stk-stat">
      <div className="stk-stat-value">{value}</div>
      <div className="stk-stat-label">{label}</div>
    </div>
  );
}

export function Steps({children}) {
  return <div className="stk-steps">{children}</div>;
}

export function Step({title, children}) {
  return (
    <div className="stk-step">
      <div className="stk-step-title">{title}</div>
      <div className="stk-step-body">{children}</div>
    </div>
  );
}

export function Pills({children}) {
  return <div className="stk-pills">{children}</div>;
}

export function Pill({tone, children}) {
  const cls = tone ? `stk-pill is-${tone}` : 'stk-pill';
  return <span className={cls}>{children}</span>;
}

export function Figure({caption, children}) {
  return (
    <figure className="stk-figure">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function Split({children}) {
  return <div className="stk-split">{children}</div>;
}

export function Side({tone, head, children}) {
  const cls = tone === 'problem' ? 'is-problem' : tone === 'answer' ? 'is-answer' : '';
  return (
    <div className={cls}>
      <div className="stk-split-head">{head}</div>
      {children}
    </div>
  );
}

export function Explainer({href, title, slides, children}) {
  const url = useBaseUrl(href);
  return (
    <a className="stk-explainer" href={url} target="_blank" rel="noopener noreferrer">
      <span className="stk-explainer-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
      </span>
      <span className="stk-explainer-text">
        <span className="stk-explainer-kicker">
          Visual explainer{slides ? ` · ${slides} slides` : ''}
        </span>
        <span className="stk-explainer-title">{title}</span>
        <span className="stk-explainer-body">{children}</span>
      </span>
      <span className="stk-explainer-go" aria-hidden="true">↗</span>
    </a>
  );
}
