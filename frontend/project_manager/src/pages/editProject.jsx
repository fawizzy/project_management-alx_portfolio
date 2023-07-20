import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/sidebar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const EditProjectForm = ({ taskid }) => {
  const [task, setTask] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
 
  
  const navigate = useNavigate()
  const { id } = useParams();

  useEffect(() => {
    getTask();
  }, []);
  const getTask = async () => {
    const session_id = localStorage.getItem("session_id")
    
    const {data: response} = await axios.get(`http://127.0.0.1:5000/getprojects/${session_id}/${id}`,  
     { withCredentials: true });
     setTask(response);
     setTitle(response[0].title)
     setDescription(response[0].description)
    
   };
    

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const session_id = localStorage.getItem("session_id")
    
    // Create the updated task object
    const updatedTask = {
     // ...task,
      title: title,
      description: description,
    };

    axios.put(`http://127.0.0.1:5000/updateproject/${session_id}/${id}`, 
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

      
      

      
      <button type="submit">Update Task</button>
    </form>
    </div>
  );
}