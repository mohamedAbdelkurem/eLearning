import {  Column, Entity as TOEntity, JoinColumn, ManyToOne } from "typeorm";
import Course from "./Course";

import Entity from "./Entity";
import Lesson from "./Lesson";
import Quiz from "./Quiz";
import User from "./User";

@TOEntity("results")
export default class  Result extends Entity {
  constructor(result: Partial<Result>) {
    super();
    Object.assign(this, result);
  }
  
  @Column()
  userId:string
  
  @ManyToOne(() => Course, (course) => course.results, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  course: Course;


  @ManyToOne(() => User, (user) => user.results, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  
  @ManyToOne(() => Quiz, (quiz) => quiz.results, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  quiz: Quiz;



  @ManyToOne(() => Lesson, (lesson) => lesson.results, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  lesson: Lesson;
}
