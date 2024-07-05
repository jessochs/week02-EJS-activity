//needed resources
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build single vehile inventory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//route to view management
router.get("/", utilities.handleErrors(invController.viewManagement));

//routes to add classification
router.get("/newClassification", utilities.handleErrors(invController.addNewClassification));
router.post("/add-classification", regValidate.classificationRules(), regValidate.checkClassificationData, utilities.handleErrors(invController.registerNewClassification));

//routes for adding new inventory
router.get("/newInventory", utilities.handleErrors(invController.addNewInventory));
router.post("/add-inventory", regValidate.vehicleRules(), regValidate.checkVehicleData, utilities.handleErrors(invController.addVehicle));

//route for new get inv js
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//edit route
router.get("/edit/:inv_id", utilities.handleErrors(invController.editVehicle))

//update post route
router.post("/update/", regValidate.vehicleRules(), regValidate.checkVehicleUpdateData, utilities.handleErrors(invController.updateVehicle))

//delete route
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteVehicle))
router.post("/delete/", utilities.handleErrors(invController.deleteVehicleData) )

module.exports = router;
