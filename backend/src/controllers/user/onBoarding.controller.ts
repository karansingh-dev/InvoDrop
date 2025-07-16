import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";

import { response } from "../../utils/response";
import { OnBoardingDataType } from "../../types/user";
import { onboardingSchema } from "../../validations/user/onBoardingSchema";

export const userOnBoarding = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const onBoardingData: OnBoardingDataType = req.body;

    const requestValidation = onboardingSchema.safeParse(onBoardingData);

    if (!requestValidation) {
      return response.error(res, "Invalid Data Sent", 400);
    }

    const company = {
      name: onBoardingData.name,
      userId: user.userId,
      taxId: onBoardingData.taxId || null,
      logoUrl: onBoardingData.logoUrl,
      phoneNumber: onBoardingData.phoneNumber,
      streetAddress: onBoardingData.streetAddress,
      city: onBoardingData.city,
      state: onBoardingData.state,
      country: onBoardingData.country,
      pinCode: onBoardingData.pinCode,
    };

    try {
      await prisma.company.create({
        data: company,
      });
    } catch (error) {
      console.log("DB: Failed to add Compnay details");
      throw error;
    }

    const invoiceSettings = {
      userId: user.userId,
      invoiceNumberFormat: onBoardingData.invoiceNumberFormat,
      termsAndConditions: onBoardingData.termsAndConditions,
      defaultNote: onBoardingData.defaultNote,
    };

    try {
      await prisma.invoiceSetting.create({
        data: invoiceSettings,
      });
    } catch (error) {
      console.log("DB: Failed to add Invoice Settings for user");
      throw error;
    }

    return response.ok(res, "User OnBoarded Succesfully", 201);
  } catch (error) {
    console.error("Error OnBoarding User");
    throw error;
  }
};

api.post("/add-user-company", "protected", userOnBoarding);
