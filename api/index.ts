import express from "express";
import usersRoutes from "./routes/users";
import stationsRoutes from "./routes/stations";
import pumpsRoutes from "./routes/pumps";
import nozzlesRoutes from "./routes/nozzles";
import employeesRoutes from "./routes/employees";
import summaryRoutes from "./routes/summary";
import dashboardRoutes from "./routes/dashboard";
import authRoutes from "./routes/auth";
import manualReadingsRoutes from "./routes/manual-readings";
import salesRoutes from "./routes/sales";
import stationOverviewRoutes from "./routes/station-overview";
import readingsRoutes from "./routes/readings";
import tenderRoute from "./routes/tender";
import dashboardRootRoute from "./routes/dashboard-root";
import tenderEntriesRoutes from "./routes/tender-entries";
import refillsRoutes from "./routes/refills";
import ocrReadingsRoutes from "./routes/ocr-readings";
import plansRoutes from "./routes/plans";
import analyticsRoutes from "./routes/analytics";
import uploadsRoutes from "./routes/uploads";

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
app.use("/api/sales", salesRoutes);
app.use("/api/station-overview", stationOverviewRoutes);
app.use("/api/readings", readingsRoutes);
app.use("/api/tender", tenderRoute);
app.use("/api/dashboard", dashboardRootRoute); // GET /api/dashboard

// Mount placeholder endpoints
app.use("/api/tender-entries", tenderEntriesRoutes);
app.use("/api/tenders", tenderEntriesRoutes);
app.use("/api/refills", refillsRoutes);
app.use("/api/ocr-readings", ocrReadingsRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/manual-readings", manualReadingsRoutes);

app.get("/", (_req, res) => res.send("Superadmin Wizard API is running!"));

// --- Add 404 Not Found Handler (after all routes, before error handler) ---
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling: catch all
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
