import express from 'express'
import * as ResultValidation from "../Validations/ResultValidation.js"
import * as TeacherValidation from "../Validations/teacherValidation.js"
import { teacher_login, get_all_teachers, single_teacher, search_teacher, post_result, get_students, get_results, update_teacher_password, get_my_class, post_attendance, post_assignment, post_ca, post_exam } from "../controllers/TeacherController.js"
import { teacherProtect } from '../middlewares/auth_handlers.js'
const router = express.Router()

router.route('/')
    .get(get_all_teachers)
router.route('/getstudents').post(teacherProtect, get_students)
router.route('/login').post(TeacherValidation.signin, teacher_login)
router.route('/search').get(search_teacher)
router.route('/result')
    .post(ResultValidation.post, teacherProtect, post_result)
router.route('/getresult')
    .post(teacherProtect, get_results)
router.route('/attendance')
    .post(teacherProtect, post_attendance)
router.route('/assignment')
    .post(teacherProtect, post_assignment)
router.route('/ca')
    .post(teacherProtect, post_ca)
router.route('/exam')
    .post(teacherProtect, post_exam)
router.route('/updatepassword/:id')
    .patch(TeacherValidation.updatePassword, teacherProtect, update_teacher_password)
router.route('/:id').get(single_teacher)
router.route('/class/:id').get( get_my_class)

export default router