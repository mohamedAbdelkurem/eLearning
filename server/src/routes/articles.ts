//Express
import { Request, Response, Router } from "express";
//Helpers
import { isEmpty } from "class-validator";
import slug from "slug";
import { makeid } from "../utils/helpers";
const Paginator = require("paginator");
//Types
import { UploadedFile } from "express-fileupload";

//TypeORM
import { getConnection } from "typeorm";

//Entities
import Article from "../entities/Article";
import ArticleCategory from "../entities/ArticleCategories";
//Middlewears
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import user from "../middlewears/user";

//NODE
import path from "path";
import fs from "fs";

//!Create Category
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ArticleCategory.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};

const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await ArticleCategory.findOne(req.body.id);
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
const createCategory = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  let errors: any = {};

  try {
    if (isEmpty(title)) errors.title = "this field is required";
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const newcategory = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ArticleCategory)
      .values([{ title, description }])
      .execute();

    return res.status(200).json(newcategory);
  } catch (error) {
    switch (error.message) {
      case "input error":
        return res.status(404).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
const deleteCategory = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const category = await ArticleCategory.findOne(req.params.id);
    if (!category) throw new Error("category not found");
    await ArticleCategory.delete(req.params.id);
    return res.status(200).json({ success: "category deleted succefully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};
const updateCategory = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const id = req.params.id;
  let errors: any = {};

  try {
    if (isEmpty(title)) errors.title = "this field is required";
    const category = await ArticleCategory.findOne(id);
    if (!category) throw new Error("course not found");
    if (Object.keys(errors).length > 0) throw new Error("input error");

    await getConnection()
      .createQueryBuilder()
      .update(ArticleCategory)
      .set({
        title,
        description,
      })
      .where("id = :id", { id })
      .execute();
    return res.status(200).json({ success: "category updated" });
  } catch (error) {
    switch (error.message) {
      case "category not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(404).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//!GET ARTICLES
const getArticles = async (_: Request, res: Response) => {
  try {
    const articles = await Article.find({relations:["articleCategory"]});
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
const getArticlesFiltred = async (req: Request, res: Response) => {
  const {id} = req.params
  try {
    const articles = await Article.find({relations:["articleCategory"] , where:{
      articleCategory:{
        id
      }
    }});
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//!GET ARTICLES PAGINATED
interface Query {
  current: string;
}
const getArticlesPaginated = async (
  req: Request<{}, {}, {}, Query>,
  res: Response
) => {
  try {
    const take = 3;
    const current = parseInt(req.query.current);
    const skip = (current - 1) * 3;
    const paginator = new Paginator(take, skip);
    const articles = await Article.find({ skip, take ,relations:["articleCategory"]});
    const articlesCount = await Article.findAndCount();
    var infos = paginator.build(articlesCount[1], current);
    return res.status(200).json({ articles, infos });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
const getArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await Article.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!article) throw new Error("article not found");
    return res.status(200).json(article);
  } catch (error) {
    switch (error.message) {
      case "article not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//!DELETE ARTICLE
const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await Article.findOne(id);
    if (!article) throw new Error("article not found");
    await Article.delete(id);
    if (article.imageUrn !== "default.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        article.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }

    return res.status(200).json({ success: "article is deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "article not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! CREATE ARTICLE

const createArticle = async (req: Request, res: Response) => {
  //Initialize Error Object
  const errors: any = {};
  //Get FormDATA from body
  const { title, body, id } = req.body;
  let picture = req.files?.picture as UploadedFile;
  const user = res.locals.user;
  console.log(req.body)
  // Validation
  if (isEmpty(title)) errors.title = "this field is required";
  try {
    //Throw ERRORS if there's an error
    if (Object.keys(errors).length > 0) throw TypeError("missing inputs");
    const articleCategory = await ArticleCategory.findOne(id);
    if (!articleCategory) throw new Error("category not found");
    //Default file name in case the user didnt upload a picture
    let pictureName = "default.jpg";

    //Upload picture if it exists
    if (picture) {
      pictureName = makeid(9) + "." + picture.name.split(".").pop();
      let uploadPath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        pictureName
      );
      picture.mv(uploadPath, (err: any) => {
        if (err) {
          return res.status(403).json("error");
        }
        return;
      });
    }

    // Create article and save it to DB
    const article = await new Article({
      title,
      body,
      username: user.username,
      imageUrn: pictureName,
      articleCategory
    }).save();
    return res.status(200).json(article);
  } catch (error) {
    console.log(error);
    
    switch (error.message) {
      case "missing inputs":
        return res.status(401).json(errors);
      case "category not found":
        return res.status(401).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! UPDATE  ARTICLE
const updateArticle = async (req: Request, res: Response) => {
  let errors: any = {};
  const { title, body } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(body)) errors.body = "body cannot be empty";
  try {
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const article = await Article.findOne({
      where: { id: req.params.id },
    });
    if (!article) throw new Error("article not found");
    const updatedArticle = await getConnection()
      .createQueryBuilder()
      .update(Article)
      .set({
        title,
        body,
        slug: slug(title, "_"),
      })
      .where("id = :id", {
        id: req.params.id,
      })
      .execute();
    return res.status(200).json(updatedArticle);
  } catch (error) {
    switch (error.message) {
      case "article not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const router = Router();
//
router.get("/categories/", getCategories);
router.get("/category/:id", getCategory);
router.delete("/category/:id", user, auth, editor, deleteCategory);
router.post("/category/", user, auth, editor, createCategory);
router.put("/category/:id", user, auth, editor, updateCategory);
//
router.get("/", user, auth, editor, getArticles);
router.get("/filtred/:id",getArticlesFiltred);
router.get("/paginate/", getArticlesPaginated);
router.get("/:id", getArticle);
router.delete("/:id", user, auth, editor, deleteArticle);
router.post("/", user, auth, editor, createArticle);
router.put("/:id", user, auth, editor, updateArticle);

export default router;
