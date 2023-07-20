import dbClient from "../utils/db"
import redisClient from "../utils/redis"
import sha1 from "sha1"
const uuid = require("uuid")

async function logIn(req, res){
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    console.log("login")

    if (!email){
        res.status(401).json({error: "email missing"})
        return;
    }
    if (!password){
        res.status(401).json({error: "password missing"})
        return;
    }

    const hashed_password = sha1(password)
    const users = await dbClient.db.collection("users")

    const user = await users.findOne({email: email, password: hashed_password})


    if (!user) {
        res.status(401).json({error: "User does not exist"})
        return
    }

    const token = uuid.v4()
    const key = `auth_${token}`
    await redisClient.set(key, user._id.toString(), 240*60*60)
    res.cookie("session_id", token, { sameSite: 'none', secure: true,  httpOnly: true })
    res.status(200).json({token: token})

}

const userAuth = {
    logIn
}

module.exports = userAuth
