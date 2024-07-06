const data = require('../../sql3-data');

module.exports = (req, res) => {
    const id =parseInt(req.url.split('/')[2]);
    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', async () => {
        const parsedBody = new URLSearchParams(body);
        const updatedData = {};
        parsedBody.forEach((value, key) => {
            updatedData[key] = key === 'age' ? parseInt(value) : value;
        });

        const updatedUser = await data.updateUser(id, updatedData);

        if (updatedUser) {
            res.writeHead(200);
            res.end(JSON.stringify(updatedUser));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Пользователь не найден'}))
        }
    });
};