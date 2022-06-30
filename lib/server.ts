import app from "./config/app"
import Environment from "./environment"

const PORT =  new Environment('local').getPort();

app.listen(PORT , ()=>{
    console.log("Express server listening on port ", PORT);
});