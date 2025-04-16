const moongoose = require('mongoose');
const Schema = moongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // phone không bắt buộc nữa vì không dùng trong đăng ký
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true // nếu vẫn muốn unique nhưng cho phép null
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    registered_at:{
        type: Date,
        default: Date.now
    }
})

module.exports = moongoose.model('User', UserSchema)