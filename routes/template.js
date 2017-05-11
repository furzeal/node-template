const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// template
router.get('/', function (req, res) {
    var obj = {title: "Шаблон"};
    const Model = mongoose.model('template');
    Model.find().then(articles => {
        Object.assign(obj,{articles:articles});
        res.render('pages/template', obj);
    });
});

module.exports = router;

