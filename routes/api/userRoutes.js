const router = require("express").Router();
const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create(req.body);
    res.json(dbUserData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params._id });

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:_id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params._id },
      { email: req.body.email, username: req.body.username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const userThought = await User.findOne({ _id: req.params._id });
    const thoughtId = userThought.thoughts;

    for (let index = 0; index < thoughtId.length; index++) {
      allThoughts = thoughtId[index]
        .toString()
        .replace(/ObjectId("(.*)")/, "$1");
      console.log(typeof allThoughts);
      await Thought.findOneAndRemove({ _id: allThoughts });
    }

    const user = await User.findOneAndRemove({ _id: req.params._id });

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    res.json({ message: "User successfully deleted and all of user thoughts" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//Friend routes
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const userFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },

      { new: true }
    );
    res.json({ message: "Friend successfully added" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const userFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },

      { new: true }
    );
    res.json({ message: "Friend successfully removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
