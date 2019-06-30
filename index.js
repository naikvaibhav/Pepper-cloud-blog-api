const express = require('express')
const appConfig = require('./config/appConfig')
const fs = require('fs')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const globalErrorMidddleware = require('./middlewares/appErrorHandler')
const routeLoggerMiddleware = require('./middlewares/routeLogger')


//creating an instance of express
const app = express()


//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


//middleware
app.use(globalErrorMidddleware.globalErrorHandler)
app.use(routeLoggerMiddleware.logIp)


//bootstrap models: used for checking if the data is as per described schema models
let modelsPath = './models'
fs.readdirSync(modelsPath).forEach(function(file){
    if (~file.indexOf('.js')){
        console.log(file)
        require(modelsPath + '/' + file)
    }
})//end bootstrap models



// Bootstrap route: used for checking if .js extensions file are present in routes folder
let routesPath = './routes'
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        console.log("including the following file");
        console.log(routesPath + '/' + file)
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
});
// end bootstrap route


//global notfound error handler should be called after routes

app.use(globalErrorMidddleware.globalNotFoundHandler)
//end global 404 handler


//listening the server - creating a local server
app.listen(appConfig.port, () => {
    console.log('Example app listening on port 3000!');
    //creating the mongo db connection here
    let db = mongoose.connect(appConfig.db.uri);

})


// handling mongoose connection error
mongoose.connection.on('error', function (err) {
    console.log('database connection error');
    console.log(err)

}); // end mongoose connection error

// handling mongoose success event
mongoose.connection.on('open', function (err) {
    if (err) {
        console.log("database error");
        console.log(err);

    } else {
        console.log("database connection open success");
    }

}); // end mongoose connection open handler