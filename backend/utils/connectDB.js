const mongoose = require("mongoose");

exports.connectDB = async (conStr) => {
  try {
    const con = await mongoose.connect(conStr);
    if (con) {
      console.log(`the DB has been Connected ${con.connection.host}`);
    }
  } catch (err) {
    console.log(err.message);
  }
};
