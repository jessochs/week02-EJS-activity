const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by single vehicle view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getVehicleByInventoryId(inv_id);
  
  // Log the vehicle data to the console for debugging
  console.log('Vehicle data:', data);

  const detail = await utilities.buildVehicleDetail(data[0]);
  let nav = await utilities.getNav();
  const make = data[0].inv_make;
  const model = data[0].inv_model;
  const year = data[0].inv_year;
  const classname = year + " " + make + " " + model;
  res.render("./inventory/vehicle-details", {
    title: classname,
    nav,
    detail,
  });
};


module.exports = invCont;