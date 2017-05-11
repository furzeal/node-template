const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
//const skills = require('../source/data/skills');

const isAdmin = (req, res, next) => {
    // если в сессии текущего пользователя есть пометка о том, что он является
    // администратором
    if (req.session.isAdmin) {
        //то всё хорошо :)
        return next();
    }
    //если нет, то перебросить пользователя на главную страницу сайта
    res.redirect('/');
};

// models
require('../models/user');
require('../models/template');

router.get('/', isAdmin, function (req, res) {
    var obj = {
        title: "Панель администрирования",
    };
    //Object.assign(obj, skills);
    const Model = mongoose.model('template');
    Model.find().then(skills => {
        Object.assign(obj, {skills: skills});
        res.render('pages/admin', obj);
    });
});

//при получении post-запроса по адресу /admin
router.post('/', (req, res) => {
    req.session.isAdmin = false;
    //требуем наличия логина и пароля в теле запроса
    console.log(req.body);
    console.log(req.body.password);
    if (!req.body.username || !req.body.password) {
        //если не указан логин или пароль - сообщаем об этом
        return res.json({status: 'Укажите логин и пароль!'});
    }

    //получаем модель пользователя и шифруем введенный пароль
    const Model = mongoose.model('user');
    const password = crypto.createHash('md5')
        .update(req.body.password)
        .digest('hex');

    //пытаемся найти пользователя с указанным логином и паролем
    Model.findOne({username: req.body.username, password: password}).then(item => {
        console.log(item);
        //если такой пользователь не найден - сообщаем об этом
        if (!item) {
            res.json({status: 'Логин и/или пароль введены неверно!'});
        } else {
            //если найден, то делаем пометку об этом в сессии пользователя, который сделал запрос
            req.session.isAdmin = true;
            res.json({
                status: 'Авторизация успешна!'
            });
        }
    });
});


module.exports = router;