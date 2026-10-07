// server.cjs — Custom JSON Server with simple auth
const jsonServer = require('json-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const JWT_SECRET = 'jobtracker-secret-key-change-in-production';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ---------- REGISTER ----------
server.post('/register', (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = router.db;
  const existing = db.get('users').find({ email }).value();

  if (existing) {
    return res.status(400).json({ message: 'Email is already in use' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Auto-generate a numeric ID
  const users = db.get('users').value();
  const nextId =
    users.length > 0
      ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1
      : 1;

  const newUser = {
    id: nextId,
    email,
    password: hashedPassword,
    username: username || email.split('@')[0],
  };

  db.get('users').push(newUser).write();

  const token = jwt.sign(
    { sub: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    accessToken: token,
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    },
  });
});

// ---------- LOGIN ----------
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = router.db;
  let user = db.get('users').find({ email }).value();

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // If user has no id (legacy records), assign one now
  if (!user.id) {
    const users = db.get('users').value();
    const nextId =
      users.length > 0
        ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1
        : 1;

    db.get('users').find({ email }).assign({ id: nextId }).write();
    user = { ...user, id: nextId };
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
});

// ---------- PROTECT /jobs ROUTES ----------
server.use((req, res, next) => {
  if (!req.path.startsWith('/jobs')) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// ---------- SCOPE JOBS TO LOGGED-IN USER ----------
server.use('/jobs', (req, res, next) => {
  if (req.method === 'GET') {
    req.query.userId = String(req.userId);
  }
  if (req.method === 'POST') {
    req.body.userId = req.userId;
  }
  next();
});

server.use(router);

server.listen(3001, () => {
  console.log(' JSON Server with auth running on port 3001');
  console.log('   Endpoints: /register, /login, /jobs');
});