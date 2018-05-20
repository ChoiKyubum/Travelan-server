const Sequelize = requier('sequelize');
const Op = Sequelize.Op;

var newspeed = require('../models/newspeed');
var plan = require('../models/plan');
var favs = require('../models/favs');
var image = require('../models/image');

var express = require('express');
var router = express.Router();

//모든 게시글 출력
router.get('/', (req, res, next) => {
  newspeed.findAll(
    include:[
      model:image,
      where:{
        newspeedId:Sequelize.col('newspeed.id')
      }
    ]
  )
    .then((result) => {
      if (!result) throw Error('NO DATA');
      res.send(result);
    });
});

//게시글ID로 게시글 검색하기
//검색쿼리 질문!
router.get('/:keyword)', function(req,res,next){
  var keyword = req.params.keyword;

  newspeed.findOne({
    where: {
      id: id
    }
  })
  .then(function(result) {
    if (!result) throw Error('NO_RESULT');

    res.send(result);
  })
  .catch(next);
});

//게시글에 연관된 여행일정 출력하기
router.get('/showPlan/:id([0-9])',function(req,res,next){
  var titleId = req.params.id;

  plan.findAll({
    where:{
      titleId : titleId
    }
  })
  .then(function(result){
    if (!result) throw Error('NO DATA');

    res.send(result);
  }).catch(next);
});

//즐겨찾기 추가하기
router.post('/addFavs',function(req,res,next){
  var memberId = req.body.memberId;
  var newspeedId = req.body.newspeedId;

  favs.create({
    memberId:memberId,
    newspeedId:newspeedId
  }).then((result)=>{
    res.send(result);
  }).catch(next);

});

//내가 쓴 newspeed 삭제하기
router.post('/deleteNewspeed',function(req,res,next){
  var newspeedId = req.body.newspeedId;

  newspeed.destroy(
    where:{
      id:newspeedId
    });
});


//내가 쓴 NEWSPEED 수정하기
router.post('/editNewspeed',function(req,res,next){
  var newspeedId = req.body.newspeedId;
  var content = req.bodt.content;

  newspeed.update(
    content = content;
    where:{
      id:newspeedId
    }
  );
});

module.exports = router;
