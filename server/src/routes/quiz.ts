import { Request, Response, Router } from "express";
//validators
import { isEmpty } from "class-validator";
//entities
import Course from "../entities/Course";
import Lesson from "../entities/Lesson";
import Quiz from "../entities/Quiz";
import QuizCourse from "../entities/QuizCourse";
import Certificate from "../entities/Certificate";
//middlewears
import admin from "../middlewears/admin";
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import user from "../middlewears/user";
import Result from "../entities/Result";
import ResultCourse from "../entities/ResultCourse";
import { getConnection } from "typeorm";
const router = Router();

//ADD QUIZ TO LESSON
const addQuizLesson = async (req: Request, res: Response) => {
  let errors: any = {};
  const { quiz, title } = req.body;
  try {
    if (isEmpty(quiz)) errors.quiz = "quiz cannot be empty";
    if (isEmpty(title)) errors.title = "title cannot be empty";
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const lesson = await Lesson.findOne({
      where: { slug: req.params.slug, identifier: req.params.identifier },
      relations: ["quizes", "sub", "sub.course"],
    });
    if (!lesson) throw new Error("lesson not found");
    if (lesson.quizes.length > 1)
      throw new Error("this lesson already have quiz");
    const newquiz = await new Quiz({
      quiz,
      title,
      lesson,
      course: lesson.sub.course,
    }).save();

    return res.status(200).json(newquiz);
  } catch (error) {
    console.log(error);

    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      case "this lesson already have quiz":
        return res.status(403).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//DELETE QUIZ FROM LESSON
const deleteQuizLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findOne({
      where: { slug: req.params.slug, identifier: req.params.identifier },
      relations: ["quizes"],
    });

    if (!lesson) throw new Error("lesson not found");
    const quiz = await Quiz.findOne({ lesson });
    if (!quiz) throw new Error("this lesson does not have any quiz");
    const deleted = await Quiz.delete(quiz.id);
    return res.status(200).json({ success: deleted });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      case "this lesson does not have any quiz":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//ADD QUIZ TO COURSE
const addQuizCourse = async (req: Request, res: Response) => {
  let errors: any = {};
  const { quiz, title } = req.body;
  try {
    if (isEmpty(quiz)) errors.quiz = "quiz cannot be empty";
    if (isEmpty(quiz)) errors.title = "title cannot be empty";
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const course = await Course.findOne({
      where: { slug: req.params.slug },
      relations: ["quizesCourse"],
    });
    if (!course) throw new Error("course not found");
    if (course.quizesCourse.length > 0)
      throw new Error("this course already have quiz");
    const newquiz = await new QuizCourse({
      title,
      quiz,
      course,
    }).save();

    return res.status(200).json(newquiz);
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "this course already have quiz":
        return res.status(403).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//DELETE  QUIZ FROM COURSE
const deleteQuizCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug },
      relations: ["quizesCourse"],
    });
    if (!course) throw new Error("course not found");
    const quizCourse = await QuizCourse.findOne({ where: { course } });
    if (!quizCourse) throw new Error("this course does not have any quiz");
    await QuizCourse.delete(quizCourse.id);
    return res.status(200).json({ success: "quiz deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "this course does not have any quiz":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//add result
// const createResultLessonQuiz = async (req: Request, res: Response) => {
//   const user = res.locals.user;
//   try {
//     const lesson = await Lesson.findOne({
//       where: { slug: req.params.slug, identifier: req.params.identifier },
//       relations: ["quizes", "sub", "sub.course"],
//     });
//     if (!lesson) throw new Error("lesson not found");
//     if (!lesson.quizes) throw new Error("this lesson does not have any quiz");
//     const newResult = await new Result({
//       user,
//       lesson,
//       course: lesson.sub.course,
//     }).save();
//     return res.status(200).json({ newResult });
//   } catch (error) {
//     console.log(error);

//     switch (error.message) {
//       case "lesson not found":
//         return res.status(404).json({ error: error.message });
//       case "this lesson does not have any quiz":
//         return res.status(403).json({ error: error.message });
//       default:
//         return res.status(500).json({ error: "something went wrong" });
//     }
//   }
// };
const createResult2LessonQuiz = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const lesson = await Lesson.findOne({
      where: { slug: req.params.slug },
      relations: ["quizes", "course"],
    });
    if (!lesson) throw new Error("lesson not found");
    if (lesson.quizes.length === 0)
      throw new Error("this lesson does not have any quiz");
    const newResult = await new Result({
      user,
      course: lesson.course,
      lesson,
      quiz: lesson.quizes[0],
    }).save();
    return res.status(200).json({ newResult });
  } catch (error) {
    console.log(error);

    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      case "this lesson does not have any quiz":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
const createResultCourseQuiz = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug },
      relations: ["quizesCourse"],
    });
    if (!course) throw new Error("course not found");
    if (course.quizesCourse.length === 0)
      throw new Error("this course does not have any quiz");
    const result = await ResultCourse.findOne({ user, course });
    if (result) throw new Error("result already submited");
    const newResult = await new ResultCourse({
      user,
      course,
      quizCourse: course.quizesCourse[0],
    }).save();
    return res.status(200).json({ newResult });
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "result already submited":
        return res.status(403).json({ error: error.message });
      case "this course does not have any quiz":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
