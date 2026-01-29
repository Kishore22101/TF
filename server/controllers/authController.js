exports.login = (req, res) => {
  const { username, password } = req.body;

  // SIMPLE ROLE STORE (can move to DB later)
  const USERS = [
    { username: "super", password: "super@2026", role: "SUPER_ADMIN" },
    { username: "scanner", password: "scan@2026", role: "SCANNER" },
    { username: "viewer", password: "view@2026", role: "VIEWER" }
  ];

  const user = USERS.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false });
  }

  res.json({
    success: true,
    role: user.role
  });
};
