import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/sidebar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const EditTaskForm = ({ taskid }) => {
  const [task, setTask] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [deadline, setDeadline] = useState();
  const [priority, setPriority] = useState();
  
  const [state, setState] = useState();
  const navigate = useNavigate()
  const { id } = useParams();

  useEffect(() => {
    getTask();
  }, []);
  const getTask = async () => {
    const session_id = localStorage.getItem("session_id")
    
    const {data: response} = await axios.get(`http://127.0.0.1:5000/gettasks/${session_id}/${id}`,  
     { withCredentials: true });
     setTask(response);
     setTitle(response[0].title)
     setDescription(response[0].description)
     setDeadline(response[0].deadline)
     setState(response[0].state)
    
   };
    

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const session_id = localStorage.getItem("session_id")
    
    // Create the updated task object
    const updatedTask = {
     // ...task,
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      state: state
    };

    axios.put(`http://127.0.0.1:5000/updatetask/${session_id}/${id}`, 
    updatedTask,
          { withCredentials: true })
          .then((response)=>{
            if (response.status === 200){
                navigate("/homepage")
            }
          });
    // Perform your logic to update the task object in the database
    // For example, you can make an API request to update the task
    // getTask()
    
  };

  return (
    
    <div className='edittask'>
    <Sidebar/>
    <form className='edit-form' onSubmit={handleFormSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        //placeholder={task[0].title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        value={description}
        //placeholder={task[0].description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>

      <label htmlFor="deadline">Deadline:</label>
      <input
        type="text"
        id="deadline"
        value={deadline}
        //placeholder={task[0].deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <label htmlFor="priority">Priority:</label>
      <select
        id="priority"
        value={priority}
        //placeholder={task[0].priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label htmlFor="state">State:</label>
      <select
        id="state"
        value={state}
        //placeholder={task[0].state}
        onChange={(e) => setState(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button type="submit">Update Task</button>
    </form>
    </div>
  );
}

