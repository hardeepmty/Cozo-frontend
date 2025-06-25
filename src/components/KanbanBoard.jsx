// src/components/KanbanBoard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const statusColumns = [
  { id: 'to_do', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'under_review', title: 'Review' },
  { id: 'completed', title: 'Completed' }
];

export default function KanbanBoard({ projectId, onTaskUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Store current user info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch current user data
        const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
        setCurrentUser(userRes.data.data);

        // Fetch all project tasks
        const tasksRes = await axios.get(
          `http://localhost:5000/api/tasks/project/${projectId}`,
          config
        );
        setTasks(tasksRes.data.data);

        // Fetch user's tasks
        const myTasksRes = await axios.get(
          'http://localhost:5000/api/tasks/my-tasks',
          config
        );
        setUserTasks(myTasksRes.data.data.map(task => task._id));

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  // Check if task belongs to current user
  const isUserTask = (taskId) => userTasks.includes(taskId);

  // Check if task can be dragged
  const canDragTask = (task) => {
    if (!currentUser) return false;
    
    return (
      isUserTask(task._id) || // User's personal task
      (task.assignedTeam && currentUser.teams?.includes(task.assignedTeam._id)) || // User is in assigned team
      currentUser.role === 'admin' // User is admin
    );
  };

  const handleDragStart = (e, task) => {
    if (canDragTask(task)) {
      e.dataTransfer.setData('taskId', task._id);
    } else {
      e.preventDefault(); // Prevent dragging if not authorized
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    try {
      // Optimistic UI update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      await onTaskUpdate(taskId, newStatus);
    } catch (err) {
      setError('Failed to update task status');
      setTasks(tasks); // Revert on error
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div style={{ color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${statusColumns.length}, 1fr)`,
      gap: '1rem',
      minHeight: '500px'
    }}>
      {statusColumns.map(column => (
        <div 
          key={column.id}
          style={{
            backgroundColor: 'var(--gray)',
            borderRadius: '8px',
            padding: '1rem',
            minHeight: '200px'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h3 style={{ 
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--dark)'
          }}>
            {column.title}
            <span style={{
              marginLeft: '0.5rem',
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '0.1rem 0.5rem',
              fontSize: '0.8rem'
            }}>
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </h3>
          <div>
            {tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <div
                  key={task._id}
                  draggable={canDragTask(task)}
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{
                    backgroundColor: isUserTask(task._id) ? '#f0fdf4' : 'white',
                    border: isUserTask(task._id) ? '2px solid #4ade80' : '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: canDragTask(task) ? 'grab' : 'default',
                    position: 'relative'
                  }}
                >
                  {isUserTask(task._id) && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#4ade80',
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}>
                      ✓
                    </div>
                  )}
                  <h4 style={{ marginBottom: '0.5rem' }}>{task.title}</h4>
                  <p style={{ 
                    fontSize: '0.875rem',
                    color: 'var(--dark)',
                    opacity: 0.7,
                    marginBottom: '0.5rem'
                  }}>
                    {task.description.substring(0, 50)}...
                  </p>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem'
                  }}>
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</span>
                    <span style={{
                      backgroundColor: 
                        task.priority === 'high' ? 'var(--danger)' : 
                        task.priority === 'medium' ? 'orange' : 'gray',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}