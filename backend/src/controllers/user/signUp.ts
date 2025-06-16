import { Request, Response } from "express";
import { response } from "../../utils/response";
import { signUpSchema } from "../../validations/signUpSchema";
import prisma from "../../helpers/prismaClient";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { config } from "../../config/config";



interface newUser {

    firstName: string;
    lastName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiresAt: Date;
}

export const signUp = async (req: Request, res: Response): Promise<Response> => {

    const user = req.body;
    const requestValidation = signUpSchema.safeParse(user);

    if (!requestValidation.success) {
        return response.error(res, "Invalid Data sent", 400, requestValidation.error.format());
    }

    const userExist = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    });
    const verifyCode = Math.floor(Math.random() * 1000000).toString();
    const verifyCodeExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(user.password, config.BCRYPTJS_SALT);

    if (userExist) {

        if (userExist.isVerified) return response.error(res, "User already Exist with this email");

        //handle when user is registered but not verified
        await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiresAt
            }
        })

        return response.ok(res, "Verify your account", 200);

    }

    //handles when user not exist

    const newUser: newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        email: user.email,
        verifyCode,
        verifyCodeExpiresAt
    }
    await prisma.user.create({
        data: newUser
    });

    const fullName = `${newUser.firstName} ${newUser.lastName}`;


    const verificationResponse = await sendVerificationEmail(newUser.email, fullName, verifyCode);

    if (!verificationResponse.success) return response.error(res, verificationResponse.message);


    return response.ok(res, "User Registered Successfully", 201);



}