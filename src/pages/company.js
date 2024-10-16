import React from 'react';
import Layout from '@theme/Layout';
import '../css/company.css'; // Ensure this path is correct

function company() {
  return (
    <Layout title="company">
      <div className="container-company">
        <div className="headline-container-company headline-spacing-company ">
          <h1>Who we are?</h1>
        </div>
        <div className="bottom-text-company bottom-sub-text-company bottom-middle-text-company stacktic-description-company bottom-spacing-large-company">
          <p>We are a team of App Dev & Ops architects with extensive experience in architecting and implementing solutions on platforms designed for development and operations. Over the past few years, our focus has been primarily on cloud-native technologies, CNCF, Kubernetes, and open-source-based solutions. We have become intimately familiar with the challenges and obstacles inherent in these areas. .</p>
        </div>

        <div className="headline-container-company headline-spacing-company ">
          <h1> Our belive </h1>
        </div>
        <div className="bottom-text-company bottom-sub-text-company bottom-middle-text-company stacktic-description-company bottom-spacing-large-company">
          <p>            Our belief in the open-source approach is unwavering. We are convinced that open source drives the most significant innovation and flexibility that developers and operations teams need and desire.we admit,  we lean away from the managed-service style and the constraints of vendor lock-in. Our commitment is to openness.</p>
        </div>

        <div className="headline-container-company headline-spacing-company ">
          <h1> Our Goal</h1>
        </div>
        <div className="bottom-text-company bottom-sub-text-company bottom-middle-text-company stacktic-description-company bottom-spacing-large-company">
          <p>             We recognize the hurdles, from design and organizational structure to topology and automation. Our mission is to offer you a different approach that could be the key to making cloud-native simpler and more reliable than ever before.   That's our goal, and that's our commitment to you.</p>
        </div>

        <div className="headline-container-company headline-spacing-company ">
          <h1>Our Principles and Core Values for Our Platform Development:</h1>
          <ul className="bottom-text-company bottom-sub-text-company bottom-middle-text-company stacktic-designed-for-company bottom-spacing-large-company">
            <li><strong>Innovation with Assurance both together:</strong> Positioned at the forefront of innovation, we strive to stabilize and manage the latest open-source advancements. By implementing rigorous validation mechanisms for nearly everything, our goal is to ensure that whatever you design, submit, and deploy will function exactly as expected, every time.</li>
            <li><strong>Objective Selection::</strong>Our choice of services, especially those open-source like CNCF, is based on criteria such as community support, stability, innovation, and consistency. This objective approach ensures we integrate components that truly enhance our platform's value..</li>
            <li><strong>Generic Automation:</strong> We aim to keep our automation as generic as possible, avoiding early customization. This strategy provides a faster and more efficient pathway to achieving desired outcomes, allowing for specific customizations to be made as needed later on..</li>
            <li><strong>Openness and Flexibility:</strong>  Our foremost principle is to maintain an environment where everything is open and adaptable. We ensure the ability to swiftly make changes to our code and offer the same level of flexibility on the platform for our users. This approach fosters innovation and responsiveness to evolving needs.</li>
            <li><strong>Learning from the Field:</strong>  While we hold  opinions on how things should work, we place a higher value on the wisdom of the community and our customers, believing they guide us toward the right path. Much of our roadmap and decision-making process is, and will continue to be, shaped by customer feedback. This approach ensures that our platform evolves in alignment with the real-world needs and preferences of those we serve.</li>

          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default company;
