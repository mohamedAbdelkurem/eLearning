import {
  Entity as ToEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeid } from "../utils/helpers";
import Course from "./Course";

@ToEntity("certificates")
export default class Certificate extends Entity {
  constructor(certificates: Partial<Certificate>) {
    super();
    Object.assign(this, certificates);
  }
  @Index()
  @Column({ unique: true })
  identifier: string; // 7 char ID

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.certificates, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Course, (course: Course) => course.certificates, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  course: Course;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(10);
  }
}
