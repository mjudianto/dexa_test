const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, userId } = await authService.login(email, password);
    res.status(200).json({ token, userId });
  } catch (err) {
    // console.log(err);
    res.status(err.status || 500).json({ error: err });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, userId } = await authService.loginAdmin(email, password);
    res.status(200).json({ token, userId });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
