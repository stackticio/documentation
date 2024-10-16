// src/pages/index.js
import React from 'react';
import Layout from '@theme/Layout';

function Home() {
  return (
    <Layout title="Home">
      <div className="bg-blue-800 p-16">
        <h1 className="text-high-contrast text-center common-text-style">
          Shift your strategy to a full-stack automation with complete openness to define your path to innovation.
        </h1>

        <img
          src="/img/UI-Diagram.png"
          alt="UI Diagram"
          className="non-overlapping-image"
        />

        <p className="text-high-contrast text-center common-text-style">
          Effortlessly craft a cutting-edge, production-ready stack with a simple drag-and-drop interface.
        </p>

        <p className="text-high-contrast text-center common-text-style">
          Stacktic is an application stack generator platform that automates APIs, security, and Day 2 operations, & much more, utilizing metadata to seamlessly integrate with CNCF-managed solutions. The result is a sophisticated, full-stack production-ready repository. You design, we process, validate build and push.
        </p>
      </div>
    </Layout>
  );
}

export default Home;
