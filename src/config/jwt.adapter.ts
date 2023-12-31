import jwt from 'jsonwebtoken'
import { envs } from './env.adapter'

const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {

    // ! Cambiar duración del token por defecto a 2h
    static generateToken(payload: any, duration: string = '24h') {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null)

                resolve(token)
            })
        })
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if (error) return resolve(null)

                resolve(decoded as T)
            })
        })
    }
}