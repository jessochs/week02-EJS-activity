const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");
const invController = require("../controllers/invController");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
router.post('/registration', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

 

  //route for inventory management view
  router.get("/invManagement", utilities.handleErrors(invController.viewManagement))

//route for account management
router.get("/account-manage", utilities.handleErrors(accountController.accountManageView))

  //edit account route
  router.get("/edit/:account_id", utilities.handleErrors(accountController.editAccount))

  //update account route
  router.post("/update-account/", regValidate.accountRules(), regValidate.checkAccountData, utilities.handleErrors(accountController.updateAccount))


//edit password route
router.get("/editPass/:account_id", utilities.handleErrors(accountController.editPassword))

//update password route

router.post("/update-password/", regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword))

//route to logout
 router.get("/logout", utilities.handleErrors(accountController.accountLogout))

//edit/update review routes
router.get("/edit-review/:review_id", utilities.handleErrors(accountController.editReview))
router.post("/edit-review", utilities.handleErrors(accountController.updateReview))

//delete review
router.get("/delete/:review_id", utilities.handleErrors(accountController.deleteReview))
module.exports = router;