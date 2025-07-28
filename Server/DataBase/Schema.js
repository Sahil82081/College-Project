const { Schema } = require("mongoose")
const UserSchema = {
    name: String
}

const ChatSchema = {
    room: String,
    from: {
        type: Schema.Types.ObjectId,
    },
    msg: String
}

module.exports = {
    UserSchema, ChatSchema
}