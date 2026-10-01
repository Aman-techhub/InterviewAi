const mongoose =require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in the blacklist"]
    }
},{
    timestamps: true
})

const tokenBlackistModel= mongoose.model("blacklistTokens",blacklistTokenSchema)

module.exports=tokenBlackistModel