const createCertificate = async (req: Request, res: Response) => {
  const { slug } = req.body;
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
      .where("result.userId = :userId", { userId: user.id })
      .leftJoinAndSelect("result.course", "course")
      .where("course.id=:courseId", { courseId: course?.id })
      .getCount();
    let courseResult = await getConnection()
      .createQueryBuilder()
      .select("resultsCourse")
      .from(ResultCourse, "resultsCourse")
      .where("resultsCourse.userId = :userId", { userId: user.id })
      .leftJoinAndSelect("resultsCourse.course", "course")
      .where("course.id=:courseId", { courseId: course?.id })
      .getOne();
    if (courseResult) {
      numberOfResults++;
    }
    if ((numberOfResults * 100) / numQuizes === 100) {
      const certificate = new Certificate({ course, user }).save();
      return res.status(200).json(certificate);
    } else {
      return res.status(200).json(null);
    }
  } catch (error) {
    switch (error.message) {
      case "u need to finish all course quiz":
        return res
          .status(200)
          .json({ error: "u need to finish all course quiz" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
const viewCertificate = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = res.locals.user;
  try {
    const course = await Course.findOne({ where: { slug } });
    if (!course) throw new Error("course not found");
    const certificate = await Certificate.findOne({
      where: { course, user },
      relations: ["course", "user"],
    });
    if (!certificate) throw new Error("you need to claim this certificate");
    return res.status(200).json(certificate);
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "course not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(404).json({ error: error.message });
    }
  }
};

const getCertificate = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  try {
    // const certificate = await Certificate.findOne({
    //   where: { identifier },
    //   relations: ["course", "user.username"],
    // });
    let courseResult = await getConnection()
      .createQueryBuilder()
      .select("certificate")
      .from(Certificate, "certificate")
      .select([
        "certificate.id",
        "certificate.createdAt",
        "certificate.identifier",
        "course.name",
        "user.username",
      ])
      .leftJoin("certificate.course", "course") // bar is the joined table
      .leftJoin("certificate.user", "user") // bar is the joined table
      .where("certificate.identifier=:identifier", { identifier })
      .getOne();
    if (!courseResult) throw new Error("certificate was found");
    return res.status(200).json(courseResult);
  } catch (error) {
    switch (error.message) {
      case "certificate was found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(404).json({ error: error.message });
    }
  }
};

const checkCertificate = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = res.locals.user;
  try {
    if (!user) return res.status(200).json(null);
    const course = await Course.findOne({ where: { slug } });
    const certificate = await Certificate.findOne({ where: { course, user } });
    if (!certificate) return res.status(200).json(null);
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
const GetMyCertifications = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    if (!user) return res.status(200).json(null);
    const certificate = await Certificate.find({
      where: { user },
      relations: ["course"],
    });
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//createCertificate

//!Quiz  routes
///api/quizes
//create lesson quiz
router.post(
  "/addquizlesson/:identifier/:slug",
  user,
  auth,
  editor,
  admin,
  addQuizLesson
);
//create lesson quiz result
router.post(
  "/createresultlessonquiz/:identifier/:slug",
  user,
  auth,
  createResult2LessonQuiz
);
//create lesson quiz result
router.post(
  "/createresultcoursequiz/:slug",
  user,
  auth,
  createResultCourseQuiz
);

//create course quiz
router.post("/addquizcourse/:slug", user, auth, editor, admin, addQuizCourse);

router.delete(
  "/deletequizcourse/:slug",
  user,
  auth,
  editor,
  admin,
  deleteQuizCourse
);
router.delete(
  "/deletequizlesson/:identifier/:slug",
  user,
  auth,
  editor,
  admin,
  deleteQuizLesson
);

router.post("/createCertificate/:slug", user, auth, createCertificate);
router.post("/mycertifications/", user, auth, GetMyCertifications);
router.get("/checkCertificate/:slug", user, auth, checkCertificate);
router.get("/viewCertificate/:slug", user, auth, viewCertificate);
router.get("/getCertificate/:identifier", getCertificate);
export default router;
