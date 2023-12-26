import { Request, Response } from "express";

export class AuthController {

    // Dependency Inyection
    constructor() { }

    registerUser = (req: Request, res: Response) => {
        res.json({ text: 'Register User' })
    }

    loginUser = (req: Request, res: Response) => {
        res.json({ text: 'Login User' })
    }

    validateEmail = (req: Request, res: Response) => {
        res.json({ text: 'Validate Email' })
    }
}