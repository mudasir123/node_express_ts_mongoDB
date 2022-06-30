import express from "express";
import CommonRoutes from "../routes/common_routes";
import mongoose from "mongoose";
import UserRoutes from "../routes/user_routes"

class App {
    
    public app:express.Application;
    public mongoURL:string = "mongodb+srv://mudasir:cricKET123456@cluster0.xlz8whq.mongodb.net/?retryWrites=true&w=majority";
    
    constructor(){
        this.app = express();
        this.config(); // responsible for parsing client request 

        this.mongoSetup();

        new UserRoutes().route(this.app);
        
       // new CommonRoutes().routes(this.app); // for mismatch route make sure to call last of all routes
    }
    
    private config(): void {
        //Middleware: processing the request and sending the response in your application
        // Express app has middleware stack
        // app.use(): add new layer in middleware stack

        // this middleware is responsible for parsing the request body and setting 'req.body' property
        //.json() : recognize|parse the incomming request object as JSON object
        this.app.use(express.json()); 

        //urlencoded: parse the incomming request object as string | array

        //urlencoded({extended:false}) :can only parse incoming Request Object if strings or arrays 
        //urlencoded({extended:true}) : parse incoming Request Object if object, with nested objects, or generally any type.
        this.app.use(express.urlencoded({extended:false}));
    }

    private mongoSetup(): void{

        const options:any ={
            useNewUrlParser: true, useUnifiedTopology: true
        }

        mongoose.connect(this.mongoURL, options )
        const db:any = mongoose.connection;
        
        db.on('connected', ()=>{
            console.log("Successfully connected to MongoDB");
        })
        db.on('error', (error:any)=>{
            console.log("Error connecting with MongoDB", error);
        })

    }
}

export default new App().app;