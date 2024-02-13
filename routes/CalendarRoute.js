import express from 'express'
import { create_event, create_session, create_term, get_all_session, get_session_and_term, get_term, main_calendar, search_calendar } from '../controllers/CalendarController.js'
import { adminProtect } from '../middlewares/auth_handlers.js'
import * as CalendarValidation from "../Validations/calendarValidation.js"

const router = express.Router()

router.route('/')
router.route('/session')
    .post(CalendarValidation.create_session, adminProtect, create_session)
    .get(get_all_session)
router.route('/term')
    .post(CalendarValidation.create_term, adminProtect, create_term)
router.route('/event')
    .post(CalendarValidation.create_event, adminProtect, create_event)
router.route('/getterm')
    .post(get_term)
router.route('/gettands')
    .get(get_session_and_term)
router.route('/searchcalendar')
    .get(search_calendar)
router.route('/maincalendar')
    .get(main_calendar)

export default router
