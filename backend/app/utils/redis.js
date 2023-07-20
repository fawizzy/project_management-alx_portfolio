const redis =  require("redis")
import { error } from 'console'
import {promisify} from 'util'

class RedisClient{
    constructor(){
        this.client = redis.createClient()

        

        this.client.on("error", (error)=>{
            console.log(`Redis client not connected to the server ${error}`)
        })

    }

    isAlive() {
        if (this.client.connected) {
            return true;
          }
          return false;
    }

    async set(key, value, time){
        await this.client.setex(key,time,value)
    }

    async get(key){
        const asyncget = promisify(this.client.get).bind(this.client)
        const value = await asyncget(key)
        return  value
    }
}

const redisClient = new RedisClient()
module.exports = redisClient

