import { Request, Response } from "express";
import z from "zod"
import { loginSchema } from "../../validations/user/loginSchema";
import prisma from "../../helpers/prismaClient";
import jwt from "jsonwebtoken"
import { config } from "../../config/config";
import { response } from "../../utils/response";
import { api } from "../../routes/router";
import bcrypt from "bcryptjs"


type loginData = z.infer<typeof loginSchema>


export const login = async (req: Request, res: Response) => {

    const user: loginData = req.body;
    user.email.toLowerCase();

    const requestValidation = loginSchema.safeParse(user);

    if (requestValidation.success) {

        const userExist = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        if (userExist) {

            const isPasswordCorrect = await bcrypt.compare(user.password, userExist.password);

            const payload = { userId: userExist.id, email: userExist.email, role: userExist.role }
            if (isPasswordCorrect) {
                const token = jwt.sign(payload, config.JWT_SECRET!);
                response.ok(res, "Login Successfull", 200, token);
                return;
            }
            else {
                response.error(res, "Incorrect Password", 401);
                return;

            }

        }
        else {
            response.error(res, "Incorrect Email, No User Exists With This Email", 404);
            return

        }
    }
    else {
        response.error(res, "Invalid Data Sent", 400)
        return;
    }

}


api.post("/login", "noauth", login);