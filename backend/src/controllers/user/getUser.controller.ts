import { Request, Response } from "express"
import prisma from "../../helpers/prismaClient"
import { response } from "../../utils/response";
import { api } from "../../routes/router";

export const getUser = async (req: Request, res: Response) => {

    const user = req.user;

    const userData = await prisma.user.findUnique({
        where: {
            id: user.userId
        }
        ,
        select:{
            firstName:true,
            lastName:true,
            email:true
        }
    })

    if (userData) {
        response.ok(res, "User Data Found Successfully", 200, userData);
        return;
    }
    else{
        response.error(res,"No User Found",404);
        return
    }

}

api.get("/get-user-data","protected",getUser);