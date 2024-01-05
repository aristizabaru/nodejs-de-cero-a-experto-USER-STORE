import { Request, Response } from "express"
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain"
import { CategoryService } from "../services"


export class CategoryController {

    // Dependency Inyection
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    private handleHerror = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Internal server error' })
    }

    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body)
        if (error) return res.status(400).json({ error })

        this.categoryService.createCategory(createCategoryDto!, req.body.user)
            .then(category => res.status(201).json(category))
            .catch(error => this.handleHerror(error, res))
    }

    getCategories = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query
        const [error, paginationDto] = PaginationDto.create(+page, +limit)
        if (error) return res.status(400).json({ error })


        this.categoryService.getCategories(paginationDto!)
            .then(categories => res.json(categories))
            .catch(error => this.handleHerror(error, res))
    }

}