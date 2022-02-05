import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import slug from "slug";
import ArticleCategory from "./ArticleCategories";

@TOEntity("articles")
export default class Article extends Entity {
  constructor(article: Partial<Article>) {
    super();
    Object.assign(this, article);
  }
  @Index()
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.articles, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(
    () => ArticleCategory,
    (articleCategory: ArticleCategory) => articleCategory.articles,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    }
  )
  @JoinColumn()
  articleCategory: ArticleCategory;

  @BeforeInsert()
  makeIdAndSlug() {
    this.slug = slug(this.title, "_");
  }
}
