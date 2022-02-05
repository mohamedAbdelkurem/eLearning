import { IsEmail, Length } from "class-validator";
import {
  Entity as ToEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import Lesson from "./Lesson";
import Article from "./Article";
import Comment from "./Comment";
import Result from "./Result";
import ResultCourse from "./ResultCourse";
import Certificate from "./Certificate";

enum Role {
  ADMIN = "admin",
  EDITOR = "editor",
  USER = "user",
}

@ToEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: "please insert a valid email" })
  @Length(1, 255, { message: "this field cannot be empty" })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, {
    message: "username must contain at least 3 characters",
  })
  @Column({ unique: true })
  username: string;

  @Column({
    type: "enum",
    default: "user",
    enum: Role,
  })
  role: Role;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  facebookAccount: string;

  @Column({ nullable: true })
  instagramAccount: string;

  @Column({ nullable: true })
  whatsappAccount: string;

  @Column({ nullable: true })
  twitterAccount: string;

  @Column({ nullable: true })
  linkedinAccount: string;
  @Exclude()
  @Length(6, 255, {
    message: "password must containt at least 6 characters",
  })
  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ nullable: true })
  latestEmailConfirmedRequest: string;

  @Column({ default: "defaultpp.jpg" })
  imageUrn: string;


  @OneToMany(() => Lesson, (lesson) => lesson.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  lessons: Lesson[];

  @OneToMany(() => Article, (article) => article.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  articles: Article[];

  @OneToMany(() => Result, (result) => result.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  results: Result[];

  @OneToMany(() => Certificate, (certificate) => certificate.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  certificates: Certificate[];
  

  @OneToMany(() => ResultCourse, (resultCourse) => resultCourse.user)
  resultsCourse: ResultCourse[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
