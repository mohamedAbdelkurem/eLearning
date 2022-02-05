import { Column, Entity as TOEntity, OneToMany } from "typeorm";
import Article from "./Article";

import Entity from "./Entity";
@TOEntity("articlecategories")
export default class ArticleCategory extends Entity {
  constructor(articleCategory: Partial<Article>) {
    super();
    Object.assign(this, articleCategory);
  }
  @Column()
  title: string;

  @Column({nullable:true})
  description: string;

  @OneToMany(() => Article, (article: Article) => article)
  articles: Article[];
}
