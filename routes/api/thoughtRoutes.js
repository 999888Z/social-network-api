const router = require("express").Router();
const { Thought, User } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params._id });

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const dbThoughtData = await Thought.create(req.body);

    const userThought = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: dbThoughtData._id } },

      { new: true }
    );
    res.json(dbThoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:_id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params._id },
      { thoughtText: req.body.thoughtText },

      { new: true }
    );

    if (!thought) {
      return res
        .status(404)
        .json({ message: "No thought found with that ID :(" });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndRemove({ _id: req.params._id });

    if (!thought) {
      return res.status(404).json({ message: "No such thought exists" });
    }

    res.json({ message: "Thought successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//creates a reaction and adds to the existing user thought
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const userReaction = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {$push: { reactions: req.body }},

      { new: true }
    );
    res.status(200).json(userReaction);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//deletes a specific reaction  url: thoughtId/reactions/reactionId
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
    try {
        const userReaction = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          {$pull: { reactions:{reactionId: req.params.reactionId }}},
    
          { new: true }
        );
        res.json({ message: "Reaction successfully deleted" });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }



});

module.exports = router;
