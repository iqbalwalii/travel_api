const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blogs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.split(" ").join(""));
  },
});
const uploadImg = multer({ storage: storage });

async function getBlog(req, res, next) {
  try {
    blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: "blog Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.blog = blog;
  next();
}
/**
 *  @swagger
 *  components:
 *   schemas:
 *     blogs:
 *        type: object
 *        required:
 *         - title
 *         - description
 *         - image
 *        properties:
 *          id:
 *            type: string
 *            description: auto generated id
 *          title:
 *            type: string
 *            description: the name of the tour
 *          description:
 *            type: Array
 *            description: details of number of people for Blogs
 *        example:
 *            id: d5s8879364
 *            title: pahalgam
 *            description: ['abc', 'def']
 */

/**
 * @swagger
 * tags:
 *  name: Blogs
 *  description: The Blogs managing API
 */

/**
 * @swagger
 * /blogs:
 *  get:
 *    summary: returns list of all blogs
 *    tags: [Blogs]
 *    responses:
 *      200:
 *        description: the list of blogs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blogs'
 */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
/**
 * @swagger
 * /blogs/{id}:
 *  get:
 *    summary: returns list of specific blog
 *    tags: [Blogs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the booking id
 *    responses:
 *      200:
 *        description: the specific blog
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/blogs'
 *      404:
 *        description : The blog was not Found
 */

router.get("/:id", getBlog, (req, res) => {
  console.log("wali", blog);
  res.status(200).json(blog);
});

/**
 * @swagger
 * /blogs:
 *  post:
 *    summary: Creates a Booking
 *    tags: [Blogs]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Booking'
 *    responses:
 *      200:
 *        description: Booking was successfully Created
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Booking'
 *      500:
 *        description : Server Error
 */
router.post("/", uploadImg.single("image"), async (req, res) => {
  const url = process.env.SERVER + "/uploads/blog" + req.file.filename;
  const blog = new Blog({
    ...req.body,
    image: url,
  });
  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
router.post("/img", uploadImg.single("image"), async (req, res) => {
  console.log(req.file);
});

/**
 * @swagger
 * /blogs/{id}:
 *  patch:
 *    summary: updates a specific  tour
 *    tags: [Blogs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the booking id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Booking'
 *    responses:
 *      200:
 *        description: the updated Booking
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Booking'
 *      404:
 *        description : Booking Not Found
 *      500:
 *        description : Server Error
 */

//updating

router.patch("/:id", getBlog, async (req, res) => {
  const values = Object.keys(req.body);
  if (req.body.length !== null && Object.keys(req.body).length !== 0) {
    values.map((value) => (res.blog[value] = req.body[value]));
    res.blog.modified_at = Date.now();
  }
  console.log(values);
  try {
    const updatedBlog = await res.blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /blogs/{id}:
 *  delete:
 *    summary: delete a specific  tour
 *    tags: [Blogs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the booking id
 *    responses:
 *      200:
 *        description: the deleted Booking
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blogs'
 */
// deleting one
router.delete("/:id", getBlog, async (req, res) => {
  try {
    await res.blog.remove();
    res.json({ message: "deleted Booking" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
