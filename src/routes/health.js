const router = require("express").Router();
const pool = require("../config/db");

router.get("/healthz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
