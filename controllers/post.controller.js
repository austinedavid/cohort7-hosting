const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

const createPost = async (req, res) => {
  const user = req.user;
  const body = req.body;
  try {
    // create a new post
    const newPost = new postModel({ ...body, creator: user });
    const savedPost = await newPost.save();
    // modify the users account.
    const getUser = await userModel.findById(user);
    const allPostIds = getUser.posts;
    allPostIds.push(savedPost.id);
    await userModel.findByIdAndUpdate(
      user,
      { posts: allPostIds },
      { new: true }
    );
    res.json({ message: "post created successfully" });
  } catch (error) {
    console.log(error);
    res.send("something went wrong");
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await postModel
      .find()
      .select("title desc previewPix -_id")
      .populate({ path: "creatorId", select: "name email -_id" });
    res.json(allPosts);
  } catch (error) {
    res.send("something went wrong");
  }
};

const getOnePost = async (req, res) => {
  const { id } = req.params;
  try {
    const onePost = await postModel.findById(id).populate("creator");
    res.json(onePost);
  } catch (error) {
    res.send("something went wrong");
  }
};

const deletePost = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    // lets get the post first
    const post = await postModel.findById(id);
    // check if post exist, if not send error to user
    if (!post) {
      return res.send("this post does not exist");
    }
    //  check if the creator id in the post matches the creatorId passed in the body
    if (post.creatorId.toString() !== user) {
      return res.send("this post does not belong to you");
    }
    await postModel.findByIdAndDelete(id);
    res.send("post deleted successfully");
  } catch (error) {
    res.send("something went wrong");
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { id: postId, ...others } = req.body;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.json({ message: "post does not exist" });
    }
    if (post.creatorId != user) {
      return res.json({ message: "you are not the owner of the post" });
    }
    // now we update the post
    await postModel.findByIdAndUpdate(id, { ...others }, { new: true });
    res.json({ message: "post updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
};

// hsjjdjdjdhhhjajshshhjdjdjb.sjjjdjdjdhhdhdhdhdhdhdhhd
//   .sjjsjjsjsjsjjsjsjsjsjsjsjjsjsj;
// header = {
//   alg: "HS256",
//   type: "jwt",
// };

// payload = {
//   id: "227737377373728",
//   email: "david@gmail.com",
//   role: "admina",
// };

// signature = HMACSHA256(
//   hsjjdjdjdhhhjajshshhjdjdjd + "." + hshhshshshhshshshhhajja,
//   davidkskkjdkdkfjkfjjfkskjsjdjkdkjs
// );
