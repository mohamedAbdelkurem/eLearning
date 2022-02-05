//Express
import { Request, Response, Router } from "express";
//Helpers
import { isEmail, isEmpty } from "class-validator";
import slug from "slug";
import { makeid } from "../utils/helpers";
//Types
import { UploadedFile } from "express-fileupload";

//TypeORM
import { getConnection } from "typeorm";

//Entities
import Product from "../entities/Product";

//Middlewears
import auth from "../middlewears/auth";
import user from "../middlewears/user";

//NODE
import path from "path";
import fs from "fs";
import admin from "../middlewears/admin";
import InterestedPerson from "../entities/InterestedPerson";

//!GET PRODUCTS
const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await Product.find({
      relations: ["interestedPersons"],
      order: { createdAt: "ASC" },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
const getProductsPaginated = async (_: Request, res: Response) => {
  try {
    const products = await Product.find({
      order: { createdAt: "DESC" },
      take:3
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//!GET PRODUCT
const getProduct = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({
      where: { slug },
      relations: ["interestedPersons"],
    });
    if (!product) throw new Error("product not found");
    return res.status(200).json(product);
  } catch (error) {
    switch (error.message) {
      case "product not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//!DELETE PRODUCT
const deleteProduct = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ where: { slug } });
    if (!product) throw new Error("product not found");
    await Product.delete(product.id);
    if (product.imageUrn !== "defaultProduct.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/products/",
        product.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }
    return res.status(200).json({ success: "product is deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "product not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! CREATE PRODUCT

const createProduct = async (req: Request, res: Response) => {
  //Initialize Error Object
  const errors: any = {};
  //Get FormDATA from body
  const { title, description } = req.body;
  let picture = req.files?.picture as UploadedFile;
  // Validation
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(description)) errors.body = "description cannot be empty";
  try {
    //Throw ERRORS if there's an error
    if (Object.keys(errors).length > 0) throw TypeError("missing inputs");
    //Default file name in case the user didnt upload a picture
    let pictureName = "defaultProduct.jpg";
    //Upload picture if it exists
    if (picture) {
      pictureName = makeid(9) + "." + picture.name.split(".").pop();
      let uploadPath = path.join(
        __dirname,
        "../../",
        "public/uploads/products/",
        pictureName
      );
      picture.mv(uploadPath, (err: any) => {
        if (err) {
          return res.status(403).json("error");
        }
        return;
      });
    }
    // Create product and save it to DB
    const product = await new Product({
      title,
      description,
      imageUrn: pictureName,
    }).save();
    return res.status(200).json(product);
  } catch (error) {
    if (error.message === "missing inputs") {
      return res.status(401).json(errors);
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! UPDATE  PRODUCT
const updateProduct = async (req: Request, res: Response) => {
  let errors: any = {};
  const { title, description } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(description)) errors.description = "description cannot be empty";
  try {
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const product = await Product.findOne({
      where: { slug: req.params.slug },
    });
    if (!product) throw new Error("product not found");
    const updatedProduct = await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({
        title,
        description,
        slug: slug(title, "_") + "_" + makeid(3),
      })
      .where("slug = :slug", {
        slug: req.params.slug,
      })
      .execute();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    switch (error.message) {
      case "product not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

// interested

const addInterest = async (req: Request, res: Response) => {
  const errors: any = {};
  const { email, fullName } = req.body;
  const slug = req.params.slug;
  try {
    //Check if product is actually exists
    const product = await Product.findOne({ where: { slug } });
    if (!product) throw new Error("product not found");
    // validate email & fullName
    if (isEmpty(email)) errors.email = "please insert a valid email";
    if (!isEmail(email)) errors.email = "please insert a valid email";
    if (isEmpty(fullName)) errors.fullName = "this field is required";
    if (Object.keys(errors).length > 0) throw new Error("validation error");
    const checkIfAlreadyInterested = await InterestedPerson.findOne({
      where: { email, product },
    });

    if (checkIfAlreadyInterested)
      throw new Error("you are already interested on this product");
    await InterestedPerson.create({ email, fullName, product }).save();
    return res
      .status(200)
      .json({ success: "you are interested on this product" });
  } catch (error) {

    switch (error.message) {
      case "you are already interested on this product":
        return res
          .status(403)
          .json({
            errors: {
              alreadyInterested: "you are already interested on this product",
            },
          });
      case "product not found":
        return res.status(404).json({ error: error.message });
      case "validation error":
        return res.status(403).json({ errors });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const removeInterest = async (req: Request, res: Response) => {
  const { email } = req.body;
  const slug = req.params.slug;
  try {
    //Check if product is actually exists
    const product = await Product.findOne({ where: { slug } });
    if (!product) throw new Error("product not found");
    // check if this person is interested on this product
    const checkIfAlreadyInterested = await InterestedPerson.findOne({
      where: { email },
    });
    if (!checkIfAlreadyInterested)
      throw new Error("you are not interested on this product");
    //remove Interest
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(InterestedPerson)
      .where("slug = :slug", { slug })
      .execute();

    return res
      .status(200)
      .json({ success: "you are no longer intersted on this product" });
  } catch (error) {
    switch (error.message) {
      case "you are not interested on this product":
        return res.status(403).json({ error: error.message });
      case "product not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const deleteInterestedPerson = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const interestedPerson = await InterestedPerson.findOne(id);
    if (!interestedPerson) throw new Error("this record is not found");
    await InterestedPerson.delete(id);
    return res.status(200).json({ succes: "record deleted" });
  } catch (error) {
    switch (error.message) {
      case "this record is not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const confirmInterestedPerson = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const interestedPerson = await InterestedPerson.findOne(id);
    if (!interestedPerson) throw new Error("this record is not found");
    await getConnection()
      .createQueryBuilder()
      .update(InterestedPerson)
      .set({
        status: !interestedPerson.status,
      })
      .where("id = :id", { id })
      .execute();
    return res.status(200).json({ succes: "record updated" });
  } catch (error) {
    switch (error.message) {
      case "this record is not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
const router = Router();

//admin routes
router.get("/", getProducts);
router.get("/paginated", getProductsPaginated);
router.get("/:slug", getProduct);
router.delete("/:slug", user, auth, admin, deleteProduct);
router.post("/", user, auth, admin, createProduct);
router.put("/:slug", user, auth, admin, updateProduct);
router.delete(
  "/interestedPersons/:id",
  user,
  auth,
  admin,
  deleteInterestedPerson
);
router.put(
  "/interestedPersons/:id",
  user,
  auth,
  admin,
  confirmInterestedPerson
);

//user routes
router.post("/addInterest/:slug", addInterest);
router.delete("/removeInterest/:slug", removeInterest);

export default router;
