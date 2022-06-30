import {Application, Request, Response} from "express"

export default class CommonRoutes{
    
    public routes(app: Application): void {
        
        //mismatch URL
        //load middleware function at a path for all http request method
        app.all('*', (req: Request, res: Response)=>{
            res.status(404).send({
                error:true,
                message: 'Invalid URL, check your URL Please'
            })
        })
    }
}