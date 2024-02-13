import express from 'express'
import { contact_us, news_letter } from '../controllers/MailController.js'
const router = express.Router()

router.route('/')
    .post(contact_us)
router.route('/newsletter')
    .post(news_letter)
    
export default router