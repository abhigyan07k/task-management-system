const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Protected route------------>
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
