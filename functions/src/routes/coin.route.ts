import { Router } from "express";
import axios from "axios";
import service from "../services/coin.service";

const router = Router();

router.get("/assets", async (req, res) => {
    if (!req.query.start || !req.query.limit) {
        return res.sendStatus(400);
    }

    const start = Number.parseInt(req.query.start as string);
    const limit = Number.parseInt(req.query.limit as string);

    if (Number.isNaN(start) || Number.isNaN(limit)) {
        return res.sendStatus(400);
    }

    try {
        const assets = await service.getAssets(start, limit);

        if (assets.length == 0) {
            return res.sendStatus(404);
        }

        return res.json(assets);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 400) {
                return res.sendStatus(err.response?.status!);
            }

            if (status === 403 || status === 429) {
                return res.status(404).json({ message: "Requested resource(s) found" });
            }
        }
    }

    return res.sendStatus(500);
});

export default router;
