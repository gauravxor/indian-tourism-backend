import {
    scannerFetchController,
    scannerAllowController,
    scannerVerifyController,
} from "@controllers/scanner/scannerController";

import express from "express";

const scannerRoutes = express.Router();

scannerRoutes.post("", scannerFetchController);
scannerRoutes.post("/allow", scannerAllowController);
scannerRoutes.post("/verify", scannerVerifyController);

export { scannerRoutes };
