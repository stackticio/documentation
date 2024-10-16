import React, { useState } from 'react';
import Layout from '@theme/Layout';
import '../css/cases.css'; // Ensure this path is correct

function Cases() {
  const [activeCase, setActiveCase] = useState('day0');

  const showCase = (caseKey) => {
    setActiveCase(caseKey);
  };

  return (
    <Layout title="Cases">
      <div className="container-cases">
        <div className="button-container-cases ">
          <button onClick={() => showCase('day0')}>Development Process</button>
          <button onClick={() => showCase('day1')}>Multi teams approach</button>
          <button onClick={() => showCase('day2')}>Fully Customizable </button>
        </div>

        {activeCase === 'day0' && (
          <div className="content-container-cases">
            <div className="text-container-cases">
              <h2 className="headline-spacing-cases">Stacktic VS the "classic" Dev Process</h2>
              <p className="sub-text-far-cases"><strong>Transform Your Development Process:</strong> Our platform revolutionizes your workflow, transforming heavy complex processes into straightforward, drag-and-drop simplicity.</p>
              <p className="sub-text-far-cases"><strong>Simplify with Automation:</strong> Stacktic automates the development steps by intelligently using metadata to comprehend your APIs, CI/CD pipelines, security, & testing needs.</p>
              <p className="sub-text-far-cases"><strong>Tailored to Fit Your Needs:</strong> Acknowledging the uniqueness of your development process, Stacktic offers near end-to-end automation while ensuring our platform is built for any customization you desire.</p>
            </div>
            <div className="image-container-cases">
              <img src="/img/development.png" alt="Day 0" className="image-cases"/>
            </div>
          </div>
        )}

        {activeCase === 'day1' && (
          <div className="content-container-cases">
            <div className="text-container-cases">
              <h2 className="headline-spacing-cases">One ring to rule them all</h2>
              <p className="sub-text-far-cases"><strong>Comprehensive Collaboration and Automation:</strong> Stacktic is a holistic multi-team collaboration platform designed to facilitate automation from API definition to GitOps and security audits, supporting all stages of application development and maintenance.</p>
              <p className="sub-text-far-cases"><strong>Tailored Solutions for Team Needs:</strong> Stacktic offers specialized solutions for every team. Whether it's GitOps Ready for DevOps, Grafana dashboards and alerts for Site SREs, or other specific needs.</p>
              <p className="sub-text-far-cases"><strong>Dynamic Knowledge Sharing and Synchronization:</strong> Stacktic revolutionizes knowledge sharing by dynamically updating information based on application topology, security, and configuration. This means team members are always in sync with the latest application updates.</p>
            </div>
            <div className="image-container-cases">
              <img src="/img/multi.png" alt="Day 1" className="image-cases"/>
            </div>
          </div>
        )}

        {activeCase === 'day2' && (
          <div className="content-container-cases">
            <div className="text-container-cases">
              <h2 className="headline-spacing-cases">Build Your UI & features from the UI</h2>
              <p className="sub-text-far-cases"><strong>Open System with Full Transparency:</strong> "Our solution is 100% based on open source and fully open for customization, but we also champion a self-service mechanism that empowers users to construct their UI directly within the platform."</p>
              <p className="sub-text-far-cases"><strong>Empowering Self-Service and Customization:</strong> "Our self-service feature enables customers to leverage Stacktic's log and metadata engine independently, allowing them to craft their services, source code, properties, buttons, and links."</p>
              <p className="sub-text-far-cases"><strong>User-Friendly Interface and Extensive Templating:</strong> "Stacktic UI simplifies the creation of complex service topologies, ideal for customers needing advanced or automated compliant solutions."</p>
            </div>
            <div className="image-container-cases">
              <img src="/img/self.png" alt="Day 2" className="image-cases-3"/>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Cases;
