const Promise = require('bluebird');
const express = require('express');
const Sequelize = require('sequelize');
const moment = require('moment');

const Plans = require('../models/plans');
const Travels = require('../models/travels');
const transportations = require('../models/transportations');
const attractions = require('../models/attractions');
const accommodates = require('../models/accommodates');

const kakaoToken = require('../middlewares/kakaoToken');

const router = express.Router();
const { Op } = Sequelize;

//사용자의 여행 일정 출력
router.get('/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { year, month, day } = req.params;

  Plans.findAll({
    where: {
      memberId: member.id,
      date: `${year}-${month}-${day}`,
    },
    order:[['order', 'asc']],
  })
  .then((plans) => Promise.map(plans, (plan) => {
    return Promise.resolve()
      .then(() => {
        if (plan.attributeType === 'accomodate') {
          return accommodates.findById(plan.attributeId);
        }
        if (plan.attributeType === 'attraction') {
          return attractions.findById(plan.attributeId);
        }
        if (plan.attributeType === 'transportation') {
          return transportations.findById(plan.attributeId);
        }
      })
      .then((attribute) => {
        const attributeObject = attribute.get({ plain: true });
        attributeObject.date = plan.date;
        attributeObject.order = plan.order;
        attributeObject.attributeType = plan.attributeType;

        return attributeObject;
      });
  }))
  .then((result) => {
    res.send(result);
  })
  .catch(next);
});

//작성하기
router.post('/write', kakaoToken, (req,res,next) => {
  const { member } = req;

  const {
    sort, date, titleId, title, address, tel, origin,
    destination, way, route, time,
  } = req.body;

  Promise.resolve()
    .then(() => {
      if (sort === 'accommodate') {
        return accommodates.create({
          title,
          address,
          tel
        });
      }
      if (sort === 'attraction') {
        return attractions.create({
          title,
          address,
          tel
        });
      }
      if (sort === 'transportation') {
        return transportations.create({
          origin,
          destination,
          way,
          route,
          time
        });
      }
    })
    .then((result) => {
      return plan.create({
        date,
        memberId: member.id,
        titleId: result.id,
        attributeType: sort,
        attributeId: result.id,
      });
    })
    .catch(next);
});

module.exports = router;
