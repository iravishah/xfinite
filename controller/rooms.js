const _ = require('lodash');
const moment = require('moment');

const m = require('../responses/responses.json');

const { reply } = require('../lib/utils');
const { bookRoom, getRooms, removeDoc, getRoomCount, getBookedRooms } = require('../db/mongoUtils');
/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function validateDate(req, res, next) {
  const startDate = moment(req.body.start_date);
  const endDate = moment(req.body.end_date);

  if (startDate.isAfter(endDate)) {
    return reply(res, m.m106);
  }

  const days = startDate.diff(moment(), 'days');

  if (days >= 180) {
    return reply(res, m.m104)
  }
  next();
}
/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getRoomsList(req, res, next) {
  const [err, rooms] = await getRooms();
  if (err || !rooms || !rooms.length) {
    return reply(res, m.m105);
  }
  const type = req.body.room_type || req.query.room_type;
  const room = _.find(rooms, { type });
  if (!room) {
    return reply(res, m.m105);
  }
  req.room = room;
  next();
}

/**
 * Creating every booking as new single entry which maskes our query faster to search for available rooms
 */

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function reseveRoom(req, res, next) {
  const room = req.room;
  const data = {
    title: room.title,
    type: room.type,
    price: room.price,
    features: room.features,
    user_uid: req.body.user_uid,
    booking_from: new Date(req.body.start_date),
    booking_to: new Date(req.body.end_date),
    expiresAt: new Date(req.body.end_date)
  }

  const [err, doc] = await bookRoom(data);
  if (err) {
    return reply(res, m.m102);
  }
  req.bookingInfo = doc;
  next();
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function checkIfRoomAvailable(req, res, next) {
  const q = {
    $or: [
      {
        booking_from: {
          $lte: new Date(req.body.start_date)
        },
        booking_to: {
          $gte: new Date(req.body.start_date)
        }
      },
      {
        booking_from: {
          $lte: new Date(req.body.end_date)
        },
        booking_to: {
          $gte: new Date(req.body.end_date)
        }
      },
      {
        booking_from: {
          $gte: new Date(req.body.start_date)
        },
        booking_to: {
          $lte: new Date(req.body.end_date)
        }
      }
    ]
  }

  const [err, count] = await getRoomCount(q);
  if (err) {
    return reply(res, m.m102);
  }
  if (req.room.qty - count < 0) {
    removeDoc({ uid: req.bookingInfo.uid });
    return reply(res, m.m105);
  }

  res.status(200).json(req.bookingInfo);
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getRoomsAvailability(req, res, next) {
  if (!req.query || !req.query.start_date || !req.query.end_date || !req.query.room_type) {
    return reply(res, m.m107);
  }

  const startDate = moment(req.query.start_date);
  const endDate = moment(req.query.end_date);

  if (startDate.isAfter(endDate)) {
    return reply(res, m.m106);
  }

  const q = {
    type: req.query.room_type,
    $or: [
      {
        booking_from: {
          $lte: new Date(req.query.start_date)
        },
        booking_to: {
          $gte: new Date(req.query.start_date)
        }
      },
      {
        booking_from: {
          $lte: new Date(req.query.end_date)
        },
        booking_to: {
          $gte: new Date(req.query.end_date)
        }
      },
      {
        booking_from: {
          $gte: new Date(req.query.start_date)
        },
        booking_to: {
          $lte: new Date(req.query.end_date)
        }
      }
    ]
  };

  const [err, count] = await getRoomCount(q);
  if (err) {
    return reply(res, m.m102);
  }
  res.status(200).json({ available_rooms: req.room.qty - count });
}
/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getBookingInfo(req, res, next) {
  const user_uid = req.params.userId;
  const uid = req.params.bookingId;

  const q = {
    uid,
    user_uid
  }

  const [err, docs] = await getBookedRooms(q);
  if (err) {
    return reply(res, m.m102);
  }
  return res.status(200).json(docs[0]);
}
/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getBookings(req, res, next) {
  const user_uid = req.params.userId;

  const q = {
    user_uid
  }

  const [err, docs] = await getBookedRooms(q);
  if (err) {
    return reply(res, m.m102);
  }
  return res.status(200).json(docs);
}


module.exports = {
  validateDate,
  getRoomsList,
  reseveRoom,
  checkIfRoomAvailable,
  getRoomsAvailability,
  getBookingInfo,
  getBookings
}