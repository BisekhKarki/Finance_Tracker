const mongoose = require("mongoose");
const { Schema } = mongoose;

const finance = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Amount: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
});

const Finance = mongoose.models.finance || mongoose.model("Finance", finance);
module.exports = Finance;
