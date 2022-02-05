import { Column, Entity as TOEntity, ManyToOne } from "typeorm";

import Entity from "./Entity";
import Product from "./Product";

@TOEntity("interestedPersons")
export default class InterestedPerson extends Entity {
  constructor(interestedPerson: Partial<InterestedPerson>) {
    super();
    Object.assign(this, interestedPerson);
  }
  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column({ default: false })
  status: boolean;
  
  @ManyToOne(() => Product, (product) => product.interestedPersons, {
    nullable: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  product: Product;
}
