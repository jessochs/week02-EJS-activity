const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

/* **************************************
* Build the vehicle details view HTML
* ************************************ */
// Function to build vehicle detail HTML
Util.buildVehicleDetail = async function(vehicle) {
  let vehicleDetail = '';

  if (vehicle) {
    vehicleDetail += '<div class="vehicle-detail">';
    vehicleDetail += '  <div class="vehicle-image">';
    vehicleDetail += '    <img src="' + (vehicle.inv_image || '') + '" alt="Image of ' + (vehicle.inv_make || '') + ' ' + (vehicle.inv_model || '') + '" />';
    vehicleDetail += '  </div>';
    vehicleDetail += '  <div class="vehicle-info">';
    vehicleDetail += '    <h2>' + (vehicle.inv_year || '') + ' ' + (vehicle.inv_make || '') + ' ' + (vehicle.inv_model || '') + '</h2>';
    vehicleDetail += '    <p>Price: $' + new Intl.NumberFormat('en-US').format(Number(vehicle.inv_price) || 0) + '</p>';
    vehicleDetail += '    <p>Description: ' + (vehicle.inv_description || '') + '</p>';
    vehicleDetail += '    <p>Color:' +  (vehicle.inv_color) + '</p>';
    vehicleDetail += '    <p>Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles || 0) + ' miles</p>';
    vehicleDetail += '  </div>';
    vehicleDetail += '</div>';
    
  } else {
    vehicleDetail = '<p class="notice">Sorry, no vehicle details available.</p>';
  }

  return vehicleDetail;
};



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


/* **************************************
* Classification dropdown
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check account access
 * ************************************ */
 Util.checkEmployeeAccess = (req, res, next) => {
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type
    if (account_type == "Admin" || account_type == "Employee") {
      next()
    } else {
      req.flash(
        "notice",
        "You do not have the ability to access this page."
      )
      res.redirect("account/login")
    }
  } else {
    req.flash(
      "notice",
      "You do not have the ability to access this page."
    )
    res.redirect("account/login")
  }
}

/* **************************************
* Build review 
* ************************************ */
Util.buildReviews = async function (data) {
  let reviews = "<ul class='reviews'>";

  for (const review of data) {
    let accountData = await accountModel.getAccountByAccountId(review.account_id);
    let screenName = accountData.account_firstname[0] + accountData.account_lastname;
    let formattedDate = review.review_date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    reviews += "<li>";
    reviews += "<h4>" + screenName + " wrote on " + formattedDate + "</h4>";
    reviews += "<p>" + review.review_text + "</p>";
    reviews += "</li>";
  }

  reviews += "</ul>";
  return reviews;
};

/* **************************************
* Build account reviews
* ************************************ */
Util.buildAccountReview = async function (data) {
  let reviews = "<p>";
  let reviewNum = 1;
  for (const review of data) {
    
    let formattedDate = review.review_date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    let title = reviewNum + '.' + ' ' + "Reviewed the " + ' ' + review.inv_year + " " + review.inv_model + ' ' + "on " + formattedDate 
    reviews += title
    reviews += ' | '
    reviews += '<a href="account/edit-review">Edit</a>'
    reviews += ' | '
    reviews += '<a href="account/delete-review">Delete</a>'
    reviews += "</p>"
    
    reviewNum++;
    
  }
  return reviews
  
}


module.exports = Util