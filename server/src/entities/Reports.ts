import { Entity as TOEntity, JoinColumn, ManyToOne } from "typeorm";

import Entity from "./Entity";
import Lesson from "./Lesson";

@TOEntity("reports")
export default class Report extends Entity {
  constructor(report: Partial<Report>) {
    super();
    Object.assign(this, report);
  }
  @ManyToOne(() => Lesson, (lesson) => lesson.reports, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  lesson: Lesson;
}
