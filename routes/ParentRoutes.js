import express from 'express'
import { parentProtect } from '../middlewares/auth_handlers.js'
import { parent_login, update_parent_password, view_attendance } from '../controllers/ParentController.js'
import { get_self, view_results } from '../controllers/StudentController.js'
import * as ParentValidation from "../Validations/parentValidation.js"

const router = express.Router()

router.route('/')
    .post(ParentValidation.signin, parent_login)
router.route('/result')
    .post(parentProtect, view_results)
router.route('/attendance')
    .post(parentProtect, view_attendance)
router.route('/self')
    .post(parentProtect, get_self)

router.route('/updatepassword/:id')
    .patch(ParentValidation.updatePassword, parentProtect, update_parent_password)

export default router