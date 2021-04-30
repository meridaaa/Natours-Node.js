const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path: './confg.env'})
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')

const DB =process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connected'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'))

const importData = async () => {
    try {
    // await Review.create(reviews)
    await Tour.create(tours)
    await User.create(users, {validateBeforeSave: false})
    
    console.log('Data successfully loaded!');
    }catch(err) {
        console.log(err)
    }
    process.exit()
}

const deleteData = async () => {
    try{
    await Tour.deleteMany()
    await User.deleteMany()
    // await Review.deleteMany()
    console.log('Data successfully deleted!');
    }catch(err) {
        console.log(err)
    }
    process.exit()
}
if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}