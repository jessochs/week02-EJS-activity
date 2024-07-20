const utilities = require("../utilities/");
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model");
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
  
  const data = await accountModel.getReviewByAccountId(res.locals.accountData.account_id);
  let review = await utilities.buildAccountReview(data);
  

  // console.log('review data', data);

  res.render("account/management", {
    title: "Account Management",
    nav,
    review,
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

/* ***************************
 *  Edit Review
 * ************************** */
async function editReview(req, res, next) {
  let nav = await utilities.getNav()
  const review_id = parseInt(req.params.review_id)
  const reviewData = await accountModel.getReviewByReviewId(review_id)
  console.log('ReviewData', reviewData)
  
  const invData = await invModel.getVehicleByInventoryId(reviewData[0].inv_id)
  console.log('inventory data', invData)
  const name = 'Edit' + ' ' + invData[0].inv_year + ' ' + invData[0].inv_model;
  
  let formattedDate = reviewData[0].review_date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  res.render("account/edit-review", {
    title: name,
    nav,
    reviewData,
    errors: null,
    review_id: reviewData[0].review_id,
    formattedDate,
    review_text: reviewData[0].review_text,
    inv_id: reviewData[0].inv_id,
    account_id: reviewData[0].account_id

  })
}

/* ***************************
 *  Update Review
 * ************************** */
async function updateRpeview(req, res) {
  let nav = await utilities.getNav();
  const reviewData = await accountModel.getReviewByReviewId(review_id)
  let formattedDate = reviewData[0].review_date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const {
    review_id,
    review_text,
    
  } = req.body

  const result = await accountModel.updateReview(
    review_id,
    review_text,
    
  )

  if(result) {
    req.flash("notice", `Review ${result.review_id} was updated`)
    res.redirect("/account/")
  } else{
    req.flash("notice", "The review update failed.")
    res.status(501).render("/account/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      reviewData,
      review_id,
      formattedDate,
      review_text,
      inv_id,
      account_id,
    })
  }

}

async function updateReview(req, res) {
  // Destructure the necessary variables from the request body
  const { review_id, review_text, inv_id, account_id } = req.body;

  // Initialize the nav variable
  let nav;
  try {
    // Fetch the navigation data
    nav = await utilities.getNav();

    // Fetch the review data by review_id
    const reviewData = await accountModel.getReviewByReviewId(review_id);

    // Format the review date
    let formattedDate = reviewData[0].review_date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Update the review in the database
    const result = await accountModel.updateReview(review_id, review_text);

    // Check if the update was successful
    if (result) {
      req.flash("notice", `Review ${review_id} was updated`);
      res.redirect("/account/");
    } else {
      req.flash("notice", "The review update failed.");
      res.status(501).render("account/edit-review", {
        title: "Edit Review",
        nav,
        errors: null,
        reviewData,
        review_id,
        formattedDate,
        review_text,
        inv_id,
        account_id,
      });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    req.flash("notice", "An error occurred while updating the review.");
    res.status(500).render("account/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      reviewData: [],
      review_id,
      formattedDate: "",
      review_text: "",
      inv_id,
      account_id,
    });
  }
}

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(req, res, next) {
  let nav = utilities.getNav()

  const review_id = parseInt(req.params.review_id)
  const reviewData = accountModel.getReviewByReviewId(review_id)
  console.log('Review Data', reviewData)
  const invData = await invModel.getVehicleByInventoryId(reviewData[0].inv_id)
  console.log('inventory data', invData)
  const name = invData[0].inv_year + ' ' + invData[0].inv_model;
  
  let formattedDate = reviewData[0].review_date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  res.render("./account/delete", {
    title: "Delete" + ' ' + name,
    nav,
    errors:null,
    reviewData,
    formattedDate,
    // inv_id: reviewData[0].inv_id,
    // review_id: reviewData[0].review_id,
    // formattedDate: formattedDate,
    // review_text: reviewData[0].review_text,
  })
}


  
module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildManagement, accountManageView, editAccount, updateAccount, editPassword, updatePassword, accountLogout, editReview, updateReview, deleteReview}