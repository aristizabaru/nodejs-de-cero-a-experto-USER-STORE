import { Validators } from "../../../config"

export class CreateProductoDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // ID
        public readonly category: string, // ID
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateProductoDto?] {

        const {
            name,
            available,
            price,
            description,
            user,
            category,
        } = props

        let availableBoolean = available

        if (!name) return ['Missing name']
        if (!category) return ['Missing category ID']
        if (!Validators.isMongoID(category)) return ['Invalid category ID']
        if (!user) return ['Missing user']
        if (!Validators.isMongoID(user)) return ['Invalid user ID']
        if (typeof available !== 'boolean') {
            availableBoolean = (available === 'true')
        }

        return [undefined, new CreateProductoDto(
            name,
            availableBoolean,
            price,
            description,
            user,
            category,
        )]

    }
}