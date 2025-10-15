// routes/admin.js
import { Router } from "express";
import checkAdmin from "../middleware/checkAdmin.js";
import {
  listPendingTestimonials,
  approveTestimonial,
  rejectTestimonial,
} from "../handlers/adminHandler.js";

const adminRouter = Router();
adminRouter.use(checkAdmin); // protect all admin endpoints

adminRouter.get("/testimonials", listPendingTestimonials);
adminRouter.patch("/testimonials/:id/approve", approveTestimonial);
adminRouter.patch("/testimonials/:id/reject", rejectTestimonial);

export default adminRouter;
