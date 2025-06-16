import { Request, Response } from "express";
import { response } from "../../utils/response";




export const test = async(req:Request,res:Response):Promise <Response> =>{
    return response.ok(res,"hello");

}