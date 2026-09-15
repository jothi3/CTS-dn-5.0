import { Router } from 'express';
import { UserService } from '../services/userService';

const router = Router();

// GET /login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please enter both email and password.' });
  }

  try {
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    const isValid = await UserService.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.redirect('/');
  } catch (error: any) {
    res.render('login', { error: 'An unexpected error occurred. Please try again.' });
  }
});

// GET /register
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('register', { error: null });
});

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.render('register', { error: 'Please fill in all required fields.' });
  }

  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match.' });
  }

  try {
    const existing = await UserService.findByEmail(email);
    if (existing) {
      return res.render('register', { error: 'An account with this email already exists.' });
    }

    const newUser = await UserService.createUser(name, email, password);
    req.session.user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };

    res.redirect('/');
  } catch (error: any) {
    res.render('register', { error: 'Failed to create account. Please try again.' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

export default router;
