
const baseController = {}

baseController.buildHome = async function(req, res){
  
  // req.flash("notice", "This is the flash message.")
  res.render("index", {title: "Home"})
}

module.exports = baseController