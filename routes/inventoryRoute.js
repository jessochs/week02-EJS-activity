//needed resources
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build single vehile inventory view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

//route to view management
router.get("/", invController.viewManagement);

//routes to add classification
router.get("/add-classification", utilities.handleErrors(invController.addNewClassification));
router.post("/add-classification", invController.registerNewClassification);

//routes for adding new inventory
router.get("/add-inventory", utilities.handleErrors(invController.addNewInventory));
router.post("/add-inventory", invController.registerNewInventory);

//rout for new get inv js
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//edit route
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventory))

//update post route
router.post("/update/", utilities.handleErrors(invController.updateInventory))
module.exports = router;
