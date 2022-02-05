import { Request, Response, Router } from "express";
import { getRepository, ILike } from "typeorm";
import { getConnection } from "typeorm";
import slug from "slug";
//models
//import Lesson from "../entities/Lesson";
import Sub from "../entities/Sub";
import Course from "../entities/Course";
//helpers
import { isEmpty, isInt, isPositive } from "class-validator";
import { makeid } from "../utils/helpers";
import auth from "../middlewears/auth";
import { UploadedFile } from "express-fileupload";
//NODE
import path from "path";
import fs from "fs";
import admin from "../middlewears/admin";
import ResultCourse from "../entities/ResultCourse";
import Lesson from "../entities/Lesson";
//import Result from "../entities/Result";
import Quiz from "../entities/Quiz";
import QuizCourse from "../entities/QuizCourse";
import Result from "../entities/Result";
//import User from "../entities/User";
import user from "../middlewears/user";
const router = Router();

// ?──────────────────────────────────────────────────────────── COURSES ─────────────────────────────────────────────────────────────────
//! ────────────────────────────────────────────────────────────────────────────────
//! Create Course
const createCourse = async (req: Request, res: Response) => {
  const { name, description, details, preview } = req.body;
  let picture = req.files?.picture as UploadedFile;

  let errors: any = {};
  try {
    // Validation

    if (isEmpty(name)) errors.name = "this field is required";
    if (isEmpty(description)) errors.description = "this field is required";

    let course = await getRepository(Course)
      .createQueryBuilder("course")
      .where("lower(course.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (course) errors.name = "name is already used";
    if (Object.keys(errors).length > 0) throw new Error("input error");
    // create  the new course
    let pictureName = "default.jpg";
    if (picture) {
      pictureName = makeid(9) + "." + picture.name.split(".").pop();
      let uploadPath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        pictureName
      );
      picture.mv(uploadPath, (err: any) => {
        if (err) {
          return res.status(403).json("error");
        }
        return;
      });
    }
    let [, apperance_order] = await Course.findAndCount();
    course = new Course({
      name,
      description,
      apperance_order: apperance_order + 1,
      imageUrn: pictureName,
      details,
      preview,
    });
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    switch (error.message) {
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!Get all courses
const getCourses = async (_: Request, res: Response) => {
  try {
    const courses = await Course.find({
      order: { apperance_order: "ASC", createdAt: "ASC" },
      relations: ["subs", "quizesCourse"],
    });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//!Get Latest courses
const getLatestCourses = async (_: Request, res: Response) => {
  try {
    const courses = await Course.find({
      order: { apperance_order: "ASC", createdAt: "ASC" },
      take: 3,
    });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!Get a single course
const getCourse = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    let course;
    if (user && user.emailConfirmed) {
      course = await Course.findOne({
        where: { slug: req.params.slug },
        relations: ["subs", "quizesCourse"],
      });
    } else {
      course = await Course.findOne({
        where: { slug: req.params.slug },
        relations: ["subs"],
      });
    }
    if (!course) throw new Error("course not found");
    const courseResult = await ResultCourse.findOne({
      where: { course, user },
    });
    console.log(courseResult);

    return res.status(200).json({ ...course, courseResult });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! Update a  course
const updateCourse = async (req: Request, res: Response) => {
  const { name, description, details, preview } = req.body;
  const apperance_order = Number(req.body.apperance_order);
  const slugName = req.params.slug;
  let errors: any = {};

  try {
    if (!isPositive(apperance_order) || !isInt(apperance_order))
      errors.apperance_order = "please insert a valid number";
    if (isEmpty(name)) errors.name = "this field is required";
    if (isEmpty(details)) errors.details = "this field is required";
    if (isEmpty(preview)) errors.preview = "this field is required";
    if (isEmpty(description)) errors.description = "this field is required";
    const course = await Course.findOne({
      where: { slug: slugName },
    });
    if (!course) throw new Error("course not found");
    if (Object.keys(errors).length > 0) throw new Error("input error");

    await getConnection()
      .createQueryBuilder()
      .update(Course)
      .set({
        apperance_order: apperance_order || 1,
        name,
        description,
        preview,
        details,
        slug: slug(name, "_") + "_" + makeid(3),
      })
      .where("slug = :slug", { slug: slugName })
      .execute();
    return res.status(200).json({ success: "course updated" });
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(404).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────

//!Search a course
const searchCourse = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (isEmpty(query)) throw new Error("query cannot be empty");
    const courses = await Course.find({
      where: { name: ILike(`%${query}%`) },
      select: ["name", "slug"],
      take: 10,
    });
    if (courses.length === 0) throw new Error("no courses found");
    return res.status(200).json(courses);
  } catch (error) {
    switch (error.message) {
      case "no courses found":
        return res.status(404).json({ error: error.message });
      case "query cannot be empty":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! Delete Course

const deleteCourse = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const course = await Course.findOne({ slug });
    if (!course) throw new Error("course not found");
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Course)
      .where("slug = :slug", { slug })
      .execute();
    if (course.imageUrn !== "default.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        course.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }
    return res.status(200).json({ message: "course deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error });
    }
  }
};
//!Update appearance Order
const updateCourseOrder = async (req: Request, res: Response) => {
  const apperance_order = Number(req.body.apperance_order);
  const id = Number(req.body.id);
  try {
    if (!isPositive(apperance_order) || !isInt(apperance_order))
      throw new Error("insert valid number");
    const course = await Course.findOne(id);
    if (!course) throw new Error("course not found");
    await getConnection()
      .createQueryBuilder()
      .update(Course)
      .set({ apperance_order })
      .where("id = :id", { id })
      .execute();
    return res.status(404).json({ success: "course apperance_order updated" });
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "insert valid number":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//?──────────────────────────────────────────────────────────── SUBCOURSES─────────────────────────────────────────────────────────────────

//! ────────────────────────────────────────────────────────────────────────────────
//! Get all subs
const getSubs = async (_: Request, res: Response) => {
  try {
    const subs = await Sub.find({ relations: ["course"] });
    return res.status(200).json(subs);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Get a single sub
const getSub = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const user = res.locals.user;
  console.log(user);

  try {
    const sub = await Sub.findOne({
      where: {
        slug,
      },
      //relations: ["course", "lessons", "lessons.results", "lessons.quiz"],
      relations: ["course"],
    });
    if (!sub) throw new Error("sub not found");

    // const lessons = await Lesson.find({
    //   relations: ["quiz", "results"],
    //   where: { subSlug: sub?.slug, results: { userId: user.id } },
    // });
    let lessons;
    if (user && user.emailConfirmed) {
      lessons = await getConnection()
        .createQueryBuilder()
        .select("lesson")
        .from(Lesson, "lesson")
        .where("lesson.subSlug = :subSlug", { subSlug: slug })
        .leftJoinAndSelect(
          "lesson.results",
          "results",
          "results.userId=:userId",
          { userId: user?.id }
        )
        .leftJoinAndSelect("lesson.quizes", "quizes")
        .getMany();
    } else {
      lessons = await getConnection()
        .createQueryBuilder()
        .select("lesson")
        .from(Lesson, "lesson")
        .where("lesson.subSlug = :subSlug", { subSlug: slug })
        .getMany();
    }
    return res.status(200).json({ ...sub, lessons });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "sub not found":
        return res.status(404).json({ error: "sub not found" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Create Sub
const createSub = async (req: Request, res: Response) => {
  const errors: any = {};
  const { title, description, courseSlug } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(description)) errors.description = "description cannot be empty";
  if (isEmpty(courseSlug)) errors.courseSlug = "please choose a course";

  try {
    if (Object.keys(errors).length > 0) throw new Error("validation errors");
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) throw new Error("course is not found");
    const sub = new Sub({
      description,
      title,
      courseSlug,
    });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    switch (error.message) {
      case "validation errors":
        return res.status(404).json(errors);
      case "course is not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Update a  sub
const updateSub = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const slugName = req.params.slug;
  let errors: any = {};
  try {
    // validate
    if (isEmpty(title)) errors.title = "title cannot be empty";
    if (isEmpty(description))
      errors.description = "description cannot be empty";
    // check if sub exists
    const sub = await Sub.findOne({
      where: { slug: slugName },
    });
    if (!sub) throw new Error("subcourse not found");
    if (Object.keys(errors).length > 0) throw new Error("input error");

    // update sub
    await getConnection()
      .createQueryBuilder()
      .update(Sub)
      .set({
        title,
        description,
        slug: slug(title, "_") + "_" + makeid(3),
      })
      .where("slug = :slug", { slug: slugName })
      .execute();
    return res.status(200).json({ success: "subcourse updated" });
  } catch (error) {
    switch (error.msg) {
      case "subcourse not found":
        return res.status(404).json({ error: error.msg });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! Delete Sub
const deleteSub = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    await Sub.findOneOrFail({ slug });
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Sub)
      .where("slug = :slug", { slug })
      .execute();
    return res.status(200).json({ message: "sub deleted succefully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const getCourseProgress = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = res.locals.user;
  try {
    const course = await Course.findOne({ where: { slug } });
    //get counts
    const [, quizesCount] = await Quiz.findAndCount({ where: { course } });
    const quizCourse = await QuizCourse.findOne({ where: { course } });
    let numQuizes = quizesCount;
    if (quizCourse) numQuizes++;
    //get user results
    console.log("numQuizes " + numQuizes);
    let numberOfResults = await getConnection()
      .createQueryBuilder()
      .select("results")
      .from(Result, "result")
      .leftJoinAndSelect("result.course", "course")
      .where("result.userId = :userId", { userId: user.id })
      .andWhere("course.id=:courseId", { courseId: course?.id })
      .getCount();
    console.log(numberOfResults);
    let courseResult = await getConnection()
      .createQueryBuilder()
      .select("resultsCourse")
      .from(ResultCourse, "resultsCourse")
      .leftJoinAndSelect("resultsCourse.course", "course")
      .where("resultsCourse.userId = :userId", { userId: user.id })
      .andWhere("course.id=:courseId", { courseId: course?.id })
      .getOne();
    let numberOfresultsAfter = 0;
    if (courseResult) {
      numberOfresultsAfter = numberOfResults + 1;
    }
    console.log("number of results : " + numberOfResults);
    return res.json({
      progress: (numberOfresultsAfter * 100) / numQuizes,
      finishedAllLessonQuizs: numQuizes - numberOfResults === 1,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────

/////////
//!course routes

//?GET
router.get("/course/all", getCourses);
router.get("/course/progress/:slug", user, auth, getCourseProgress);
router.get("/course/latest", getLatestCourses);
router.get("/course/search/", searchCourse);
router.get("/course/:slug", user, getCourse);
//?POST
router.post("/course", user, auth, admin, createCourse);
//?UPDATE
router.put("/course/updateCourseOrder", updateCourseOrder);
router.put("/course/:slug", user, auth, admin, updateCourse);
//?DELETE
router.delete("/course/:slug", user, auth, admin, deleteCourse);

//!subs routes
//?GET
router.get("/", getSubs);
router.get("/:slug", user, getSub);
//?POST
router.post("/", user, auth, admin, createSub);
//?UPDATE
router.put("/:slug", user, auth, admin, updateSub);
//?DELETE
router.delete("/:slug", user, auth, admin, deleteSub);

export default router;
