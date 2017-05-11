const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// models
require('../../models/template');

router.post('/', function (req, res) {
    let Model = mongoose.model('template');
    let item = new Model({
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
    });
    console.log(item);
    item.save().then(
        i => {
            console.log('Запись успешно добавлена!');
            res.json({status: 'Запись успешно добавлена!'})
        },
        e => {
            console.log('Ошибка при добавлении записи!');
            let error = Object.keys(e.errors)
                .map(key => e.errors[key].message)
                .join(', ');

            res.json({error: error});
        });
});

module.exports = router;