import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import slug from "slug";
import { makeid } from "../utils/helpers";
import InterestedPerson from "./InterestedPerson";
import { Expose } from "class-transformer";

@TOEntity("products")
export default class Product extends Entity {
  constructor(product: Partial<Product>) {
    super();
    Object.assign(this, product);
  }
  @Index()
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: "defaultProduct.jpg" })
  imageUrn: string;

  @Column()
  description: string;

  @OneToMany(
    () => InterestedPerson,
    (interestedPerson) => interestedPerson.product
  )
  interestedPersons: InterestedPerson[];

  @BeforeInsert()
  makeIdAndSlug() {
    this.slug = slug(this.title, "_") + "_" + makeid(3);
  }
  @Expose() get interestedPersonsCount(): number {
    return this.interestedPersons?.length;
  }
}
