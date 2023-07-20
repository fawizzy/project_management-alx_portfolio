import dbClient from "../utils/db"
import redisClient from "../utils/redis"
import { ObjectId } from "mongodb"
import sha1 from 'sha1'


async function signUp(req, res){
    const name = req.body ? req.body.name : null;
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    const users = await dbClient.db.collection("users");
    if (!name){
        res.status(400).json({error: "Missing name"});
        return;
    }
    if (!email){
        res.status(400).json({error: "Missing email"});
        return;
    }
    if (!password){
        res.status(400).json({error: "Missing password"});
        return;
    }

    const user = await users.findOne({email: email})
    
    if (user) {
        res.status(400).json({error: `User with ${user.email} already exists`})
        return
    }

    const hashed_password = sha1(password)

    const result = await users.insertOne({
        name: name,
        email: email,
        password: hashed_password
    })

    res.status(201).json({email, id: result.insertedId})
}

async function updateUser(req, res){
    const token = req.cookies.session_id
    const key = `auth_${token}`
    const id = await redisClient.get(key)
    const users = await dbClient.db.collection("users");

    if (!id){
        res.status(401).json({errorid: "unauthorized"});
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

    
    const options = {upsert: false}
    const filter = {
        _id: user._id
    }

    const email = req.body.email || user.email;
    const name = req.body.name || user.name;
    const password = req.body.password;
    let hashed_password;


    const checkemail = users.findOne({
        email: email
    })

    if (checkemail){
        res.status(401).json({error: "this email is registered"})
        return
    }

    if (password){
        hashed_password = sha1(password)
    } else {
        hashed_password = user.password
    }
    
    const update =  {
        email: email,
        name: name,
        password: hashed_password
    }

    const updateDoc = {
        $set: update
    }

    const result = await users.updateOne(filter, updateDoc, options);
    user = await users.findOne({
        _id: objectUserId
    })
    res.status(200).json(user)
    return
}

const UserControllers = {
    signUp,
    updateUser
}

module.exports = UserControllers