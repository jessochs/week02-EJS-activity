const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
router.post('/registration', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;