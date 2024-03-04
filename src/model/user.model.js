import mongoose from "mongoose";

const Role = {
    ADMIN: "ADMIN",
    CLIENT: "CLIENT",};
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.CLIENT,
        required: [true, "Role is required"],
    },
    status: {
        type: Boolean,
        default: true,
    },
});

UserSchema.methods.toJSON = function (){
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};
export default mongoose.model("User", UserSchema);