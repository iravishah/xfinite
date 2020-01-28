//@ts-check
"use strict"

module.exports = () => {
  const express = require('express');
  const router = express.Router();

  const utility = require('../lib/utils');
  const rooms = require('../controller/rooms');

  const roomPostBody = require('../validators/roomPostBody');

  router.get('/ping',
    utility.ping
  );

  /**
   * Bookig api will book the room first and then check for the avaibilty and if exceeds booking then removes the documents.
   * This is because if multiple request comes to book rooms there is possibility where multiple request reads the available rooms as same value
   * and then there will be more bookings then actual rooms
   */

  router.post('/room-booking',
    utility.authenicate,
    utility.validateBody(roomPostBody),
    rooms.validateDate,
    rooms.getRoomsList,
    rooms.reseveRoom,
    rooms.checkIfRoomAvailable
  );

  router.get('/rooms-availability',
    utility.authenicate,
    rooms.getRoomsList,
    rooms.getRoomsAvailability
  );

  router.get('/booking-info/:userId',
    utility.authenicate,
    rooms.getBookings
  );

  router.get('/booking-info/:userId/:bookingId',
    utility.authenicate,
    rooms.getBookingInfo
  );

  router.all('*', (req, res) => {
    res.status(401).json({ error: 'Unauthorised access', code: 401 });
  });

  return router;
}
