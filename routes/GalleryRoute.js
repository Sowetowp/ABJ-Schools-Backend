import express from 'express'
import { admin_search_gallery, create_gallery, get_all_images } from '../controllers/GalleryController.js'
import { adminProtect } from '../middlewares/auth_handlers.js'
const router = express.Router()

router.route('/')
    .post(create_gallery)
    .get(get_all_images)
router.route('/searchimages')
    .get(adminProtect, admin_search_gallery)

export default router