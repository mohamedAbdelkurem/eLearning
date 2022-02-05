import { Column, Entity as TOEntity, JoinColumn, ManyToOne } from "typeorm";
import Course from "./Course";
import Entity from "./Entity";
import QuizCourse from "./QuizCourse";
import User from "./User";

@TOEntity("resultsCourse")
export default class ResultCourse extends Entity {
  constructor(resultCourse: Partial<ResultCourse>) {
    super();
    Object.assign(this, resultCourse);
  }

  @Column()
  userId:string

  @ManyToOne(() => Course, (course) => course.resultsCourse, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  course: Course;

  @ManyToOne(() => QuizCourse, (quizCourse) => quizCourse.resultsCourse, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  quizCourse: QuizCourse;


  @ManyToOne(() => User, (user) => user.resultsCourse, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;
}
