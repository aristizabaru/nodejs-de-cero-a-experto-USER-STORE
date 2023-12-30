import { HashAdapter, JwtAdapter } from "../../config";
import { userModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

    // Dependency Inyection
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await userModel.findOne({ email: registerUserDto.email })
        if (existUser) throw CustomError.badRequest('Email already exist')

        try {

            const user = new userModel(registerUserDto)
            //* Encriptar contraseña
            user.password = HashAdapter.hash(registerUserDto.password)
            await user.save()

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

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await userModel.findOne({ email: loginUserDto.email })
        if (!user) throw CustomError.badRequest('Email does not exist')

        const isMatching = HashAdapter.compare(loginUserDto.password, user.password)
        if (!isMatching) throw CustomError.badRequest('Password is not valid')

        const { password, ...userEntity } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({
            id: user.id,
            email: user.email
        })
        if (!token) throw CustomError.internalServer('Error while creating JWT')

        return {
            user: userEntity,
            token: token
        }
    }
}