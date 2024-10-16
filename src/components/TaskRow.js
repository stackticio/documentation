import React from 'react';

const TaskRow = ({ task, onUpdate, onDelete }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Convert numerical fields to numbers where necessary
    if (['numberOfServices', 'numberOfHours', 'salaryPerHour', 'staticSupport'].includes(name)) {
      updatedValue = name === 'staticSupport' ? parseInt(value, 10) : parseFloat(value);
    }

    // Update task with new value for the changed field without automatically recalculating totals
    const updatedTask = { ...task, [name]: updatedValue };

    // Only calculate totals if one of the fields affecting totals has changed
    if (['numberOfServices', 'numberOfHours', 'salaryPerHour', 'staticSupport'].includes(name)) {
      const total = updatedTask.numberOfServices * updatedTask.numberOfHours * updatedTask.salaryPerHour;
      const totalCostAfterStatic = total * (1 - updatedTask.staticSupport / 100);
      // Update the task with new totals
      updatedTask.total = total;
      updatedTask.totalCostAfterStatic = totalCostAfterStatic;
    }

    // Call onUpdate to update the task in the parent component
    onUpdate(task.id, updatedTask);
  };

  return (
    <tr style={{ backgroundColor: task.phase === 'day2' ? 'lightgreen' : '' }}>
      <td><input type="text" name="team" value={task.team} onChange={handleChange} className="task-input-calc" /></td>
      <td>
        <select name="phase" value={task.phase} onChange={handleChange} className="task-select-calc">
          <option value="day0">day0</option>
          <option value="day1">day1</option>
          <option value="day2">day2</option>
        </select>
      </td>
      <td><input type="text" name="process" value={task.process} onChange={handleChange} className="task-input-calc" /></td>
      <td><input type="text" name="description" value={task.description} onChange={handleChange} className="task-input-calc" /></td>
      <td><input type="number" name="numberOfServices" value={task.numberOfServices} onChange={handleChange} className="task-input-calc" /></td>
      <td><input type="number" name="numberOfHours" value={task.numberOfHours} onChange={handleChange} className="task-input-calc" /></td>
      <td><input type="number" name="salaryPerHour" value={task.salaryPerHour} onChange={handleChange} className="task-input-calc" /></td>
      {/* Display the calculated total and totalCostAfterStatic */}
      <td>{task.total?.toFixed(2)}</td>
      <td><input type="number" name="staticSupport" value={task.staticSupport} onChange={handleChange} className="task-input-calc" /></td>
      <td>{task.totalCostAfterStatic?.toFixed(2)}</td>
      <td><button onClick={() => onDelete(task.id)} className="delete-button-calc">X</button></td>
    </tr>
  );
};

export default TaskRow;
