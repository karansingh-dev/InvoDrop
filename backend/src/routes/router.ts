import { signUp } from "../controllers/user/signUp.controller";
import express from "express";
import { verifyCode } from "../controllers/user/verifyCode.controller";

export const router = express.Router();

router.post("/sign-up", signUp);
router.post("/verify-code",verifyCode);







