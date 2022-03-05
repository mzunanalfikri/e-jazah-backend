const path = require('path')
const testing = require('../services/testing.service')

async function testingGet(req, res, next) {
    res.json("lalalal")
    console.log(path.join(__dirname))
    return
  }

async function getUserById(req, res, next){
    try {
        res.json(await testing.getUserByID(req.params.id));
      } catch (err) {
        console.error(`Error while get user by id :`, err.message);
        next(err);
      }
}

module.exports = {
    testingGet, 
    getUserById
}