import express from 'express'
import { studentProtect } from '../middlewares/auth_handlers.js'
import * as StudentValidation from "../Validations/studentValidation.js"
import { get_self, record_assignment, record_ca, record_exam, student_login, update_student_password, view_assignment, view_ca, view_exam, view_results } from '../controllers/StudentController.js'
const router = express.Router()

router.route('/')
    .post(StudentValidation.signin, student_login)
router.route('/result')
    .post(studentProtect, view_results)
router.route('/assignment')
    .post(view_assignment)
router.route('/recassignment')
    .post(studentProtect, record_assignment)
router.route('/ca')
    .post(view_ca)
router.route('/recca')
    .post(studentProtect, record_ca)
router.route('/exam')
    .post(view_exam)
router.route('/self')
    .post(studentProtect, get_self)
router.route('/recexam')
    .post(studentProtect, record_exam)
router.route('/updatepassword/:id')
    .patch(StudentValidation.updatePassword, update_student_password)

export default router