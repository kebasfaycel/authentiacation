import mongoose, { Document, Model, Schema } from "mongoose";
interface IUser extends Document {
    name: string,
    email: string,
    password?: string,
    resetPasswordToken?: string,
    resetPasswordExpires?: number
}
const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Number,
        required: false
    }

});
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;