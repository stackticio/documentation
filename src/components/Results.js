import React from 'react';
import '../css/Results.css'; // Assuming you have a CSS file for custom styles

const Results = ({ results }) => {
  const numberStyle = {
    color: '#4CAF50', // Green color for numbers
    fontWeight: 'bold',
    fontSize: '1.2em', // Larger font size for emphasis
  };

  const stackticStyle = {
    color: '#FF5733', // Different color for Stacktic numbers
    fontWeight: 'bold',
    fontSize: '1.2em', // Larger font size for emphasis
  };

  const calculateSavingsPercentage = (original, withStacktic) => {
    return ((original - withStacktic) / original) * 100;
  };

  return (
    <div className="results-container">
      <h2>Results</h2>
      <div className="results-frame">
        <p><strong>Single app: day0-1:</strong> <span style={numberStyle}>${results.totalDay01Initial?.toFixed(2)}</span></p>
        <p className="calculation-details">Calculation: Sum of (Number of Services x Number of Hours x Salary per Hour) for all tasks in the "Day 0-1" phase.</p>
        <p><strong>Cost with Stacktic:</strong> <span style={stackticStyle}>${results.totalDay01InitialWithStacktic?.toFixed(2)}</span></p>
        <p><strong>Savings:</strong> <span style={stackticStyle}>{calculateSavingsPercentage(results.totalDay01Initial, results.totalDay01InitialWithStacktic)?.toFixed(2)}%</span></p>
      </div>
      <div className="results-frame">
        <p><strong>Single app: day2:</strong> <span style={numberStyle}>${results.totalDay2Operations?.toFixed(2)}</span></p>
        <p className="calculation-details">Calculation: Sum of (Number of Services x Number of Hours x Salary per Hour) for all tasks in the "Day 2" phase.</p>
        <p><strong>Cost with Stacktic:</strong> <span style={stackticStyle}>${results.totalDay2OperationsWithStacktic?.toFixed(2)}</span></p>
        <p><strong>Savings:</strong> <span style={stackticStyle}>{calculateSavingsPercentage(results.totalDay2Operations, results.totalDay2OperationsWithStacktic)?.toFixed(2)}%</span></p>
      </div>
      <div className="results-frame">
        <p><strong>All apps total day0-1:</strong> <span style={numberStyle}>${results.costOfTaskTotalNewApps?.toFixed(2)}</span></p>
        <p className="calculation-details">Calculation: "Total Initial Setup Cost for Day 0-1 for single App" x number of new apps + (Time to Market Days x Daily Revenue Loss x Number of New Applications)</p>
        <p><strong>Cost with Stacktic:</strong> <span style={stackticStyle}>${results.costOfTaskTotalNewAppsWithStacktic?.toFixed(2)}</span></p>
        <p><strong>Savings:</strong> <span style={stackticStyle}>{calculateSavingsPercentage(results.costOfTaskTotalNewApps, results.costOfTaskTotalNewAppsWithStacktic)?.toFixed(2)}%</span></p>
      </div>
      <div className="results-frame">
        <p><strong>All apps total day2:</strong> <span style={numberStyle}>${results.costOfTaskTotalExistingApps?.toFixed(2)}</span></p>
        <p className="calculation-details">Calculation: "Total Day 2 Operations Cost for single App" x number of existing apps + "cost to Migrate Your Code to Stacktic" + "Total cost of initial setup day0-1 for all new applications"</p>
        <p><strong>Cost with Stacktic:</strong> <span style={stackticStyle}>${results.costOfTaskTotalExistingAppsWithStacktic?.toFixed(2)}</span></p>
        <p><strong>Savings:</strong> <span style={stackticStyle}>{calculateSavingsPercentage(results.costOfTaskTotalExistingApps, results.costOfTaskTotalExistingAppsWithStacktic)?.toFixed(2)}%</span></p>
      </div>
      <div className="results-frame">
        <p><strong>Total Cost:</strong> <span style={numberStyle}>${results.amountInvestedBeforeStacktic?.toFixed(2)}</span></p>
        <p className="calculation-details">Calculation: Total Initial Setup Cost + Total Day 2 Operations Cost</p>
        <p><strong>Total cost with Stacktic:</strong> <span style={stackticStyle}>${results.amountInvestedAfterStacktic?.toFixed(2)}</span></p>
        <p><strong>Savings:</strong> <span style={stackticStyle}>{calculateSavingsPercentage(results.amountInvestedBeforeStacktic, results.amountInvestedAfterStacktic)?.toFixed(2)}%</span></p>
      </div>
      <div className="results-frame">
        <p><strong>Total Estimated Revenue yearly:</strong> <span style={numberStyle}>${results.totalEstimatedRevenue?.toFixed(2)}</span></p>
        <p className="calculation-details">Calculation: Total Annual Revenue x (Revenue Increase Percentage + Productivity Efficiency Gains Percentage + Error Rate Reduction Percentage + Compliance Efficiency Percentage).</p>
        <p><strong>Revenue with Stacktic:</strong> <span style={stackticStyle}>${results.totalRevenueWithStacktic?.toFixed(2)}</span></p>
        <p><strong>Increase:</strong> <span style={stackticStyle}>${results.totalRevenueIncrease?.toFixed(2)} ({(results.totalRevenueIncrease / results.totalEstimatedRevenue * 100).toFixed(2)}%)</span></p>
      </div>
    </div>
  );
};

 
const calculateResults = (additionalInputs, tasks, setResults) => {
  const {
    numberOfNewApplications,
    numberOfExistingApplications,
    estimatedTimeToMarket,
    revenueLostPerDay,
    costToMigrate,
    revenueIncreasePercentage,
    productivityEfficiencyGainsPercentage,
    errorRateReductionPercentage,
    complianceEfficiencyPercentage,
  } = additionalInputs;

  const numNewApps = Number(numberOfNewApplications);
  const numExistingApps = Number(numberOfExistingApplications);
  const timeToMarketDays = Number(estimatedTimeToMarket);
  const dailyRevenueLoss = Number(revenueLostPerDay);
  const migrationCostPerApp = Number(costToMigrate);

  const adjustCostForStaticSupport = (task) => {
    const baseCost = task.numberOfServices * task.numberOfHours * task.salaryPerHour;
    return baseCost * ((100 - task.staticSupport) / 100);
  };

  const day01Tasks = tasks.filter(task => task.phase === 'day0' || task.phase === 'day1');
  const day2Tasks = tasks.filter(task => task.phase === 'day2');

  const totalCostDay01ForSingleApp = day01Tasks.reduce((total, task) => total + adjustCostForStaticSupport(task), 0);
  const totalCostDay2ForSingleApp = day2Tasks.reduce((total, task) => total + adjustCostForStaticSupport(task), 0);

  const totalCostDay01NewApps = totalCostDay01ForSingleApp * numNewApps;
  const totalRevenueLossNewApps = timeToMarketDays * dailyRevenueLoss * numNewApps;
  const totalCostDay2ExistingApps = totalCostDay2ForSingleApp * numExistingApps;
  const totalMigrationCost = migrationCostPerApp * numExistingApps;

  const totalCostDay0NewApps = totalCostDay01NewApps + totalRevenueLossNewApps;
  const totalCostDay2AllApps = totalCostDay2ForSingleApp * (numNewApps + numExistingApps) + totalMigrationCost;

  const totalCostAllApps = totalCostDay0NewApps + totalCostDay2AllApps;

  const totalCostAfterStaticAllTasks = tasks.reduce((total, task) => {
    const costAfterSupport = task.numberOfServices * task.numberOfHours * task.salaryPerHour * (1 - task.staticSupport / 100);
    return total + costAfterSupport;
  }, 0);

  const amountInvestedAfterStacktic = totalCostAfterStaticAllTasks * (numNewApps + numExistingApps) + totalMigrationCost;

  const totalRevenuePerYear = (numNewApps + numExistingApps) * dailyRevenueLoss * 365;
  const totalEstimatedRevenueImprovement =
    totalRevenuePerYear * (revenueIncreasePercentage / 100) +
    totalRevenuePerYear * (productivityEfficiencyGainsPercentage / 100) +
    totalRevenuePerYear * (errorRateReductionPercentage / 100) +
    totalRevenuePerYear * (complianceEfficiencyPercentage / 100);

  const totalDay01InitialWithStacktic = totalCostDay01ForSingleApp * 0.05; // Assuming 95% reduction
  const totalDay2OperationsWithStacktic = totalCostDay2ForSingleApp * 0.05; // Assuming 95% reduction
  const costOfTaskTotalNewAppsWithStacktic = totalCostDay0NewApps * 0.05; // Assuming 95% reduction
  const costOfTaskTotalExistingAppsWithStacktic = totalCostDay2AllApps * 0.05; // Assuming 95% reduction

  const totalRevenueIncrease = totalRevenuePerYear * 0.1; // Assuming 10% increase
  const totalRevenueWithStacktic = totalRevenuePerYear + totalRevenueIncrease;

  setResults({
    totalDay01Initial: totalCostDay01ForSingleApp,
    totalDay2Operations: totalCostDay2ForSingleApp,
    costOfTaskTotalNewApps: totalCostDay0NewApps,
    costOfTaskTotalExistingApps: totalCostDay2AllApps,
    amountInvestedBeforeStacktic: totalCostAllApps,
    amountInvestedAfterStacktic,
    totalEstimatedRevenue: totalEstimatedRevenueImprovement,
    totalDay01InitialWithStacktic,
    totalDay2OperationsWithStacktic,
    costOfTaskTotalNewAppsWithStacktic,
    costOfTaskTotalExistingAppsWithStacktic,
    totalRevenueIncrease,
    totalRevenueWithStacktic,
  });
};

export { calculateResults };
export default Results;
