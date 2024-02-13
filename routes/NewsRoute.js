import express from 'express'
import { admin_search_news, create_news, get_all_news } from '../controllers/NewsController.js'
import { adminProtect } from '../middlewares/auth_handlers.js'

const router = express.Router()

router.route('/')
    .post(create_news)
    .get(get_all_news)
router.route('/searchnews')
    .get(adminProtect, admin_search_news)
 
export default router
