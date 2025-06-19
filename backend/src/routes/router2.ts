import express from "express"
import { signUp } from "../controllers/user/signUp.controller";


export const router  = express.Router();


router.post("/sign-up",signUp)