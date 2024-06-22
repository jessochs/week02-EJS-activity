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
    errors: null,
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
    errors: null,
  });
};

/* ***************************
 *  Management View
 * ************************** */

invCont.viewManagement = async function (req, res, next) {
  let nav = await utilities.getNav(); 
  const flashMessage = req.flash('notice', "Sorry, something must have gone wrong with the management page");
  res.render('./inventory/management', {
    title: "Management",
    nav,
    flashMessage,
  })
}


/* ***************************
 *  Deliver new classificastion view
 * ************************** */

// async function buildNewClassification(req, res, next) {
//   let nav= await utilities.getNav();
//   res.render('/inv/', {
//     title: "Add New Classification",
//     nav,
//     errors: null,
//   })
// }

// /* ***************************
//  *  Deliver new inventory view
//  * ************************** */
// async function buildNewInventory(req, res, next) {
//   res.render('/inv/', {
//     title: "Add New Inventory",
//     nav,
//     errors: null,
//   })
// }

/* ***************************
 *  Process new classification
 * ************************** */

// async function registerClassification(req, res) {
//   let nav = await utilities.getNav()
//   const classification_name = req.body;
//   // do something here with flash??

//   const classResult = await invModel.registerClassification(
//     classification_name
//   )

//   if (classResult) {
//     req.flash(
//       "notice",
//       'The new classification was added.'
//     )
//     res.status(201).render("inventory/add-classification", {
//       title: "Add New CLassification",
//       nav,
//       errors: null,
//     })
//   } else{
//     req.flash("notice", "Sorry, the new classification failed.")
//       res.status(501).render("inventory/add-classification", {
//         title: "Add New Inventory",
//         nav,
//       })
//   }

// }






module.exports = invCont;
