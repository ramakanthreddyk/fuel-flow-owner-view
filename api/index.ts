import express from "express";
import usersRoutes from "./routes/users";
import stationsRoutes from "./routes/stations";
import pumpsRoutes from "./routes/pumps";
import nozzlesRoutes from "./routes/nozzles";
import employeesRoutes from "./routes/employees";
import summaryRoutes from "./routes/summary";
import dashboardRoutes from "./routes/dashboard";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());

// Mount endpoints
app.use("/api/users", usersRoutes);
app.use("/api/stations", stationsRoutes);
app.use("/api/pumps", pumpsRoutes);
app.use("/api/nozzles", nozzlesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => res.send("Superadmin Wizard API is running!"));

// Error handling: catch all
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
