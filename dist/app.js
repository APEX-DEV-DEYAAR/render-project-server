import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import { apiRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
export function createApp(services) {
    const app = express();
    app.use(helmet());
    app.use(cors({
        origin: config.allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }));
    app.use(cookieParser());
    app.use(express.json({ limit: "1mb" }));
    app.use("/api", apiRoutes(services));
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map