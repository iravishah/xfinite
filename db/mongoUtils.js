const mongoose = require('mongoose');

require('../models/rooms');
require('../models/bookedRooms');

const BookedRooms = mongoose.model('BookedRooms');
const Rooms = mongoose.model('Rooms');

const { wait } = require('../lib/utils');
/**
 *
 *
 * @param {*} data
 * @returns promise
 */
async function bookRoom(data) {
  return await wait(BookedRooms.create, BookedRooms, data);
}
/**
 *
 *
 * @param {*} query
 * @param {*} select
 * @param {*} opts
 * @returns promise
/**
 *
 *
 * @param {*} [query={}]
 * @param {*} [select={}]
 * @param {*} [opts={}]
 * @returns
 */
async function getRooms(query = {}, select = {}, opts = {}) {
  return await wait(Rooms.find, Rooms, query, select, opts);
}
/**
 *
 *
 * @param {*} [query={}]
 * @returns
 */
async function getRoomCount(query = {}) {
  return await wait(BookedRooms.countDocuments, BookedRooms, query);
}
/**
 *
 *
 * @param {*} query
 * @returns
 */
async function removeDoc(query = {}) {
  return await wait(BookedRooms.deleteOne, BookedRooms, query);
}
/**
 *
 *
 * @param {*} [query={}]
 * @param {*} [select={}]
 * @param {*} [opts={}]
 * @returns
 */
async function getBookedRooms(query = {}, select = {}, opts = {}) {
  return await wait(BookedRooms.find, BookedRooms, query, select, opts);
}

module.exports = {
  bookRoom,
  getRooms,
  getRoomCount,
  removeDoc,
  BookedRooms,
  getBookedRooms
}