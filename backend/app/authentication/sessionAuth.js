import dbClient from "../utils/db"
import redisClient from "../utils/redis"


async function sessionAuth(req, res){
    const token = req.header('X-Token')
    const key = `auth_${token}`
    const id = await redisClient.get(key)
    const users  = await dbClient.db.collection("users")
    if (!id){
        res.status(401).json({error: "Unauthorized"})
    }

    const user = users.findOne()

}