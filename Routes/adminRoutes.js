const experss = require('express');
const router = experss.Router();

router.post('/setfields', (req, res) => {
    res.send('set fields');
});

module.exports = router;