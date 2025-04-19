const finance = require("../Models/FinanceModel");

// get transactions based on id
const getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const getTransaction = await finance.findById({ id: id });
    if (!getTransaction) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    return res.status(200).json({
      success: true,
      message: getTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getTransactionOnly = async (req, res) => {
  const { userId } = req.body;
  try {
    const getTransaction = await finance.find({});
    if (!getTransaction) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    const filterTransaction = getTransaction.filter((tran) => {
      return tran.userId.toString() === userId;
    });

    if (!filterTransaction) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    return res.status(200).json({
      success: true,
      message: filterTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const { type, Amount, Category, Description, Date, userId } = req.body;
    if (!type || !Amount || !Category || !Description || !Date) {
      return res.status(404).json({
        success: false,
        message: "Fulfill every credentials",
      });
    }

    const newTransaction = new finance({
      type,
      userId,
      Amount,
      Category,
      Description,
      Date,
    });

    await newTransaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction added successfully",
      transactions: newTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const getTransaction = await finance.findByIdAndDelete(id);
    if (!getTransaction) {
      return res.status(501).json({
        success: false,
        message: "Unable to delete the transaction",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const updateTransaction = async (req, res) => {
  const { type, Amount, Category, Description, Date, userId } = req.body;
  const { id } = req.params;
  try {
    const transaction = await finance.findByIdAndUpdate(
      { _id: id },
      {
        type,
        Amount,
        Category,
        Description,
        Date,
        userId,
      }
    );

    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: "Failed to update the transaction",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  addTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionOnly,
  updateTransaction,
};
