import jwt from 'jsonwebtoken'
import { envs } from './env.adapter'

const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {
    static generateToken(payload: any, duration: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null)

                resolve(token)
            })
        })
    }

    static validateToken(token: string) {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if (error) return resolve(null)

                resolve(decoded)
            })
        })
    }
}