import { MongoClient } from "mongodb"

const url = 'mongodb://localhost:27017'

class DBClient{
    constructor(){
        this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true})
        this.client.connect().then(()=>{
            this.db = this.client.db('project_management')
        }).catch((err)=>{
            console.log(err)
        })
    }

    isAlive() {
        return this.client.isConnected()
    }
}



const dbClient = new DBClient()

module.exports = dbClient