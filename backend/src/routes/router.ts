import { signUp } from "../controllers/user/signUp";
import express from "express";

export const router = express.Router();

router.get("/sign-up", signUp);





