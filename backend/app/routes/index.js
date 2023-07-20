import { Router } from "express";
const UserControllers = require("../controllers/UserControllers")
const userAuth = require("../authentication/userAuth")
const projectController = require("../controllers/ProjectController")
const taskController = require("../controllers/TaskController")
const route = Router();

// route.get("/logIn", authentication.sessionToken)
route.post('/signup', UserControllers.signUp)
route.post('/login', userAuth.logIn)
route.post("/addproject/:id", projectController.newProject)
route.post("/addtask/:id", taskController.newTask)
route.delete("/delproject/:id/:project_id", projectController.delProject)
route.delete("/deltask/:id/:task_id", taskController.delTask)
route.get('/numproject', projectController.numProjects)
route.get('/numtask', taskController.numTasks)
route.put("/updateuser", UserControllers.updateUser)
route.put("/updateproject/:id/:project_id", projectController.updateProject)
route.put("/updatetask/:id/:task_id", taskController.updateTask)
route.get('/userprojects/:id', projectController.getProjectByUser)
route.get('/usertasks/:id', taskController.getTaskByUser)
route.get('/gettasks/:id/:task_id', taskController.getTaskById)
// route.get('/getproject/:id/:project_id', projectController.getProjectById)
module.exports = route