import {
  Entity as ToEntity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  JoinColumn,
} from "typeorm";

import Entity from "./Entity";
import slug from "slug";
import { makeid } from "../utils/helpers";
import Sub from "./Sub";
import { Expose } from "class-transformer";
import Quiz from "./Quiz";
import QuizCourse from "./QuizCourse";
import Lesson from "./Lesson";
import Result from "./Result";
import ResultCourse from "./ResultCourse";
import Certificate from "./Certificate";

@ToEntity("courses")
export default class Course extends Entity {
  constructor(course: Partial<Course>) {
    super();
    Object.assign(this, course);
  }
  @Index()
  @Column({ unique: true })
  slug: string;

  @Index()
  @Column({ unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  details: string;

  @Column({ default: "default.jpg" })
  imageUrn: string;

  @Column({ nullable: true })
  preview: string;

  //higher number ll ordered first
  @Column({ default: 1, nullable: true })
  apperance_order: number;

  @OneToMany(() => Quiz, (quiz) => quiz.course) // specify inverse side as a second parameter
  @JoinColumn()
  quiz: Quiz;



  @OneToMany(() => QuizCourse, (quizCourse) => quizCourse.course, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  }) 
  quizesCourse: QuizCourse[];

  @OneToMany(() => Sub, (sub: Sub) => sub.course)
  subs: Sub[];

  @OneToMany(() => Lesson, (lesson: Lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Result, (result) => result.course)
  results: Result[];

  
  @OneToMany(() => Certificate, (certificate) => certificate.course, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  certificates: Certificate[];
  
  @OneToMany(() => ResultCourse, (resultCourse) => resultCourse.course)
  resultsCourse: ResultCourse[];

  @OneToMany(() => Quiz, (quiz: Quiz) => quiz.course)
  quizes: Quiz[];

  @BeforeInsert()
  makeSlug() {
    this.slug = slug(this.name, "_") + "_" + makeid(3);
  }
  @Expose() get subCategoriesCount(): number {
    return this.subs?.length;
  }
}
