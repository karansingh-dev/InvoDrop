import expres, { NextFunction } from "express"
import { signUp } from "../controllers/user/signUp";
import { Request, Response } from "express";
import express from "express"
import { test } from "../controllers/user/test";
import { wrapAsync } from "../utils/wrapAsync";


export const router = express.Router();


router.post("/sign-up", wrapAsync(signUp));
router.get("/test", wrapAsync(test));






