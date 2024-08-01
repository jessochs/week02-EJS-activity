const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const projController = require("../controllers/projectController")

//get python page
router.get("/python", utilities.handleErrors(projController.pythonPage))

//c-sharp page
router.get("/csharp", utilities.handleErrors(projController.csharpPage))

//sql page
router.get("/sql", utilities.handleErrors(projController.sqlPage))

//pjavaScript page
router.get("/javascript", utilities.handleErrors(projController.javascriptPage))

//dotnet page
router.get("/dotNet", utilities.handleErrors(projController.dotNetPage))

// java page
router.get("/java", utilities.handleErrors(projController.javaPage))

//html page
router.get("/html", utilities.handleErrors(projController.htmlPage))

//about me page
router.get("/about", utilities.handleErrors(projController.aboutPage))

module.exports = router;