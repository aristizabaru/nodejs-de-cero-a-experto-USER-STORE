import { Router } from 'express';
import { ImageController } from './controller';

export class ImagesRoutes {

    static get routes(): Router {

        const router = Router();
        const controller = new ImageController

        // Definir las rutas
        router.get('/:type/:img', controller.getImage);

        return router;
    }

}

