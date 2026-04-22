import { Router, type IRouter } from "express";
import healthRouter from "./health";
import creatorsRouter from "./creators";
import brandsRouter from "./brands";
import campaignsRouter from "./campaigns";
import applicationsRouter from "./applications";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(creatorsRouter);
router.use(brandsRouter);
router.use(campaignsRouter);
router.use(applicationsRouter);
router.use(statsRouter);

export default router;
