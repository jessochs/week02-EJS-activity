const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */

async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account Id
* ***************************** */

async function getAccountByAccountId(account_id) {
  try {
    const data = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM public.account WHERE account_id = $1',
      [account_id]
      )
    return data.rows[0]
  } catch(error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account
* ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql = 
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING*"
     const data = await pool.query(sql, [
      
      account_firstname,
      account_lastname,
      account_email,
      account_id,
     ]) 
     return data.rows[0]
  } catch(error) {
    console.error("model error: " + error)
  }
}

/* *****************************
* Update password
* ***************************** */
async function updatePassword(
  account_id,
  account_password,
) {
  try {
    const sql = 
    "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING*"
    const data = await pool.query(sql, [
      account_password,
      account_id,
    ])
    return data.rows[0]
  } catch(error) {
    console.error("model error: " + error)
  }
}

/* *****************************
* get account reviews by account id
* ***************************** */
async function getReviewByAccountId(account_id) {
  try {
    const sql = `SELECT review.review_id, review.review_text, review.review_date, review.account_id, inventory.inv_make, inventory.inv_model, inventory.inv_year FROM review JOIN inventory ON review.inv_id = inventory.inv_id WHERE review.account_id = $1`;
    const data = await pool.query(sql, [account_id]);
    console.log("get reviews by account id data: ", data.rows);
    return data.rows;
  } catch (error) {
    console.error("getReviewByAccountId error " + error);
  }
}

/* *****************************
* get account reviews by review id
* ***************************** */
async function getReviewByReviewId(review_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM review WHERE review_id = $1", [review_id]
    )
    return data.rows
  } catch(error) {
    console.error("getReview by id error" + error)
  }

}

/* ***************************
 *  Update Review
 * ************************** */
async function updateReview(review_id, review_text) {

  try {
    const sql = 
      "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
      const data = await pool.query(sql, [
        review_text,
        review_id
      ])
      return data.rows[0]
  } catch(error) {
    console.error("review update error:" + error)
  }
  

}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountByAccountId, updateAccount, updatePassword, getReviewByAccountId, getReviewByReviewId, updateReview}