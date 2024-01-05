import { ProductModel } from "../../data";
import { CreateProductoDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {

    constructor() { }

    async createProduct(createProductDto: CreateProductoDto) {

        const productExists = await ProductModel.findOne({ name: createProductDto.name })
        if (productExists) throw CustomError.badRequest('Product already exists')

        try {
            const product = new ProductModel({
                ...createProductDto
            })

            await product.save()

            return product

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getProducts(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto

        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ])

            return {
                page: page,
                limit: limit,
                total: total,
                next: (page < total / limit) ? `api/categories?page=${page + 1}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `api/categories?page=${page - 1}&limit=${limit}` : null,
                products
            }
        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }

    }
}