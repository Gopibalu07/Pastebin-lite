const idGen = require("../utils/id");
const pasteService = require("../services/pasteService");
const getNow = require("../middleware/testTime");

exports.createPaste = async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;
  const id = idGen();
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  let expiresAt = null;
  if (ttl_seconds) {
    expiresAt = new Date(Date.now() + ttl_seconds * 1000);
  }

  await pasteService.createPaste({
    id,
    content,
    expiresAt,
    maxViews: max_views || null,
  });

  res.json({
    id,
    url: `${baseUrl}/p/${id}`,
  });
};

exports.fetchPaste = async (req, res) => {
  const paste = await pasteService.getPaste(req.params.id);
  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  if (paste.expires_at && now > paste.expires_at) {
    return res.status(404).json({ error: "Expired" });
  }

  if (paste.max_views && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  await pasteService.incrementViews(paste.id);

  res.json({
    content: paste.content,
    remaining_views: paste.max_views
      ? paste.max_views - (paste.views + 1)
      : null,
    expires_at: paste.expires_at,
  });
};

exports.renderPaste = async (req, res) => {
  const paste = await pasteService.getPaste(req.params.id);
  if (!paste) return res.status(404).send("Not found");

  const now = getNow(req);
  if (
    (paste.expires_at && now > paste.expires_at) ||
    (paste.max_views && paste.views >= paste.max_views)
  ) {
    return res.status(404).send("Not found");
  }

  await pasteService.incrementViews(paste.id);

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <html>
      <body>
        <pre>${paste.content
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</pre>
      </body>
    </html>
  `);
};
