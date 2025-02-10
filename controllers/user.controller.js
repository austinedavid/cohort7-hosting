const userModel = require("../models/user.model");
const kycModel = require("../models/kyc");
const articleModel = require("../models/article.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");

// creating a user function
const createUser = async (req, res) => {
  const { password, ...others } = req.body;
  // hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  // check user existence
  const isUser = await userModel.findOne({ email: others.email });
  if (isUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const newUser = new userModel({ ...others, password: hashedPassword });
    await newUser.save();
    res.status(201).send("user created successfully");
  } catch (error) {
    res.send(error);
  }
};

// getting all the user
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.send("something went wrong");
  }
};
// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    await userModel.findByIdAndDelete(id);
    res.status(200).send("user deleted successfully");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};
// update a user
const updateUser = async (req, res) => {
  const { id, name, age } = req.body;
  try {
    await userModel.findByIdAndUpdate(id, { name, age }, { new: true });
    res.status(200).send("user updated successfully");
  } catch (error) {
    res.send("something went wrong");
  }
};
// get one user
const getOneUser = async (req, res) => {
  const user = req.user;
  try {
    const oneUser = await userModel.findById(user).populate("articles");
    res.json(oneUser);
  } catch (error) {
    res.send("something went wrong");
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "provide valid credentials" });
  }
  // Check if user exists
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return res.status(404).json({ message: "user not found, please register" });
  }
  // check password
  const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "password is not valid" });
  }
  // create jwt token
  const token = jwt.sign({ id: checkUser.id }, process.env.JWT_SECRETE);
  // then return the persons information to the frontend
  return res
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json(checkUser);
};

// submit kyc
const createKyc = async (req, res) => {
  const body = req.body;
  const user = req.user;
  try {
    // first create the kyc
    const kyc = new kycModel({ ...body, user });
    const savedKyc = await kyc.save();
    // second update the user model kyc field
    await userModel.findByIdAndUpdate(
      user,
      { kyc: savedKyc.id },
      { new: true }
    );
    res.send("kyc created successfully");
  } catch (error) {
    res.send("something went wrong");
  }
};

// get one kyc
const getKyc = async (req, res) => {
  const { id } = req.params;
  try {
    const oneKyc = await kycModel
      .findById(id)
      .populate({ path: "user", select: "name email -_id" });
    res.json(oneKyc);
  } catch (error) {
    res.send("something went wrong");
  }
};

// create an article
const createArticle = async (req, res) => {
  const user = req.user;
  const { title, desc, authors } = req.body;
  authors.push(user);
  try {
    // create new article first
    const article = new articleModel({ title, desc, authors });
    const savedArticle = await article.save();
    // add the article id to the users article field
    await Promise.all(
      authors.map(async (userId) => {
        // find the authors first
        const contributorInfo = await userModel.findById(userId);
        const articlesArray = contributorInfo.articles;
        articlesArray.push(savedArticle.id);
        // update the user now
        await userModel.findByIdAndUpdate(
          userId,
          { articles: articlesArray },
          { new: true }
        );
      })
    );
    res.json({ message: "successful" });
  } catch (error) {
    return res.send("something went wrong");
  }
};

const getOneArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const oneArticle = await articleModel
      .findById(id)
      .populate({ path: "authors", select: "name email" });
    res.json(oneArticle);
  } catch (error) {
    res.send("something went wrong");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getOneUser,
  loginUser,
  createKyc,
  getKyc,
  createArticle,
  getOneArticle,
};
