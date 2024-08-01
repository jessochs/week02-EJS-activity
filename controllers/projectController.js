/* ****************************************
*  Deliver python view
* *************************************** */
async function pythonPage(req, res, next) {
    
    res.render("project/python", {
      title: "Python Projects",
      errors: null,
    })
  }

/* ****************************************
*  Deliver c# view
* *************************************** */
async function csharpPage(req, res, next) {
    
    res.render("project/csharp", {
      title: "C# Projects",
      errors: null,
    })
  }

/* ****************************************
*  Deliver sql view
* *************************************** */
async function sqlPage(req, res, next) {
    
    res.render("project/sql", {
      title: "SQL/Database Projects",
      errors: null,
    })
  }

/* ****************************************
*  Deliver javascript view
* *************************************** */
async function javascriptPage(req, res, next) {
    
    res.render("project/javascript", {
      title: "JavaScript/Node Projects",
      errors: null,
    })
  }

/* ****************************************
*  Deliver dotNet view
* *************************************** */
async function dotNetPage(req, res, next) {
    
    res.render("project/dotNet", {
      title: ".Net Projects",
      errors: null,
    })
  }

/* ****************************************
*  Deliver java view
* *************************************** */
async function javaPage(req, res, next) {
    
    res.render("project/java", {
      title: "Java/C++ Projects",
      errors: null,
    })
  }


/* ****************************************
*  Deliver html view
* *************************************** */
async function htmlPage(req, res, next) {
    
    res.render("project/html", {
      title: "HTML/CSS Projects",
      errors: null,
    })
  }

/* ****************************************
*  Deliver about me page view
* *************************************** */
async function aboutPage(req, res, next) {
    
    res.render("project/about", {
      title: "About Me",
      errors: null,
    })
  }

module.exports = { pythonPage, csharpPage, sqlPage, javascriptPage, dotNetPage, htmlPage, javaPage, aboutPage }