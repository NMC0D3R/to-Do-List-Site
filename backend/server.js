const dotenv = require("dotenv");
const { connectDB } = require("./utils/connectDB");
const app = require("./app");

dotenv.config();
const connectionStr = process.env.MONGO_DB_ATLAS.replace(
  "<password>",
  process.env.MONGO_DB_ATLAS_PASSWORD
).replace("<username>", process.env.MONGO_DB_ATLAS_USERNAME);
connectDB(connectionStr);

const PORT = 8000 || 8001;
const IP = "127.0.0.1";
app.listen(PORT, IP, () => {
  console.log(`server run !\n http://${IP}${PORT}`);
});
