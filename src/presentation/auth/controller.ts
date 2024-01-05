import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services";

export class AuthController {

    // Dependency Inyection
    constructor(
        public readonly authService: AuthService
    ) { }

    private handleHerror = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Internal server error' })
    }

    registerUser = (req: Request, res: Response) => {

        const [error, registerUserDto] = RegisterUserDto.create(req.body)
        if (error) return res.status(400).json({ error })

        this.authService.registerUser(registerUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleHerror(error, res))
    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body)
        if (error) return res.status(400).json({ error })

        this.authService.loginUser(loginUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleHerror(error, res))
    }

    validateEmail = (req: Request, res: Response) => {

        const { token } = req.params

        this.authService.validateEmail(token)
            .then(() => res.json('Email validated'))
            .catch(error => this.handleHerror(error, res))
    }
}