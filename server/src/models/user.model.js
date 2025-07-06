import mongoose, { mongo } from "mongoose";

const cartItem = new mongoose.Schema({
    barcode:{type:Number, required:true, unique:true}
},{timestamps:true})

const userSchema = new mongoose.Schema(
    {
        clerkId:{
            type:String,
            unique:true,
        },
        email:{
            type:String,
            unique:true,
        },
        profilePicture:{
            type:String,
            default:"",
        },
        cartItem:[cartItem]
    },
    {timestamps:true}
)

const User = mongoose.model('User',userSchema);
export default User