const express = require('express')
const bodyParser=require('body-parser')
const authRouter = require('./routes/auth')
const adminRouter=require('./routes/adminRout')
const mongoose = require('mongoose')
const morgen=require('morgan')
const createError=require('http-errors')
const cors=require('cors')


const app = express();



const port = process.env.port || 3000


mongoose.connect('mongodb://localhost:27017/webapp', (err) => {
    if (err) {
        console.log('db is not connected');
    } else {
        console.log('is connected');
    }
});


app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(cors())
app.use (express.json())

app.use('/auth', authRouter)
app.use('/admin',adminRouter)

app.get('/', (req, res) => {
    res.send('welcome ')
})

app.listen(port, () => {
    console.log('node is running', port);
})