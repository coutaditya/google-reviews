const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const adminRouter = require("./admin");

router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;