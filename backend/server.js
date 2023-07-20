const express = require("express")
const cors = require("cors")
const index = require("./app/routes/index")
const cookieParser = require("cookie-parser")

const app = express()

const port = 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['POST', 'PUT', 'GET', 'DELETE'],
  credentials: true,
  
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.use('/', index)
app.listen(port)

export default app