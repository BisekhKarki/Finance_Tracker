const mongoose = require("mongoose");

const connection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connect) {
      console.log(
        `Database connected \nConnection Host: ${
          connect.connection.host.split("-")[0]
        }`
      );
    } else {
      console.log("Error connecting the database");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = connection;
