const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
  userID: String,
  serverID: String,
  fish: Number,
  gems: Number,
  wood: Number,
  grain: Number,
  meat: Number,
  baseEff: Number,
  jobMult: Number,
  job: Number
})

module.exports = mongoose.model("Inventory", inventorySchema);