const mongoose = require('mongoose')
const dotenv = require('dotenv')

// process.on('uncaughtException',err => {
//     console.log(err.name, err.message)
//     console.log('UNCAGHT EXCEPTION! Shutting down...')
//         process.exit(1)
// })
dotenv.config({path: './confg.env'})
const app = require('./app');
const DB =process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connected'))

const port = 4000 || process.env.port
const sever = app.listen(port, () => {
    console.log(`'App ${port} is running'`)
})

// process.on('unhandledRejection',err => {
//     console.log(err.name, err.message)
//     console.log('Unhandled rejection! Shutting down...')
//     sever.close(() => {
//         process.exit(1)
//     })
// })