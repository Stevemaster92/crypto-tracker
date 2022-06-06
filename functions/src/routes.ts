import { Router } from "express";
import coin from "./routes/coin.route";

const router = Router();

router.use("/coin", coin);

export default router;
