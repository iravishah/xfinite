//@ts-check
"use strict";

const schema = require('validate');

module.exports = schema({
  room_type: {
    type: 'string',
    required: true,
    message: 'room_type is required'
  },
  start_date: {
    type: 'string',
    required: true,
    message: 'start_date is required'
  },
  end_date: {
    type: 'string',
    required: true,
    message: 'end_date is required'
  },
  user_uid: {
    type: 'string',
    required: true,
    message: 'user_uid is required'
  }
});