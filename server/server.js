const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const connection = require("./db/Connection");
const userRoute = require("./routes/UserRoute");
const financeRoute = require("./routes/FinanceRoute");

app.use(express.json());
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Allow cookies/auth headers if needed
  })
);

// Explicitly handle OPTIONS preflight requests
app.options("*", cors());
// Routers
app.use("/api/user", userRoute);
app.use("/api/finance", financeRoute);

// Middleware
// app.use(errorHandlerMiddleware);
// app.use(notFoundMiddleWare);

// Database connection
connection();

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
