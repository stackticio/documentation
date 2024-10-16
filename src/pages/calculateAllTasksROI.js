// src/pages/calculateAllTasksROI.js
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import TaskRow from '../components/TaskRow';
import AdditionalInputs from '../components/AdditionalInputs';
import Results from '../components/Results';
import '../css/ROICalculator.css';
import '../css/Results.css';
import initialTasks from '../components/tasks'; // Correct import path for tasks

const CalculateAllTasksROI = () => {
  const [tasks, setTasks] = useState(initialTasks); // Use imported tasks

  const handleDeleteTask = (id) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
  };

  const [additionalInputs, setAdditionalInputs] = useState({
    numberOfNewApplications: 2,
    numberOfExistingApplications: 2,
    estimatedTimeToMarket: 100,
    revenueLostPerDay: 1000,
    costToMigrate: 0,
    revenueIncreasePercentage: 10,
    productivityEfficiencyGainsPercentage: 10,
    errorRateReductionPercentage: 10,
    complianceEfficiencyPercentage: 10,
  });

  const [results, setResults] = useState({
    totalDay01Initial: 0,
    totalDay2Operations: 0,
    costOfTaskTotalNewApps: 0,
    costOfTaskTotalExistingApps: 0,
    amountInvestedBeforeStacktic: 0,
    amountInvestedAfterStacktic: 0,
    totalEstimatedRevenue: 0,
    totalDay01InitialWithStacktic: 0,
    totalDay2OperationsWithStacktic: 0,
    costOfTaskTotalNewAppsWithStacktic: 0,
    costOfTaskTotalExistingAppsWithStacktic: 0,
    totalRevenueIncrease: 0,
    totalRevenueWithStacktic: 0,
  });

  const handleUpdateTask = (id, updatedTask) => {
    const updatedTasks = tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task);
    setTasks(updatedTasks);
  };

  const addTask = () => {
    const newTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = {
      id: newTaskId,
      team: '',
      phase: '',
      process: '',
      description: '',
      numberOfServices: 1,
      numberOfHours: 1,
      salaryPerHour: 20,
      staticSupport: 100,
      total: 0,
      totalCostAfterStatic: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const calculateResults = () => {
    const {
      numberOfNewApplications,
      numberOfExistingApplications,
      estimatedTimeToMarket,
      revenueLostPerDay,
      revenueIncreasePercentage,
      productivityEfficiencyGainsPercentage,
      errorRateReductionPercentage,
      complianceEfficiencyPercentage,
      costToMigrate
    } = additionalInputs;

    const numNewApps = Number(numberOfNewApplications);
    const numExistingApps = Number(numberOfExistingApplications);
    const timeToMarketDays = Number(estimatedTimeToMarket);
    const dailyRevenueLoss = Number(revenueLostPerDay);

    // Calculate initial and day 2 costs
    let totalDay01Initial = 0;
    let totalDay2Operations = 0;

    tasks.forEach(task => {
      const totalCost = task.numberOfServices * task.numberOfHours * task.salaryPerHour;
      if (task.phase === 'day2') {
        totalDay2Operations += totalCost;
      } else {
        totalDay01Initial += totalCost;
      }
    });

    // Calculate cost with Stacktic based on the actual staticSupport values
    const totalDay01InitialWithStacktic = tasks.filter(task => task.phase !== 'day2').reduce((total, task) => total + task.numberOfServices * task.numberOfHours * task.salaryPerHour * ((100 - task.staticSupport) / 100), 0);
    const totalDay2OperationsWithStacktic = tasks.filter(task => task.phase === 'day2').reduce((total, task) => total + task.numberOfServices * task.numberOfHours * task.salaryPerHour * ((100 - task.staticSupport) / 100), 0);

    const costOfTaskTotalNewApps = totalDay01Initial * numNewApps + timeToMarketDays * dailyRevenueLoss * numNewApps;
    const costOfTaskTotalNewAppsWithStacktic = totalDay01InitialWithStacktic * numNewApps;

    const costOfTaskTotalExistingApps = totalDay2Operations * numExistingApps + totalDay01Initial * numNewApps + costToMigrate * numExistingApps;
    const costOfTaskTotalExistingAppsWithStacktic = totalDay2OperationsWithStacktic * numExistingApps + totalDay01InitialWithStacktic * numNewApps + costToMigrate * numExistingApps;

    const amountInvestedBeforeStacktic = costOfTaskTotalNewApps + costOfTaskTotalExistingApps;
    const amountInvestedAfterStacktic = costOfTaskTotalNewAppsWithStacktic + costOfTaskTotalExistingAppsWithStacktic;

    const totalRevenuePerYear = (numNewApps + numExistingApps) * dailyRevenueLoss * 365;
    const totalEstimatedRevenue = totalRevenuePerYear * (1 + (revenueIncreasePercentage + productivityEfficiencyGainsPercentage + errorRateReductionPercentage + complianceEfficiencyPercentage) / 100);

    const totalRevenueIncrease = totalRevenuePerYear * (revenueIncreasePercentage + productivityEfficiencyGainsPercentage + errorRateReductionPercentage + complianceEfficiencyPercentage) / 100;
    const totalRevenueWithStacktic = totalRevenuePerYear + totalRevenueIncrease;

    setResults({
      totalDay01Initial,
      totalDay2Operations,
      costOfTaskTotalNewApps,
      costOfTaskTotalExistingApps,
      amountInvestedBeforeStacktic,
      amountInvestedAfterStacktic,
      totalEstimatedRevenue,
      totalDay01InitialWithStacktic,
      totalDay2OperationsWithStacktic,
      costOfTaskTotalNewAppsWithStacktic,
      costOfTaskTotalExistingAppsWithStacktic,
      totalRevenueIncrease,
      totalRevenueWithStacktic,
    });
  };

  return (
    <Layout title="ROI Calculator">
      <div className="container-calc">
        <h1>ROI Calculator</h1>

        <div className="instructions-container-calc">
          <p>Welcome to the ROI Calculator. This tool is designed to help you estimate the return on investment for various tasks and processes. Follow these steps:</p>
          <ol>
            <li><strong>Add Tasks:</strong> Input details for each task, including team, phase, and costs. The cost of each task is calculated as <em>Number of Services x Number of Hours x Salary per Hour</em>. Phases impact costs as follows:
              <ul>
                <li><em>Day0-1 (One-Time Fee):</em> Costs for setup or development, considered as one-time investments.</li>
                <li><em>Day2 (Yearly Fee):</em> Ongoing, annual expenses for application maintenance and operation.</li>
              </ul>
            </li>
            <li><strong>Adjust Additional Inputs:</strong> Specify parameters like the number of applications, time to market, and revenue lost per day. These influence the overall ROI calculation.</li>
            <li><strong>Calculate Results:</strong> Click 'Calculate Results' to view a detailed ROI breakdown, including initial setup costs, operating costs, and estimated revenue improvements.</li>
          </ol>
          <p>Hover over the info icons next to each input field for detailed explanations and guidance on what to enter.</p>
        </div>

        <table className="table-calc">
          <thead>
            <tr>
              <th>Team</th>
              <th>Phase</th>
              <th>Process</th>
              <th>Description</th>
              <th>Number of Services</th>
              <th>Number of Hours</th>
              <th>Salary per Hour</th>
              <th>Total</th>
              <th>Static Support (%)</th>
              <th>Total-Cost-After-Static</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <TaskRow key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
            ))}
          </tbody>
        </table>
        <button className="button-calc" onClick={addTask}>Add Task</button>
        <AdditionalInputs inputs={additionalInputs} setInputs={setAdditionalInputs} />
        <button className="button-calc" onClick={calculateResults}>Calculate Results</button>
        <Results results={results} />
      </div>
    </Layout>
  );
};

export default CalculateAllTasksROI;
