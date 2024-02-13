import mongoose from 'mongoose'

const calendarSchema = mongoose.Schema(
	{
		from: { type: String, require: true},
    to: {type: String, require: true},
    term: [
      {months: [
          {
            month: { type: String, required: true },
            days: [{ type: String }],
            events: [{ type: String }],
          },
        ],
        position: { type: String }
      },
    ]
	}
)

const Calendar = mongoose.model('Calendar', calendarSchema)

export default Calendar
