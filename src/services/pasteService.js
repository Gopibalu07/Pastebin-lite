const pool = require("../config/db");

exports.createPaste = async ({ id, content, expiresAt, maxViews }) => {
  await pool.query(
    `INSERT INTO pastes (id, content, expires_at, max_views)
     VALUES ($1, $2, $3, $4)`,
    [id, content, expiresAt, maxViews]
  );
};

exports.getPaste = async (id) => {
  const { rows } = await pool.query("SELECT * FROM pastes WHERE id=$1", [id]);
  return rows[0];
};

exports.incrementViews = async (id) => {
  await pool.query("UPDATE pastes SET views = views + 1 WHERE id=$1", [id]);
};
