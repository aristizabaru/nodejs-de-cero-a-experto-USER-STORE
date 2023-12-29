import { userModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

    // Dependency Inyection
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await userModel.findOne({ email: registerUserDto.email })

        if (existUser) throw CustomError.badRequest('Email already exist')

        try {

            const user = new userModel(registerUserDto)
            await user.save()

            //* Encriptar contraseña

            //* JWT <--- para mantener la autenticación del usuario

            //* Email de confirmación
            const { password, ...userEntity } = UserEntity.fromObject(user)

            return {
                user: userEntity,
                token: 'ABC'
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }
}