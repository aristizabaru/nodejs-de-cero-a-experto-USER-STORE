import { Request, Response } from "express"
import { CreateProductoDto, CustomError, PaginationDto } from "../../domain"
import { ProductService } from "../services"


export class ProductController {

    // Dependency Inyection
    constructor(
        private readonly productService: ProductService
    ) { }

    private handleHerror = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Internal server error' })
    }

    createProduct = (req: Request, res: Response) => {

        const [error, createProductDto] = CreateProductoDto.create({
            ...req.body,
            user: req.body.user.id
        })
        if (error) return res.status(400).json({ error })

        this.productService.createProduct(createProductDto!)
            .then(product => res.status(201).json(product))
            .catch(error => this.handleHerror(error, res))
    }

    getProducts = (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.params
        const [error, paginationDto] = PaginationDto.create(+page, +limit)
        if (error) return res.status(400).json({ error })

        this.productService.getProducts(paginationDto!)
            .then(products => res.status(201).json(products))
            .catch(error => this.handleHerror(error, res))
    }

}