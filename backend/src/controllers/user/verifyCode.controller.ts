import { response } from "../../utils/response";
import { Request, Response } from "express";
import { verificationCodeSchema } from "../../validations/verificationCodeSchema";
import prisma from "../../helpers/prismaClient";
import z from "zod"

type data = z.infer<typeof verificationCodeSchema>;

export const verifyCode = async (req: Request, res: Response) => {
    try {

        const data: data = req.body;

        const requestValidation = verificationCodeSchema.safeParse(data);

        if (!requestValidation.success) {
            response.error(res, "Invalid data sent");
            return
        }

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) {
            response.error(res, "No user exists with this email")
            return
        }

        const isCodeValid = user.verifyCode === data.verifyCode;
        if (!isCodeValid) {
            response.error(res, "Verification Code is not correct")
            return;
        }

        const isCodeExpired = user.verifyCodeExpiresAt < new Date(Date.now())

        if (isCodeExpired) {
            response.error(res, "Verification code expired please sign up again to get verification code")
            return;

        }

        await prisma.user.update({
            where: {
                email: data.email
            }
            ,
            data: {
                isVerified: true
            }
        });

        response.ok(res, "User Verified Successfully");
        return;



    } catch (error) {
        console.log("error verifyig code", error)
        response.error(res, "Internal server error");
        return;

    }

}