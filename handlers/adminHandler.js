import Testimonial from "../models/Testimonial.js";
import dayjs from "dayjs";

/**
 * GET /api/v1/admin/testimonials
 * Returns all testimonials awaiting approval.
 */
export const listPendingTestimonials = async (req, res) => {
  try {
    const pending = await Testimonial.find({
      is_approved: false,
      deleted_at: null,
    }).sort({ created_at: -1 });
    return res.send({ status: true, testimonials: pending });
  } catch (err) {
    console.error("Error fetching pending testimonials:", err);
    return res.status(500).send({ status: false, message: "Server error" });
  }
};

/**
 * PATCH /api/v1/admin/testimonials/:id/approve
 * Approves a testimonial (sets is_approved to true).
 */
export const approveTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      id,
      {
        is_approved: true,
        updated_at: dayjs().toDate(),
      },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .send({ status: false, message: "Testimonial not found" });
    }
    return res.send({
      status: true,
      message: "Testimonial approved",
      testimonial: updated,
    });
  } catch (err) {
    console.error("Error approving testimonial:", err);
    return res.status(500).send({ status: false, message: "Server error" });
  }
};

/**
 * PATCH /api/v1/admin/testimonials/:id/reject
 * Rejects (soft‐deletes) a testimonial (sets deleted_at).
 */
export const rejectTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { deleted_at: dayjs().toDate() },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .send({ status: false, message: "Testimonial not found" });
    }
    return res.send({
      status: true,
      message: "Testimonial rejected",
      testimonial: updated,
    });
  } catch (err) {
    console.error("Error rejecting testimonial:", err);
    return res.status(500).send({ status: false, message: "Server error" });
  }
};
