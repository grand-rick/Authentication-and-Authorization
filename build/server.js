"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var articles_1 = __importDefault(require("./handlers/articles"));
var app = (0, express_1.default)();
var port = 3000;
var corsOptions = {
    origin: 'https://someotherdomain.com',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('common'));
(0, articles_1.default)(app);
app.get('/', function (req, res) {
    res.send('This is the homepage');
});
app.get('/test-cors', (0, cors_1.default)(corsOptions), function (req, res) {
    res.json({ msg: 'This is CORS-enabled with a middle ware' });
});
app.listen(port, function () {
    console.log("Server started at http://localhost:".concat(port));
});
