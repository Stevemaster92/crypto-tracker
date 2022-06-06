import config from "./config";

import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

import * as functions from "firebase-functions";

// Initialize Firebase.
if (config.env === "production") {
    // Use the default options as we will run the app on Cloud Functions.
    initializeApp();
} else if (config.gac) {
    initializeApp({
        credential: credential.cert(config.gac),
    });
} else {
    throw Error("No Google Application Credentials (GAC) provided. Download the service-account.json file!");
}

const app = express();
// Initialize middlewares.
app.use(logger("combined"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Automatically allow cross-origin requests.
app.use(cors({ origin: true }));

// Initialize routes.
import routes from "./routes";
app.use("/api/v1", routes);

export const server = functions.https.onRequest(app);
