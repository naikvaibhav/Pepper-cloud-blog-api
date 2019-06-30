//importing mongoose model
const mongoose = require('mongoose');

//import schema
const Schema = mongoose.Schema;

let blogSchema = new Schema(
    {
        blogId: {
            type : String,
            unique : true  //unique is enabled to true bcz blogId must be unique
        },
        title: {
            type: String,
            default : ''
        },
        img:{
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        blogBody: {
            type: String,
            default: ''
        },
       
        isPublished: {
            type: Boolean,
            default: false
        },
       
        author: {
            type: String,
            default: ''
        },

        created: {
            type: Date,
            default: Date.now
        }, 

        lastModified: {
            type: Date,
            default: Date.now
        }

    }
)

mongoose.model('Blog', blogSchema);