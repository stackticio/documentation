import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './landing.module.css';

const PHASES = [
  {
    kicker: 'Day 0–1',
    title: 'Design and generate',
    body:
      'Your AI writes the application. Stacktic produces everything under it — topology, isolation, access, secrets, exposure, scaling and recovery — from the graph you declared.',
    to: '/docs/day0/',
  },
  {
    kicker: 'Day 0–1',
    title: 'Validate before you trust it',
    body:
      'Every declared relationship proven layer by layer, scored security scans, and a hash-chained record so a report names the exact system state it judged.',
    to: '/docs/day2/validation',
  },
  {
    kicker: 'Day 2',
    title: 'Operate as one versioned unit',
    body:
      'Upgrades, migrations, scaling and recovery are graph changes: computable before they happen, diffable, duplicable into staging, and reversible with the whole system.',
    to: '/docs/day2/',
  },
  {
    kicker: 'Always',
    title: 'Compliance that regenerates',
    body:
      'Controls are produced from the graph and measured from the cluster. Change the system and the posture moves with it — with a signed human position on every gap.',
    to: '/docs/compliance/',
  },
];

export default function Home() {
  return (
    <Layout
      title="Graph the system. Automate everything."
      description="Stacktic turns every layer of a complex application into a connected, machine-readable graph — giving AI the context to architect, secure, deploy, operate and validate the entire system autonomously.">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.grain} />
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>Automation platform</div>
            <h1 className={styles.title}>
              Graph the system.
              <br />
              Automate everything.
            </h1>
            <p className={styles.lede}>
              Stacktic turns every layer of a complex application into a connected,
              machine-readable graph — giving AI the context to architect, secure, deploy,
              operate and validate the entire system autonomously.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} to="/docs/mcp/quickstart">
                Start with MCP
              </Link>
              <Link className={styles.secondary} to="/docs/">
                Read the documentation
              </Link>
            </div>
            <div className={styles.tags}>
              <span>Any AI</span>
              <span>Any cloud</span>
              <span>Open source</span>
              <span>All yours</span>
            </div>
          </div>
        </section>

        <section className={styles.band}>
          <div className={styles.bandInner}>
            <div className={styles.problem}>
              <div className={styles.problemHead}>The gap</div>
              <p>
                AI edits the code it was pointed at. The relations that move with that code —
                the data, the access, the policy, the evidence — were never in its context.
                Compliance cannot be improvised, security is not tuned by a prompt, and
                nothing verifies the result.
              </p>
            </div>
            <div className={styles.answer}>
              <div className={styles.answerHead}>Inside a framework</div>
              <p>
                Every relation is declared, so the configuration, the isolation and the
                controls are generated rather than remembered. The result is production-grade
                and autoscaled, and it is proven before anyone trusts it — then operated,
                changed and rolled back as one versioned unit.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.phases}>
          {PHASES.map((p) => (
            <Link key={p.title} className={styles.phase} to={p.to}>
              <span className={styles.phaseKicker}>{p.kicker}</span>
              <span className={styles.phaseTitle}>{p.title}</span>
              <span className={styles.phaseBody}>{p.body}</span>
            </Link>
          ))}
        </section>

        <section className={styles.figures}>
          <div className={styles.fig}>
            <div className={styles.figValue}>79</div>
            <div className={styles.figLabel}>component templates</div>
          </div>
          <div className={styles.fig}>
            <div className={styles.figValue}>441</div>
            <div className={styles.figLabel}>typed link types</div>
          </div>
          <div className={styles.fig}>
            <div className={styles.figValue}>63</div>
            <div className={styles.figLabel}>sub-component types</div>
          </div>
          <div className={styles.fig}>
            <div className={styles.figValue}>1</div>
            <div className={styles.figLabel}>unit of version: the stack</div>
          </div>
        </section>

        <section className={styles.closing}>
          <h2>Start where your AI client already is.</h2>
          <p>
            Six components give a model an authenticated interface to the platform, the live
            graph and the cluster. Everything after that is a conversation.
          </p>
          <Link className={styles.primary} to="/docs/mcp/quickstart">
            The MCP initiator stack
          </Link>
        </section>
      </main>
    </Layout>
  );
}
