import { Response } from "express";
import{ResponseObject, ResponseStatusCodes} from "./model"

export default class APIResponse{
    
    public successMessage(message:String, data:any, res:Response):void{
        
        const jsonObject:ResponseObject = {status:'Success',message, data}

        res.status(ResponseStatusCodes.success).json(jsonObject);
    }

    public failureMessage(message:String, data:any, res:Response):void{
        
        const jsonObject:ResponseObject = {status:'Failure', message, data}
        
        res.status(ResponseStatusCodes.success).json(jsonObject);
    }

    public insufficientParameters(res:Response):void{

        const jsonObject:ResponseObject = {status:'Failure', message:'Request have insufficient Parameters', data:null}

        res.status(ResponseStatusCodes.bad_request).json(jsonObject);
    }

    public serverError(message:String, error:any, res:Response):void{

        const jsonObject:ResponseObject = {status:'Failure', message, data:error}
        res.status(ResponseStatusCodes.internal_server_error).json(jsonObject);
    }
}