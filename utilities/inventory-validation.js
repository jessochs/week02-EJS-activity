const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}



/*  **********************************
  *  Classification Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
        classificationSelect,
      })
      return
    }
    next()
  }

/*  **********************************
*  Inventory Rules
* ********************************* */
validate.vehicleRules = () => {
    return [
      
      body("classification_id")
        .trim()
        .isInt({
            no_symbols: true,
        })
        .withMessage("Vehicle classification is required."),

      body("inv_make")
        .trim()
        .escape()
        .isLength({
            min: 3,
         })
        .withMessage("Vehicle make is required."),
    
        body("inv_model")
        .trim()
        .escape()
        .isLength({
            min: 3,
         })
        .withMessage("Vehicle model is required."),

        body("inv_year")
        .trim()
        .isInt({
            min: 1900,
            max: 2024,
        })

        .withMessage("Vehicle year is required."),
    
        body("inv_description")
        .trim()
        .escape()
        .isLength({
            min: 3,
         })
        .withMessage("Vehicle description is required."),

        body("inv_image")
        .trim()
        .isLength({
            min: 6,
         })
         .matches(/\.(jpg|jpeg|png|webp)$/)
        .withMessage("Vehicle image path is required."),

        body("inv_thumbnail")
        .trim()
        .isLength({
            min: 6,
         })
         .matches(/\.(jpg|jpeg|png|webp)$/)
        .withMessage("Vehicle thumbnail path is required."),

        body("inv_price")
        .trim()
        .isDecimal()
        .withMessage("Vehicle price is required."),

        body("inv_miles")
        .trim()
        .isInt({
            no_symbols: true,
        })
        .withMessage("Vehicle miles are required."),

        body("inv_color")
        .trim()
        .escape()
        .isLength({
            min: 3,
         })
        .withMessage("Vehicle color is required."),

        

    ]
  }

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }

module.exports = validate
