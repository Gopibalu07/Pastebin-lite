const router = require("express").Router();
const controller = require("../controllers/pasteController");
const validate = require("../middleware/validatePaste");

router.post("/", validate, controller.createPaste);
router.get("/:id", controller.fetchPaste);

module.exports = router;
