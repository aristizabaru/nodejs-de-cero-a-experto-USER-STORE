import { Request, Response, Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CategoryService } from '../services/category.serv';

export class CategoryRoutes {

    static get routes(): Router {

        const router = Router();
        const categoryService = new CategoryService()
        const controller = new CategoryController(categoryService)

        // Definir las rutas
        router.get('/', controller.getCategories);
        router.post('/', [AuthMiddleware.validateJwt], controller.createCategory);

        return router;
    }

}

