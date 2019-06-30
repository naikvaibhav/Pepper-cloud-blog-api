const mongoose = require('mongoose');
//importing shortid module to shorten id creating by mongodb for each recoreds/blogs
const shortid = require('shortid');
//importing response library from libs folder to generate response after every request
const response = require('./../libs/responseLib');
//importing logger library from libs folder to log errors in the console if there is any response errors
const logger = require('./../libs/loggerLib');
//importing check library from lib folder to check if the parameter passed as a request is empty or not
const check = require('./../libs/checkLib') ;

//importing model schema
const BlogModel = mongoose.model('Blog');


//function to fetch all blogs 
let getAllBlog = (req, res) => {
    BlogModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Blog Controller: getAllBlog', 10)
                let apiResponse = response.generate(true, 'Failed To Find Blog Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: getAllBlog')
                let apiResponse = response.generate(true, 'No Blog Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Blog Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all blogs




//function to read each blog
let viewByBlogId = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Blog Not Found.')
                let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Blog found successfully","BlogController:ViewBlogById",5)
                let apiResponse = response.generate(false, 'Blog Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}//end of read each blog





//function to edit a blog
let editBlog = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        console.log(options);
        BlogModel.update({ 'blogId': req.params.blogId }, options, { multi: true }).exec((err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Blog Not Found.')
                let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Blog Edited Successfully')
                let apiResponse = response.generate(false, 'Blog Edited Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}//end of edit blog



//function to delete a blog
let deleteBlog = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.remove({ 'blogId': req.params.blogId }, (err, result) => {
            if (err) {
                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                console.log('Blog Not Found.')
                let apiResponse = response.generate(true, 'Blog Not Found.', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Blog Deletion Success')
                let apiResponse = response.generate(false, 'Blog Deleted Successfully', 200, result)
                res.send(apiResponse)
            }
        })
    }
}//end of delete blog




//function to create a blog
let createBlog = (req, res) => {
    let blogCreationFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.body.title) || check.isEmpty(req.body.description) || check.isEmpty(req.body.blogBody) || check.isEmpty(req.body.img)) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let blogId = shortid.generate()

                let newBlog = new BlogModel({

                    blogId: blogId,
                    title: req.body.title,
                    img: req.body.img,
                    description: req.body.description,
                    blogBody: req.body.blogBody,
                    isPublished: true,
                    author: req.body.name,
                    created: today,
                    lastModified: today
                }) // end new blog model

             

                newBlog.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in blog creation')
                        resolve(result)
                    }
                }) // end new blog save
            }
        }) // end new blog promise
    } // end create blog function

    // making promise call.
    blogCreationFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Blog Created successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}





module.exports = {
    getAllBlog : getAllBlog,
    viewByBlogId : viewByBlogId,
    editBlog : editBlog,
    deleteBlog : deleteBlog,
    createBlog : createBlog
} //end exports