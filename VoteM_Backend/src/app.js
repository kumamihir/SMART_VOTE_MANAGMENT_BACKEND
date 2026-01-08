require("dotenv").config();
const express = require("express");
const connectdb = require("./config/db");
const User = require("./models/user");
const authRoutes = require("./routes/auth.routes")
const authMiddleware = require("./middleware/auth.middleware")
const bloRoutes = require("./routes/blo.routes");
const voterApplicationRoutes = require("./routes/voterApplication.routes");
const eroRoutes = require("./routes/ero.routes");
const auditRoutes = require("./routes/audit.routes")
const archiveRoutes = require("./routes/archive.routes");


connectdb();
const app = express();
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/blo",bloRoutes);
app.use("/api/voter",voterApplicationRoutes);
app.use("/api/ero",eroRoutes);
app.use("/api/audit",auditRoutes);
app.use("/api/archive",archiveRoutes);
app.get("/vote",authMiddleware,(req,res)=>{
    res.json(
        {status : "OK",
        message: "Protected route accessed",
        user: req.user
        }
    );
});

app.listen(process.env.PORT,()=>{
    console.log(`server iss port pr chl rha h ${process.env.PORT}`);
});

