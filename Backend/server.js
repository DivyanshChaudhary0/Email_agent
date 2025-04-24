
import app from "./src/app.js"
import config from "./src/config/config.js"
import connect from "./src/db/db.js";
import client from "./src/mcp/mcp.client.js"

connect();

app.listen(config.PORT, function(){
    console.log(`app is running on port ${config.PORT}`);
})