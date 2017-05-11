'use strict';

const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Укажите заголовок статьи']
    },
    date: {
        type: String,
        required: [true, 'Укажите дату публикации']
    },
    content: {
        type: [String],
        required: [true, 'Укажите содержимое статьи']
    }
});

mongoose.model('template',blogSchema);