import { Request ,Response} from "express";
import { response } from "../utils/response";
import { api } from "../routes/router";




export const test = async(req:Request,res:Response)=>{

    response.ok(res,"successfull",200);
    return;
}


api.get("/test","protected",test);