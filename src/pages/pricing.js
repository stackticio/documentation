import React from 'react';
import Layout from '@theme/Layout';
import '../css/pricing.css';

const SingleStack = () => {
  return (
    <div className="card singleStack">
      <h3 className="cardHeading">Single App</h3>
      <div className="section bubble">
        <strong>Description:</strong>  Tailored for customers aiming to migrate to Kubernetes, build or enhance Kubernetes stacks with minimal expertise.
      </div>
      <div className="section bubble">
        <strong>Features:</strong>
        <ul>
          <li>Single Stack Design and Update: Offers a one-time setup, including design and versioning for existing services.</li>
          <li>Continuous Updates: Regular updates and versioning for all stack services.</li>
          <li>Design Consulting: Includes 10 hours of free design consulting.</li>
        </ul>
      </div>
      <div className="section bubble">
        <strong>One-Time Payment:</strong> $1600 per service, with a minimum requirement of 10 services. Includes yearly updates for the first year.
      </div>
    </div>
  );
};


const MultiStack = () => {
  return (
    <div className="card multiStack">
      <h3 className="cardHeading">Multi Stack</h3>
      <div className="section bubble">
        <strong>Description:</strong> : Ideal for customers with multiple applications, ensuring state-of-the-art stacks for uniformity across all apps, catering to diverse needs
      </div>
      <div className="section bubble">
        <strong>Features:</strong>
        <ul>
          <li>Platform Access: Comprehensive access to the platform for designing, operating, & securing applications..</li>
          <li>Design Consulting: 4 days of free consulting and training to assist with design needs..</li>
          <li>Gold Support: Provides extended platform support..</li>
        </ul>
      </div>
      <div className="section bubble">
        <strong>Pricing Model (Yearly):</strong> $8800 per month for 10 stacks access and 5 users.
      </div>
    </div>
  );
};

const AppFactory = () => {
  return (
    <div className="card appFactory">
      <h3 className="cardHeading">App Factory</h3>
      <div className="section bubble">
        <strong>Description:</strong> Ideal for large enterprises aiming for frequent releases & numerous stacks, this offering focuses on standardizing development & operations, enhancing release times and security. It caters to organizations seeking independent customization of their UI and services.
      </div>
      <div className="section bubble">
        <strong>Features:</strong>
        <ul>
          <li>Self-Service Feature: Custom templating for personalized stack management.</li>
          <li>stacks & users: unlimited stack and users.</li>
          <li>Custom Services: Includes 4 customized services tailored to your specific needs.</li>
          <li>Premium Services: Offers additional assistance with self-service , templating and customization.</li>
          <li>Isolation: On Prem installation or dedicated SAAS env</li>
        </ul>
      </div>
       <div className="section bubble">
        <strong>Pricing Model (Yearly):</strong> Yearly plan with unlimited stacks and users. Contact for a quote.
      </div>
    </div>
  );
};

const PricingPage = () => {
  return (
    <Layout title="Pricing">
      <div className="pricingContainer">
        <div className="cardContainer">
          <SingleStack />
          <MultiStack />
          <AppFactory />
        </div>
        <CustomizationProcessPricing />
      </div>
    </Layout>
  );
};

const CustomizationProcessPricing = () => {
  return (
    <div className="customizationProcessPricing">
      <div className="section bubble">
        <h3 className="cardHeading">Customization Process and Pricing</h3>
        <p>While we strive to support a wide range of services out-of-the-box (OOTB), the diversity and complexity of these resources mean that we cannot cover everything immediately.</p>
        <p><strong>Effort in Adding New Services:</strong> Each new service we integrate into our platform undergoes a thorough process:</p>
        <ul>
          <li>Research and Analysis: We meticulously research each service to ensure it aligns with our standards of security, Day 2 operations, and API connectivity.</li>
          <li>Templating and Integration: The service is then templated and integrated into our platform, aligning with our architecture.</li>
          <li>Version Maintenance: We incorporate the service into our version maintenance process, ensuring it functions seamlessly within the stack upon each release.</li>
        </ul>
        <p>This process essentially handles the DevOps and versioning aspects on your behalf, allowing you to simply merge new versions with ease.</p>
        <p><strong>Service Addition:</strong> For the addition of a new service, we charge between $1,500 to $2,300, depending on the complexity, community support, and requirements of the service.</p>
        <p><strong>Connectors and Additional Properties:</strong> For connectors and additional property integrations, the charge is $500.</p>
        <p>These fees reflect the extensive effort and resources involved in maintaining the high standards of our platform while expanding its capabilities to meet your specific needs.</p>
      </div>
    </div>
  );
};





export default PricingPage;
