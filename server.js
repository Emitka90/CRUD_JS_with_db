// Импортируем модуль http, чтобы использовать HTTP-интерфейсы
const http = require('http');

const routeHandler = require('./routes/router');

const server = http.createServer(routeHandler);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});


