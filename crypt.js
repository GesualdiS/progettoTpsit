// https://web.archive.org/web/20190501051230/http://dustwell.com:80/how-to-handle-passwords-bcrypt.html
const bcrypt = require('bcrypt');

async function cryptPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, 10);
}


module.exports = {cryptPassword}