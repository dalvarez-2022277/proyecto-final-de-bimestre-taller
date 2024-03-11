import mongoose from "mongoose";

const tipoUser = ['ADMIN','CLIENT'];

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "the name is a parameter required"],
    },
    email: {
        type: String,
        required: [true, "the email is a parameter required"],
    },
    password: {
        type: String,
        required: [true, "the pass is a parameter required"],
    },
    role: {
        type: String,
        enum: tipoUser,
        default: 'CLIENT',
    },
    userState: {
        type: Boolean,
        default: true,
    }
});

UserSchema.methods.toJSON = function(){
    const { __v, _id, ...usera} = this.toObject();
    usera.uid = _id;
    return usera;
}


export default mongoose.model('Users', UserSchema);