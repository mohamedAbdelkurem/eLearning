import {
  Entity as ToEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeid } from "../utils/helpers";
import slug from "slug";
import Sub from "./Sub";
import Comment from "./Comment";
import { Exclude, Expose } from "class-transformer";
import Quiz from "./Quiz";
import Course from "./Course";
import Result from "./Result";
import Report from "./Reports";

@ToEntity("lessons")
export default class Lesson extends Entity {
  constructor(lesson: Partial<Lesson>) {
    super();
    Object.assign(this, lesson);
  }
  @Index()
  @Column({ unique: true })
  identifier: string; // 7 char ID

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({
    type: "text",
    nullable: false,
  })
  body!: string;

  @Column()
  username: string;

  @Column({ type: "text", nullable: true })
  videoLink: string;

  @Column({ default: true })
  displayStatus: boolean;

  @Column()
  subSlug: string;

  @ManyToOne(() => User, (user) => user.lessons, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Exclude()
  @ManyToOne(() => Course, (course: Course) => course.lessons, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  course: Course;

  @Exclude()
  @ManyToOne(() => Sub, (sub) => sub.lessons, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "subSlug", referencedColumnName: "slug" })
  sub: Sub;

  @OneToMany(() => Result, (result) => result.lesson, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  results: Result[];

  @OneToMany(() => Comment, (comment) => comment.lesson)
  comments: Comment[];

  @OneToMany(() => Report, (report) => report.lesson)
  reports: Report[];

  @OneToMany(() => Quiz, (quiz) => quiz.lesson, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  }) 
  quizes: Quiz[];

  protected url: string;
  @AfterLoad()
  createVirtualField() {
    this.url = `${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get SubTitle(): string {
    return this.sub?.title;
  }

  @Expose() get courseTitle(): string {
    return this.sub?.courseName;
  }
  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(7);
    this.slug = slug(this.title, "_");
  }
}
