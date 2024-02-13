import asyncHandler from 'express-async-handler'
import Session from '../models/Session.js'
import Term from '../models/Term.js'
import Event from '../models/event.js'

export const create_session = asyncHandler(async (req, res, next) => {
    try{
        const {
            from,
            to,
        } = req.body
        const sessionExists = await Session.find({ $or: [{ from }, { to }] })

        if (sessionExists.length > 0) {
            throw new Error('Sorry, a session starts or ends with this year')
        }
        const session = await Session.create({
            from,
            to,
        })
        if (session) {
            res.status(201).json({
                message: 'session has been created successfully',
                status: 'ok',
                data: session,
            })
        } else {
            res.status(400)
            throw new Error('Invalid data provided.')
        }
    } catch (error) {
		next(error);
	}
})

export const create_term = asyncHandler(async (req, res, next) => {
    try{
        const {
            session,
            tname
        } = req.body
        const termExists = await Term.find({$and: [{ session }, { tname }]})

        if (termExists.length > 0) {
            throw new Error('Sorry, this term exists already')
        }
        const term = await Term.create({
            session,
            tname
        })
        if (term) {
            res.status(201).json({
                message: 'term has been created successfully',
                status: 'ok',
                data: term,
            })
        } else {
            res.status(400)
            throw new Error('Invalid data provided.')
        }
    } catch (error) {
		next(error);
	}
})

export const create_event = asyncHandler(async (req, res, next) => {
    try{
        const {
            esession,
            term,
            month,
            day,
            event
        } = req.body
        
        const eve = await Event.create({
            esession,
            term,
            month,
            day,
            event
        })
        if (eve) {
            res.status(201).json({
                message: 'event has been created successfully',
                status: 'ok',
                data: eve
            })
        } else {
            res.status(400)
            throw new Error('Invalid data provided.')
        }
    } catch (error) {
		next(error);
	}
})

export const get_all_session = asyncHandler(async(req, res, next) => {
    try{
        const calendar = await Session.find({})
        const term = await Term.find({})
        res.json({
            status: "ok",
            message: "session retrieved",
            data: {
                calendar,
                term
            }
        })
    } catch (error) {
		next(error);
	}
})

export const get_term = asyncHandler(async(req, res, next) => {
    try{
        const { session } = req.body

        const term = await Term.find({ session })
        res.json({
            status: "ok",
            message: "terms retrieved successfully",
            data: term 
        })
    } catch (error) {
		next(error);
	}
})

export const get_session_and_term = asyncHandler(async(req, res, next) => {
    try{
        const { page, page1, page2, pageSize } = req.query;
        const session = await Session.find({})
            .skip((page2 - 1) * pageSize)
            .limit(pageSize);
        const term = await Term.find({})
            .populate('session', 'from to')
            .skip((page1 - 1) * pageSize)
            .limit(pageSize);
        const event = await Event.find({})
            .populate('esession', 'from to')
            .populate('term', 'tname')
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const totalEvents = await Event.countDocuments();
        const totalPages = Math.ceil(totalEvents / pageSize);
        const totalTerms = await Term.countDocuments();
        const totalPages1 = Math.ceil(totalTerms / pageSize);
        const totalSessions = await Session.countDocuments();
        const totalPages2 = Math.ceil(totalSessions / pageSize);

        res.json({
            status: "ok",
            message: "retrieved successfully",
            data: {
                term,
                session,
                event,
                totalEvents, 
                currentPage: Number(page),
                totalPages,
                totalTerms,
                currentPage1: Number(page1),
                totalPages1,
                totalSessions,
                currentPage2: Number(page2),
                totalPages2,
            }
        })
    } catch (error) {
		next(error);
	}
})

export const search_calendar = asyncHandler(async (req, res, next) => {
    try{
        const pipeline = [
            {
            $match: {},
            }
        ];
        
        const session = await Session.aggregate(pipeline);
        const term = await Term.aggregate(pipeline);
        const sessionIds = term.map(t => t.session);
        const populatedTerms = await Term.populate(term, { path: 'session', select: 'from to' });

        const event = await Event.aggregate(pipeline);
        const sessionIds2 = event.map(t => t.session);
        const populatedTerms2 = await Event.populate(event, { path: 'esession', select: 'from to' });
        const sessionIds3 = event.map(t => t.session);
        const populatedTerms3 = await Event.populate(event, { path: 'term', select: 'tname' });

        if (session) {
            res.status(201).json({
                message: 'search result',
                status: 'ok',
                data: {
                    session,
                    term,
                    event
                }
            })
        } else {
            throw new Error('search does not exist')
        }
    } catch (error) {
		next(error);
	}
})

export const main_calendar = asyncHandler(async (req, res, next) => {
    try{
        const calendar = await Event.aggregate([
            {
                $lookup: {
                  from: 'sessions',
                  localField: 'esession',
                  foreignField: '_id',
                  as: 'esessionDetails',
                },
              },
              {
                $unwind: '$esessionDetails',
              },
              {
                $lookup: {
                  from: 'terms',
                  localField: 'term',
                  foreignField: '_id',
                  as: 'termDetails',
                },
              },
              {
                $unwind: '$termDetails',
              },
              {
                $group: {
                  _id: {
                    esession: '$esessionDetails',
                    term: '$termDetails',
                    month: '$month',
                  },
                  details: { $addToSet: '$$ROOT' },
                },
              },
              {
                $group: {
                  _id: {
                    esession: '$_id.esession',
                    term: '$_id.term',
                  },
                  months: {
                    $addToSet: {
                      month: '$_id.month',
                      details: '$details',
                    },
                  },
                },
              },
              {
                $group: {
                  _id: '$_id.esession',
                  terms: {
                    $addToSet: {
                      id: '$_id.term',
                      months: '$months',
                    },
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  sessions: {
                    $push: {
                      esession: '$_id',
                      terms: '$terms',
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  sessions: 1,
                },
              },
        ]);
        // {
        //     $group: {
        //       _id: {
        //         esession: '$esession',
        //         term: '$term',
        //         month: '$month',
        //       },
        //       details: { $addToSet: '$$ROOT' },
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: {
        //         esession: '$_id.esession',
        //         term: '$_id.term',
        //       },
        //       months: {
        //         $addToSet: {
        //           month: '$_id.month',
        //           details: '$details',
        //         },
        //       },
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: '$_id.esession',
        //       terms: {
        //         $addToSet: {
        //           id: '$_id.term',
        //           months: '$months',
        //         },
        //       },
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: null,
        //       sessions: {
        //         $push: {
        //           esession: '$_id',
        //           terms: '$terms',
        //         },
        //       },
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 0,
        //       sessions: 1,
        //     },
        //   },
        if (calendar) {
            res.status(201).json({
                message: 'search result',
                status: 'ok',
                data: calendar[0]
            })
        } else {
            throw new Error('search does not exist')
        }
    } catch (error) {
		next(error);
	}
})