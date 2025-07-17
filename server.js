import express from "express";
import router from "./routes/AuthRoutes.js";
import authenticateToken from "./middleware/authenticateToken.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import connect from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import routerRequirement from "./routes/RoutesRequirement.js";
import zohoRoutes from "./routes/zohoRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api", router);

app.use("/uploads", express.static("uploads")); // to serve resume files
app.use("/api/candidates", authenticateToken, candidateRoutes);

app.use("/api/requirements", routerRequirement);
app.use("/api/zoho", zohoRoutes);

app.get("/get", (req, res) => {
  return res.status(200).json({ message: "success", status: true });
});
connect();
app.listen(PORT, () => {
  console.log("server is running");
});
