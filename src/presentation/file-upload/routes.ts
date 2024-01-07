import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware';
import { TypeMiddleware } from '../middleware/type.middleware';

export class FileUploadRoutes {

    static get routes(): Router {

        const router = Router();
        const fileUploadService = new FileUploadService()
        const controller = new FileUploadController(fileUploadService)

        // Files middleware
        router.use([
            FileUploadMiddleware.containFiles,
            TypeMiddleware.validTypes(['users', 'products', 'categories'])
        ])

        // Definir las rutas
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFiles);

        return router;
    }

}

