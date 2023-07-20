import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/sidebar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const AddProjectForm = ({ taskid }) => {
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
    const newProject = {
     // ...task,
      title: title,
      description: description,
      deadline: deadline,
      priority: priority,
      state: state,
      project_id: selectedItem
    };

    console.log(deadline)
    axios.post(`http://127.0.0.1:5000/addproject/${session_id}`, 
    newProject,
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
     
     <button type="submit">Add Project</button>
    </form>
    </div>
  );
}