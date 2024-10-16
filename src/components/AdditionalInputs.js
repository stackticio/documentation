import React, { useState } from 'react';

const InfoTooltip = ({ message }) => {
  // State to manage tooltip visibility
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility state
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <span className="info-tooltip" onClick={toggleVisibility} style={{ cursor: 'pointer', position: 'relative' }}>
      ⓘ
      {isVisible && (
        <span className="tooltip-content" style={{
          position: 'absolute',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          bottom: '100%', // Adjusts the vertical position relative to the trigger element
          left: '50%',
          transform: 'translateX(-50%) translateY(-10px)', // Centers the tooltip and adjusts vertical gap
          zIndex: 1000,
          width: '250px', // Increase width to make the tooltip "fatter"
          maxWidth: '250px', // Ensure the tooltip does not exceed this width
          textAlign: 'center',
          whiteSpace: 'normal',
          wordWrap: 'break-word'
        }}>
          {message}
        </span>
      )}
    </span>
  );
};

// Modify AdditionalInputs to accept inputs and setInputs as props
const AdditionalInputs = ({ inputs, setInputs }) => {
  // Update handleChange to use setInputs from props
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: parseFloat(value) || 0 // Ensure numerical values are correctly parsed
    }));
  };

  return (
    <div>
      <h2>Additional Input</h2>

      {/* Time to Market Section */}
      <div className="section-header-calc">Time to Market</div>
      <div className="form-group-calc">
        {/* Update input fields to use inputs prop for value */}
        <div className="input-box-calc">
          <label>Number of New Applications <InfoTooltip message="Total new applications planned to be developed and deployed." /></label>
          <input type="number" name="numberOfNewApplications" value={inputs.numberOfNewApplications} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>Number of Existing Applications <InfoTooltip message="Total existing applications to be maintained or migrated." /></label>
          <input type="number" name="numberOfExistingApplications" value={inputs.numberOfExistingApplications} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>Estimated Time to Market <InfoTooltip message="The average time to market, from design to deployment for launching a new application, can be more accurately defined as the total number of days expected to complete this process." /></label>
          <input type="number" name="estimatedTimeToMarket" value={inputs.estimatedTimeToMarket} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>Revenue Lost Per Day <InfoTooltip message="Estimated revenue loss per day for each day a new application is delayed." /></label>
          <input type="number" name="revenueLostPerDay" value={inputs.revenueLostPerDay} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>cost to Migrate Your Code to Stacktic <InfoTooltip message="Total cost required to migrate an existing application's codebase to Stacktic. " /></label>
          <input type="number" name="costToMigrate" value={inputs.costToMigrate} onChange={handleChange} className="input-calc small-input-calc" />
        </div>
      </div>

      {/* Quality and Reliability Improvements Section */}
      <div className="section-header-calc">Revenue improvements in quality and reliability are calculated by percentage.</div>
      <div className="form-group-calc">
        <div className="input-box-calc">
          <label>Revenue Increase from New Features/Applications <InfoTooltip message="Expected percentage increase in revenue from launching new features , applications or cloud. for example: moving from managed-service to K8s might increase revenue in..." /></label>
          <input type="number" name="revenueIncreasePercentage" value={inputs.revenueIncreasePercentage} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>Developer/Productivity Efficiency Gains <InfoTooltip message="Expected percentage increase in developer productivity or efficiency gains is attributed to the simplicity & unified approach, which enhances knowledge sharing, team collaboration, & reduces the time to start coding.." /></label>
          <input type="number" name="productivityEfficiencyGainsPercentage" value={inputs.productivityEfficiencyGainsPercentage} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>Error Rate Reduction <InfoTooltip message="Expected percentage increase in reduction in error rates or incidents due to automation and validation mechanism being imporved." /></label>
          <input type="number" name="errorRateReductionPercentage" value={inputs.errorRateReductionPercentage} onChange={handleChange} className="input-calc small-input-calc" />
        </div>

        <div className="input-box-calc">
          <label>Compliance and Governance Efficiency and Risk Mitigation Value  <InfoTooltip message="Expected percentage increase in Improvement in compliance and governance efficiency, and reduction in risk, represented as a percentage." /></label>
          <input type="number" name="complianceEfficiencyPercentage" value={inputs.complianceEfficiencyPercentage} onChange={handleChange} className="input-calc small-input-calc" />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInputs;
