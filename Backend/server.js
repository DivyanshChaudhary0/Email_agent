
import app from "./src/app.js"
import config from "./src/config/config.js"

app.listen(config.PORT, function(){
    console.log(`app is running on port ${config.PORT}`);
})