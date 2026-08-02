const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected Successfully");
}

main().catch((err) => console.log(err));