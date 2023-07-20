import React, {useState, useEffect} from 'react'
import axios from "axios";
import "../homepage.css"
import { Sidebar } from '../components/sidebar';
import { EditTaskForm } from './editTasks';
import { useNavigate }from "react-router-dom"


export const Homepage = () => {

  const [tasks, setTasks] = useState([]);
  const [projectname, setProjectName] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    //handleMarkComplete();
    getTasks();
  });

  const getTasks = async () => {
    const session_id = localStorage.getItem("session_id")
     
    const {data: response} = await axios.get(`http://127.0.0.1:5000/usertasks/${session_id}`,  
     { withCredentials: true });
     setTasks(response);
   };

  // console.log(tasks)

  const handleMarkComplete = async (task, taskId) => {
    // Implement logic for marking the task as complete
    let value;
    const session_id = localStorage.getItem("session_id")
    console.log(task.state)
    if (task.state == "completed"){
      value = "In progress"
  }else{
    value = "completed"
  }
  
    const {data: response} = await axios.put(`http://127.0.0.1:5000/updatetask/${session_id}/${taskId}`,
    {state: value},  
    { withCredentials: true });

  };

  const handleEditTask = (taskId) => {
    // Implement logic for editing the task
    navigate(`/edittask/${taskId}`)
    console.log(`Editing task ${taskId}...`);
  };

  const handleDeleteTasks = async (taskId) => {
    // Implement logic for deleting the task
    const session_id = localStorage.getItem("session_id")
    await axios.delete(`http://localhost:5000/deltask/${session_id}/${taskId}`)
    .then((response)=>{
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const handleAddTasks = () => {
    navigate("/addtask")
  }

  const handleAddProject = () => {
    navigate("/addproject")
  }
  const complete = (task) => {
    if (task.state == "completed"){
      return "Incomplete"
    } 
    else {
      return "completed"
    }
  }
  
  
  return (
    <div className='homepage'> 
      <Sidebar />
      <div className='welcome'>
        welcome
      </div> 
      <button className='addtask' onClick={()=> handleAddTasks()}> Add task</button>
      <button className='addtask' onClick={()=> handleAddProject()}> Add project</button>
      <div>
        <h1>Task List</h1>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index}>
              
              <div>
                <span className="project-name" >{task.project_title}</span>
                <span className="task-name">task name: {task.title}</span>
              </div>
              <div>
                {/* <span className="task-title">task title{task.taskTitle}</span> */}
                <span className="task-description">description: {task.description}</span>
                <button className='state' >{task.state}</button>
              </div>
              <div>
                <span className="deadline">Deadline: {task.deadline}</span>
                <span className="date-created">Created: {task.created_at.substring(3,21)}</span>
                
              </div>
              <div className="actions">
                <button className='btn-complete' onClick={() => handleMarkComplete(task, task._id)}>Mark { complete(task)}</button>
                <button className='btn-edit' onClick={() => handleEditTask(task._id)}>Edit</button>
                <button className='btn-delete' onClick={() => handleDeleteTasks(task._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  )
}
