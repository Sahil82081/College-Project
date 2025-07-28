const mongoose = require('mongoose');
require('dotenv').config();
const { UserSchema, ChatSchema } = require('./Schema')

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to Database");
})

const User = mongoose.model('User',UserSchema)
const Chat = mongoose.model('Chat',ChatSchema)

module.exports = {User, Chat}