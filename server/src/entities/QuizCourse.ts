import {
  Column,
  Entity as TOEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Course from "./Course";

import Entity from "./Entity";
import ResultCourse from "./ResultCourse";

@TOEntity("quizesCourse")
export default class QuizCourse extends Entity {
  constructor(quizCourse: Partial<QuizCourse>) {
    super();
    Object.assign(this, quizCourse);
  }
  @Column()
  title: string;

  @Column()
  quiz: string;

  @OneToMany(() => ResultCourse, (resultCourse) => resultCourse.quizCourse, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  resultsCourse: ResultCourse[];

  @ManyToOne(() => Course, (course) => course.quizesCourse, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  }) // specify inverse side as a second parameter
  @JoinColumn()
  course: Course;
}
