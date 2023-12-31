import { HashAdapter, JwtAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.serv";

export class AuthService {

    // Dependency Inyection
    constructor(
        private readonly emailService: EmailService
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if (existUser) throw CustomError.badRequest('Email already exist')

        try {

            const user = new UserModel(registerUserDto)
            // Encriptar contraseña
            user.password = HashAdapter.hash(registerUserDto.password)
            await user.save()

            // Email de confirmación
            await this.sendEmailValidationLink(user.email)

            const { password, ...userEntity } = UserEntity.fromObject(user)

            // JWT
            const token = await JwtAdapter.generateToken({
                id: user.id
            })
            if (!token) throw CustomError.internalServer('Error while creating JWT')

            return {
                user: userEntity,
                token: token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email })
        if (!user) throw CustomError.badRequest('Email does not exist')

        const isMatching = HashAdapter.compare(loginUserDto.password, user.password)
        if (!isMatching) throw CustomError.badRequest('Password is not valid')

        const { password, ...userEntity } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({
            id: user.id
        })
        if (!token) throw CustomError.internalServer('Error while creating JWT')

        return {
            user: userEntity,
            token: token
        }
    }

    public validateEmail = async (token: string) => {
        const payload = await JwtAdapter.validateToken(token)
        if (!payload) throw CustomError.unauthorized('Invalid token')

        const { email } = payload as { email: string }
        if (!email) throw CustomError.internalServer('Email not in token')

        const user = await UserModel.findOne({ email })
        if (!user) throw CustomError.internalServer('Email does not exist')

        user.emailValidated = true

        await user.save()

        return true
    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email })
        if (!token) throw CustomError.internalServer('Error getting token')

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`
        const html = `
            <h1>Validate your Email</h1>
            <p>Click on the following link validate your email</p>
            <a href="${link}">Validate your email</a>
        `

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options)
        if (!isSent) throw CustomError.internalServer('Error sending email')

        return true
    }
}