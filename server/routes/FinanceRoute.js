const express = require("express");
const {
  addTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionOnly,
  updateTransaction,
} = require("../Controller/Finance");
const router = express.Router();

router.post("/add", addTransaction);
router.delete("/delete/:id", deleteTransaction);
router.get("/get/:id", getTransactionById);
router.post("/getSingle", getTransactionOnly);
router.post("/update/:id", updateTransaction);

module.exports = router;
