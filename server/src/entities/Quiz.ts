import {
  Column,
  Entity as TOEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Course from "./Course";

import Entity from "./Entity";
import Lesson from "./Lesson";
import Result from "./Result";

@TOEntity("quizes")
export default class Quiz extends Entity {
  constructor(quiz: Partial<Quiz>) {
    super();
    Object.assign(this, quiz);
  }

  @Column()
  quiz: string;
  @Column()
  title: string;

  @Column()
  lessonId: string
  
  @ManyToOne(() => Lesson, (lesson) => lesson.quizes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  }) 
  @JoinColumn()
  lesson: Lesson;

  @OneToMany(() => Result, (result) => result.quiz, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  results: Result[];

  

  @ManyToOne(() => Course, (course) => course.quiz, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  course: Course;
}
