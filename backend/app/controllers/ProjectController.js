import { query } from "express"
import dbClient from "../utils/db"
import redisClient from "../utils/redis"
import {ObjectId} from "mongodb"

async function newProject(req, res){
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


    const title = req.body? req.body.title:null;
    const description = req.body ? req.body.description: null;
    const deadline = req.body.deadline || 0;

    
    if (!title){
        res.status(401).json({error: "title not available"})
        return
    }
    if (!description){
        res.status(401).json({error: "description not available"})
        return
    }
    if (!deadline){
        res.status(401).json({error: "deadline not available"})
        return;
    }
    const projects = dbClient.db.collection("projects")
    const insert = await projects.insertOne({
        user_id: user._id,
        title: title,
        description: description,
        deadline: deadline,
        tasks: []
    })
    const project = await projects.findOne({title:title})
    res.status(200).json({
        id: insert.insertedId,
        title: project.title 
    })
    return;
}

async function delProject(req, res){
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

    const projectId = req.params ? req.params.project_id : null;
    const objectProjectId = ObjectId(projectId)
    const query= {
        _id : objectProjectId
    }
    
    const projects = dbClient.db.collection("projects")
    const result = await projects.deleteOne(query)

    if (result.deletedCount === 1){
        res.status(202).json({message: "succesfully deleted"})
        return
    } else {
        res.status(400).json({message: "project not found"})
        return
    }
}

async function numProjects(req, res){
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
    const projects = dbClient.db.collection("projects")

    const query = {
        user_id: user._id
    }
    const projectNum = await projects.countDocuments(query)

    res.status(200).json({"No of projects": projectNum})
    return
}


async function updateProject(req, res){
    const token = req.cookies.session_id
    // const key = `auth_${token}`
   const key = `auth_${req.params ? req.params.id : null}`;
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");

    const project_id = req.params ? req.params.project_id : null;
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

    const projects = dbClient.db.collection("projects")

    let project = await projects.findOne({
        _id: objectProjectId
    })

    if (!project){
        res.status(404).json({error: "project not found"})
    }
    const options = {upsert: false}
    const filter = {
        _id : project._id,
        
    }

    const title = req.body.title || project.title;
    const description = req.body.description || project.description;
    const deadline = req.body.deadline || project.deadline;
    
    const update =  {
        title: title,
        description: description,
        deadline: deadline
    }

    const updateDoc = {
        $set: update
    }

    const result = await projects.updateOne(filter, updateDoc, options);
    user = await users.findOne({
        _id: objectUserId
    })
    
    project = await projects.findOne({
        _id: objectProjectId
    })
    res.status(200).json(project)
    return
}


async function getProjectByUser(req, res){
    const token = req.cookies.session_id
    // const key = `auth_${token}`
   const key = `auth_${req.params ? req.params.id : null}`;
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");

    //const project_id = req.params ? req.params.id : null;
    //const objectProjectId =new ObjectId(project_id)
    

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

    const projects = dbClient.db.collection("projects")

    const userProjects = await projects.find({
        user_id : user._id
    }).toArray()

    res.status(200).json(userProjects)
}


const projectController = {
    newProject,
    delProject,
    numProjects,
    updateProject,
    getProjectByUser
}

module.exports = projectController