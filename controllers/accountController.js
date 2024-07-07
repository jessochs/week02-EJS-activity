const utilities = require("../utilities/");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Register",
      nav,
      errors: null,
    })
  }
  

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registration", {
        title: "Registration",
        nav,
      })
    }
}


/* ****************************************
 *  Process login request
 * ************************************ */

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 
}

/* ****************************************
 *  Account management view
 * ************************************ */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

  /* ****************************************
*  Manage account and password view
* *************************************** */
async function accountManageView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Edit Account
 * ************************** */

async function editAccount(req, res, next) {
 let nav = await utilities.getNav()
 const account_id = parseInt(req.params.account_id)
 const itemData = await accountModel.getAccountByAccountId(account_id)
  
 res.render("account/update-account", {
  title: "Edit Account",
  nav, 
  errors: null,
  account_id: itemData.account_id,
  account_firstname: itemData.account_firstname,
  account_lastname: itemData.account_lastname,
  account_email: itemData.account_email,

 })
}

/* ***************************
 *  Update Account
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if(result) {
    const name = result.account_firstname + " " + result.account_lastname
    req.flash("notice", `The ${name} account was successfully updated.`)
    res.redirect("/account")
  } else {
    const name = `${account_firstname}`
    req.flash("notice", "The update failed. Please try again.")
      res.status(501).render("account/update-account", {
        title: "Edit" + name,
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
  }
}

/* ***************************
 *  Edit Password
 * ************************** */
async function editPassword(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const itemData = await accountModel.getAccountByAccountId(account_id)
  res.render("account/update-account", {
    title: "Edit Password",
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_password: itemData.account_password,
  })
}

/* ***************************
 *  Update Password
 * ************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_password,
  } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    response.status(500).render("account/update-account", {
      title: "Edit Password",
      nav,
      errors: null,
    })
  }

  const result = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  )

  if(result) {
    req.flash("notice", "Your password change was succcessful.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed, please try again.")
    res.status(501).render("account/update-account", {
      title: "Edit Passsword",
      nav,
      errors: null,
      account_id,
      account_password,
    })
  }
}



/* ****************************************
 *  Logout
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
  res.send("Logout was successful")
}

  
module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildManagement, accountManageView, editAccount, updateAccount, editPassword, updatePassword, accountLogout }