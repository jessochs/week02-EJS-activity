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
  const inv_id = req.params.inventoryId
  const data = await invModel.getVehicleByInventoryId(inv_id)
  let nav = await utilities.getNav();
  if(data) {
    const detail = await utilities.buildVehicleDetail(data);
    const title = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/vehicle", {
    title,
    nav,
    detail,

  });
  
  };
};


module.exports = invCont;