import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/sidebar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const AddTaskForm = ({ taskid }) => {
  const [project, setProject] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [deadline, setDeadline] = useState();
  const [priority, setPriority] = useState("low");
  const [selectedItem, setSelectedItem] = useState('');
  const [state, setState] = useState("pending");
  const navigate = useNavigate()
  const { id } = useParams();

  useEffect(() => {
    getUserProject()
  });
 
    
  const getUserProject = async () => {
    const session_id = localStorage.getItem("session_id");
    
    const {data: response} = await axios.get(`http://127.0.0.1:5000/userprojects/${session_id}`,  
     { withCredentials: true });
    // setTasks(response);
    setProject(response);
  }

  const handleSelectionChange = (event) => {
    setSelectedItem(event);
    console.log(selectedItem)
  };


  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const session_id = localStorage.getItem("session_id")
    
    
    // Create the updated task object
    const newTask = {
     // ...task,
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      state: state,
      project_id: selectedItem
    };

    console.log(deadline)
    axios.post(`http://127.0.0.1:5000/addtask/${session_id}`, 
    newTask,
    { withCredentials: true })
      .then((response)=>{
            console.log(response)
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


      <label htmlFor="deadline">Project</label>
      <select value={selectedItem} onChange={(e)=>handleSelectionChange(e.target.value)}>
              <option value="">Select an item</option>
              {project.map(item => (
                <option key={item.id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>

      <label htmlFor="priority">Priority:</label>
      
      <select
        id="priority"
        value={priority}
        //placeholder={task[0].priority}
        onChange={(e) => {setPriority(e.target.value)}}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label htmlFor="state">State:</label>
      <div>hello {state}</div>
      <select
        id="state"
        value={state}
        //placeholder={task[0].state}
        onChange={(e) =>{ setState(e.target.value);  console.log(priority)}}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
    </div>
  );
}