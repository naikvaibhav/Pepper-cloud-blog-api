const express = require('express');
const blogController = require('../controllers/blogController');

const appConfig = require('../config/appConfig');

let setRouter = (app) => {
    let baseUrl = appConfig.apiVersion+'/blogs';

    app.get(baseUrl+'/all',blogController.getAllBlog);

    app.get(baseUrl+'/view/:blogId',blogController.viewByBlogId);

    app.post(baseUrl+'/create',blogController.createBlog);

    app.post(baseUrl+'/:blogId/delete',blogController.deleteBlog);

    app.put(baseUrl+'/:blogId/edit',blogController.editBlog);

} //end setRouter function










module.exports = {
    setRouter : setRouter
}