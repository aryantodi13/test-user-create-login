const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    }, 
    age: {
        type: Number, 
        validate(value) {
            if (value < 18) throw new Error('You must be at least 18 years old to create an account on this site.')
        }, 
        required: true
    }, 
    email: {
        type: String, 
        trim: true,
        unique: true, 
        required: true, 
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Must be a valid email');
        }
    }, 
    password: {
        type: String, 
        required: true, 
        minLength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes(this.firstName.toLowerCase()) || value.toLowerCase().includes(this.lastName.toLowerCase())) throw new Error('Password cannot include name')
        }
        
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }], 
    avatar: {
        type: Buffer
    }
},
{
    timestamps: true
})


userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('User', userSchema)
module.exports = User