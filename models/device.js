const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const  = sequelize.define('device',{
  memberId:{
    type:Sequelize.INTAGER,
    references:{
      model:members,
      key:'id'
    }
  },
  deviceId:{
    type:Sequelize.STRING
  },
  lastLocation:{
    type:Sequelize.STRING
  }
});

module.exports = device;
