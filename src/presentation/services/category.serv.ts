import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class CategoryService {

    constructor() { }

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {

        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name })
        if (categoryExists) throw CustomError.badRequest('Category already exists')

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save()

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getCategories(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto

        try {

            const [total, categoriesObj] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ])

            const categories = categoriesObj.map(category => ({
                id: category.id,
                name: category.name,
                available: category.available
            }))

            return {
                page: page,
                limit: limit,
                total: total,
                next: (page < total / limit) ? `api/categories?page=${page + 1}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `api/categories?page=${page - 1}&limit=${limit}` : null,
                categories: categories
            }
        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }

    }
}