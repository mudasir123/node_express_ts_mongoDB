
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import IUser from "../modules/users/IUser"
import APIResponse from "../modules/common/services"
import UserService from "../modules/users/service";

export default class UserController{

    /**
     * createUSer
     */
    public async createUser(req:Request, res:Response):Promise<void> {
        try{
           if(req.body.name && req.body.name.first_name && req.body.name.middle_name &&
             req.body.name.last_name && req.body.email && req.body.password && req.body.phone_number && req.body.gender){

               const hashPassword =  await bcrypt.hash(req.body.password, 8);
               const user: IUser = {
                   name: {
                       first_name: req.body.name.first_name,
                       middle_name: req.body.name.middle_name,
                       last_name: req.body.name.last_name
                   },
                   email: req.body.email,
                   password:hashPassword,
                   phone_number: req.body.phone_number,
                   gender: req.body.gender,
                   modification_notes: [{
                       modified_on: new Date(Date.now()),
                       modified_by: "null",
                       modification_note: 'New user created'
                   }]
               };

               new UserService().filterUser({email:req.body.email}, (error: any, filterRes:IUser)=>{
                if(error) new APIResponse().serverError("MongoDB isn't creating user data", error, res);
                else if(filterRes) new APIResponse().successMessage("This User already created in our system", null, res)
                else{
                    new UserService().createUser(user, (error: any, user_res:IUser)=>{

                       
                        if(error) new APIResponse().serverError("MongoDB isn't creating user data", error, res);
                        else{
                            delete user_res['password'];
                            delete user_res['is_deleted'];
                            new APIResponse().successMessage("create user successfull", user_res, res);
                        } 
                    })
                }
              })


           }else{
             new APIResponse().insufficientParameters(res);
           }

        }catch(error:any){
           new APIResponse().serverError("Failed to Create User", error, res);
        }
    }

    /**
     * getUser
     */
    public getUserById(req:Request, res:Response):void {
        try {
           
            if(req.params.id){
                const filterParam = {_id:req.params.id};
                new UserService().filterUser(filterParam, (error:any, user_res:IUser)=>{
                    if(error) new APIResponse().serverError("MongoDB isn't returning user data", error, res);
                    else if(user_res.is_deleted){
                        const username = `${user_res.name.first_name} ${user_res.name.middle_name} ${user_res.name.last_name}`
                        const message = `The user ${username} was deleted!`
                        new APIResponse().successMessage(message, null, res);
                    }
                    else new APIResponse().successMessage("Get User Data Successfully", user_res, res);
                })

            }else{
                new APIResponse().insufficientParameters(res);
            }
            
        } catch (error:any) {
           new APIResponse().serverError("Failed to get User", error, res); 
        }
    }

    /*
    update user 
    */
    public updateUser(req: Request, res: Response) {

        const isUserDataforUpdate = req.body.name  || req.body.name.first_name || req.body.name.middle_name || req.body.name.last_name ||
                                    req.body.email || req.body.phone_number    || req.body.gender

        if ( req.params.id && isUserDataforUpdate ) {

            const userId = { _id: req.params.id, is_deleted:false };

            new UserService().filterUser(userId, (error: any, userData: IUser) => {

                if(error) new APIResponse().serverError("MongoDB isn't returning user data", error, res);
                else if (userData) {

                    userData.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: `${userData.name.first_name} ${userData.name.middle_name} ${userData.name.last_name}`,
                        modification_note: 'User data updated'
                    });

                    const user_params: IUser = {
                        _id: req.params.id,
                        name: req.body.name ? {
                            first_name: req.body.name.first_name ? req.body.name.first_name : userData.name.first_name,
                            middle_name: req.body.name.first_name ? req.body.name.middle_name : userData.name.middle_name,
                            last_name: req.body.name.first_name ? req.body.name.last_name : userData.name.last_name
                        } : userData.name,
                        email: req.body.email ? req.body.email : userData.email,
                        phone_number: req.body.phone_number ? req.body.phone_number : userData.phone_number,
                        gender: req.body.gender ? req.body.gender : userData.gender,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : userData.is_deleted,
                        modification_notes: userData.modification_notes
                    };

                    new UserService().updateUser(user_params, (error: any, resData:any)=>{
                        if(error) new APIResponse().serverError("MongoDB isn't returning user data", error, res);
                        else new APIResponse().successMessage("User Updated Successfully", null, res);
                    })
              
                } else {
                    new APIResponse().successMessage("Invalid User", null, res)
                }
            });

        } else {
             new APIResponse().insufficientParameters(res);
        }
    }

    /**
     * deleteUser
     */
    public deleteUser(req: Request, res: Response) {
        if (req.params.id) {
            
            const userFilter = {_id:req.params.id};
            new UserService().filterUser(userFilter, (error: any, userData:IUser)=>{

                if(error) new APIResponse().serverError("MongoDB isn't returning user data", error, res);
                else if(userData){
                    if(userData.is_deleted){
                        const username = `${userData.name.first_name} ${userData.name.middle_name} ${userData.name.last_name}`
                        const message = `The user ${username} already deleted!`
                        new APIResponse().successMessage(message, null, res);
                    }else{
                        userData.modification_notes.push({
                            modified_on: new Date(Date.now()),
                            modified_by: `${userData.name.first_name} ${userData.name.middle_name} ${userData.name.last_name}`,
                            modification_note: 'Admin marked user as deleted: User is not permently Deleted from our system'
                        });
                        userData.is_deleted = true;
                        new UserService().updateUser(userData, (error: any, resData:any)=>{
                            if(error) new APIResponse().serverError("MongoDB isn't returning user data", error, res);
                            else new APIResponse().successMessage("User Deleted Successfully", null, res);
                        })
                    }
                }

            })
        
        } else {
            new APIResponse().insufficientParameters(res);
        }
    }
}