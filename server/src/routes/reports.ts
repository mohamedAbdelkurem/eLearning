import { Request, Response, Router } from "express";
import Lesson from "../entities/Lesson";
import Report from "../entities/Reports";
import admin from "../middlewears/admin";
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import user from "../middlewears/user";

const router = Router();
const getReports = async (_: Request, res: Response) => {
  try {
    const reports = await Report.find({ relations: ["lesson"] });
    return res.json(reports);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "something went wrong" });
  }
};
const createReport = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const lesson = await Lesson.findOne({ where: { identifier, slug } });
    if (!lesson) throw new Error("lesson not found");
    const report = await Report.findOne({ lesson });
    if (report) throw new Error("lesson already reported");
    await new Report({ lesson }).save();
    return res.json({ success: "lesson reported succefully" });
  } catch (error) {
    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      case "lesson already reported":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
const deleteReport = async (req: Request, res: Response) => {
  console.log(req.params);
  
  try {
    const lesson = await Lesson.findOne({
      where: { identifier: req.params.identifier, slug: req.params.slug },
    });
    console.log(lesson);
    
    if (!lesson) throw new Error("lesson not found");
    const report = await Report.findOne({ lesson });
    if (!report) throw new Error("report not found");
    await Report.delete(report.id);
    return res.json({ success: "report deleted succefully" });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      case "report not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
// /reports/

router.post("/:identifier/:slug", user, auth, createReport);
router.delete("/:identifier/:slug", user, auth, editor, admin, deleteReport);
router.get("/", user, auth, editor, admin, getReports);

export default router;
