const invModel = require("../models/inventory-model")
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



// Util.buildVehicleDetail = async function (data){
//   let detail
//   detail = `
//   <h2>Price: ${data.inv_price}</h2>
  
//   `
//   console.log('Vehicle data', detail)
// }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util