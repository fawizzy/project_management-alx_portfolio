import { use } from "chai";
import dbClient from "../utils/db"
import redisClient from "../utils/redis"
import {ObjectId} from "mongodb"

async function newTask(req, res){
    const token = req.cookies.session_id
    // const key = `auth_${token}`
    const key = `auth_${req.params ? req.params.id : null}`;
    const id = await redisClient.get(key)
    

    if (!id){
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    const user = await dbClient.db.collection("users").findOne({
        _id: objectUserId
    })

    
    
    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }


    const project_id = req.body ? req.body.project_id : null;
    const title = req.body? req.body.title:null;
    const description = req.body ? req.body.description: null;
    const deadline = req.body ? req.body.deadline : null;
    const priority = req.body ? req.body.priority : null;
    const state = req.body ? req.body.state : null;
    
    
    const objectProjectId = new ObjectId(project_id)
    
   
     if (!project_id){
         res.status(401).json({error: "select a project"})
         console.log("project id", project_id)
         return
    }
    if (!title){
        res.status(401).json({error: "title not available"})
        return
    }

    if (!description){
        res.status(401).json({error: "description not available"})
        console.log("des4")
        return
    }

    if (!deadline){
        res.status(401).json({error: "deadline not available"})
        console.log("des3")
        return
    }

    if (!priority){
        res.status(401).json({error: "priority not available"})
        console.log("des2")

        return
    }

    if (!state){
        res.status(401).json({error: "state not available"})
        return
    }

    const tasks = dbClient.db.collection("tasks")
    const projects = dbClient.db.collection("projects")
    const project = await projects.findOne({
        _id: objectProjectId
    })

    if (!project){
        res.status(401).json({error: "project not found"})
        return

    }

    
    const insert =await tasks.insertOne({
        user_id: user._id,
        project_id: project._id,
        project_title: project.title,
        title: title,
        description: description,
        deadline: deadline,
        created_at: new Date(),
        priority: priority,
        state: state
    }, async (err, suc)=>{
        if (err) {
            res.status(400).json({error: "insert error"})
            return
        } 
        
         const options = {upsert: false}
        const filter = {
            _id : project._id,
            
        }

        const updatedTaskList = project.tasks
        updatedTaskList.push(suc.ops[0]._id)

        console.log(filter)
        const update = {
            $set: {
                tasks: updatedTaskList
            }
        }

       const result =  await projects.updateOne(filter, update, options) 
        res.status(200).json("insert successful")
    })

}

async function delTask(req, res){
    console.log("delete")
    const token = req.cookies.session_id
   // const key = `auth_${token}`
   const key = `auth_${req.params ? req.params.id : null}`;
   const id = await redisClient.get(key)

    if (!id){
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    const user = await dbClient.db.collection("users").findOne({
        _id: objectUserId
    })

    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }

    const taskId = req.params ? req.params.task_id : null;
    
    const objectTaskId = ObjectId(taskId)
    const query= {
        _id : objectTaskId
    }
    
    const tasks = dbClient.db.collection("tasks")
    const result = await tasks.deleteOne(query)

    if (result.deletedCount === 1){
        res.status(202).json({message: "task succesfully deleted"})
        return
    } else {
        res.status(400).json({message: "task not found"})
        return
    }
}


async function numTasks(req, res){
    const token = req.cookies.session_id
    const key = `auth_${token}`
    const id = await redisClient.get(key)

    if (!id){
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    const user = await dbClient.db.collection("users").findOne({
        _id: objectUserId
    })

    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }
    const tasks = dbClient.db.collection("tasks")

    const query = {
        user_id: user._id
    }
    const taskNum = await tasks.countDocuments(query)

    res.status(200).json({"No of tasks": taskNum})
    return
}


async function updateTask(req, res){
    console.log("update")
    const token = req.cookies.session_id
    // const key = `auth_${token}`
    const key = `auth_${req.params ? req.params.id : null}`;
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");

    const task_id = req.params ? req.params.task_id : null;
    const objectTaskId =new ObjectId(task_id)
    

    if (!id){
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    let user = await users.findOne({
        _id: objectUserId
    })

    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }

    const tasks = dbClient.db.collection("tasks")

    let task = await tasks.findOne({
        _id: objectTaskId
    })
    
    if (!task){
        res.status(404).json({error: "task not found"})
    }
    const options = {upsert: false}
    const filter = {
        _id : task._id,
        
    }

    const title = req.body.title || task.title;
    const description = req.body.description || task.description;
    const project_id =req.body.project_id || task.project_id;
    const deadline = req.body.deadline || task.deadline;
    const priority = req.body.priority || task.priority;
    const state = req.body.state || task.state;
    
    const update =  {
        title: title,
        description: description,
        deadline: deadline,
        priority: priority,
        state: state
    }

    const updateDoc = {
        $set: update
    }

    const result = await tasks.updateOne(filter, updateDoc, options);
    user = await users.findOne({
        _id: objectUserId
    })
    
    task = await tasks.findOne({
        _id: objectTaskId
    })
    res.status(200).json(task)
    return
}


async function getTaskByUser(req, res){
    const token = req.cookies.session_id
    
    // const key = `auth_${token}`
    const key = `auth_${req.params ? req.params.id : null}`;
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");
    const session_id = req.params ? req.params.id : null;
    
    if (!id){
        
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    let user = await users.findOne({
        _id: objectUserId
    })
    
    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }

    const tasks = dbClient.db.collection("tasks")

    const userTasks = await tasks.find({
        user_id : user._id
    }).toArray()
    // console.log(userTasks)
    res.status(200).json(userTasks)
}

async function getTaskByProject(req, res){
    const token = req.cookies.session_id
    const key = `auth_${token}`
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");

    const project_id = req.params ? req.params.id : null;
    const objectProjectId =new ObjectId(project_id)
    

    if (!id){
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    let user = await users.findOne({
        _id: objectUserId
    })

    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }

    const tasks = dbClient.db.collection("tasks")

    const projectTasks = await tasks.find({
        project_id : objectProjectId
    }).toArray()

    
    res.status(200).json(projectTasks)
}

async function getTaskById(req, res){
    const token = req.cookies.session_id
    // const key = `auth_${token}`
    const key = `auth_${req.params ? req.params.id : null}`;
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");
    const task_id = req.params ? req.params.task_id : null;
    const objectTaskId = ObjectId(task_id)
    

    if (!id){
        res.status(401).json({error: "unauthorized"});
        return;
    }
    const objectUserId = new ObjectId(id)
    let user = await users.findOne({
        _id: objectUserId
    })

    if (!user){
        res.status(401).json({error: "unauthorized"})
        return
    }

    const tasks = dbClient.db.collection("tasks")

    const idTasks = await tasks.find({
        _id : objectTaskId
    }).toArray()

    
    res.status(200).json(idTasks)
}

const taskController = {
    newTask,
    delTask,
    numTasks,
    updateTask,
    getTaskByUser,
    getTaskByProject,
    getTaskById
}

module.exports = taskController