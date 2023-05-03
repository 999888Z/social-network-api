const router = require("express").Router();
const { User } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
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
        const user = await User.findOne({ _id: req.params._id })
       
  
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
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
          { email: req.body.email,
            username: req.body.username
         },
          {  new: true }
        );
  
        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found with that ID :(' })
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }




})

router.delete("/:_id", async (req, res) => {
    try {
        const user = await User.findOneAndRemove({ _id: req.params._id });
  
        if (!user) {
          return res.status(404).json({ message: 'No such user exists' })
        }
  
        // const course = await Course.findOneAndUpdate(
        //   { students: req.params.studentId },
        //   { $pull: { students: req.params.studentId } },
        //   { new: true }
        // );
  
        // if (!course) {
        //   return res.status(404).json({
        //     message: 'Student deleted, but no courses found',
        //   });
        // }
  
        res.json({ message: 'User successfully deleted' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }  
})

module.exports = router;
