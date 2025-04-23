
import mongoose from "mongoose"
import config from "../config/config.js"

function connect(){
    mongoose.connect(config.MONGO_URI)
    .then(()=>{
        console.log("Db connected");
    })
    .catch(()=>{
        console.log("db not connected");
    })
}

export default connect;