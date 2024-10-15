import React from 'react';
import TaskList from './TaskList';
import Chat from './Chat';

function Dashboard() {
  return (
    <div>
      <h1>Project Dashboard</h1>
      <TaskList />
      <Chat />
    </div>
  );
}

export default Dashboard;
