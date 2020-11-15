"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var prisma = new client_1.PrismaClient();
var app = express_1["default"]();
app.use(express_1["default"].json());
var userValidationRules = [
    express_validator_1.body('email')
        .isLength({ min: 1 })
        .withMessage('Email must not be empty')
        .isEmail()
        .withMessage('Must be a valid email address'),
    express_validator_1.body('name').isLength({ min: 1 }).withMessage('Name must not be empty'),
    express_validator_1.body('role')
        .isIn(['ADMIN', 'USER', 'SUPERADMIN', undefined])
        .withMessage("Role must be one of 'ADMIN', 'USER', 'SUPERADMIN'"),
];
var simpleVadationResult = express_validator_1.validationResult.withDefaults({
    formatter: function (err) { return err.msg; }
});
var checkForErrors = function (req, res, next) {
    var errors = simpleVadationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.mapped());
    }
    next();
};
// Create
app.post('/users', userValidationRules, checkForErrors, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, role, existingUser, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, role = _a.role;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma.user.findOne({ where: { email: email } })];
            case 2:
                existingUser = _b.sent();
                if (existingUser)
                    throw { email: 'Email already exists' };
                return [4 /*yield*/, prisma.user.create({
                        data: { name: name, email: email, role: role }
                    })];
            case 3:
                user = _b.sent();
                return [2 /*return*/, res.json(user)];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.status(400).json(err_1)];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Read
app.get('/users', function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findMany({
                        select: {
                            uuid: true,
                            name: true,
                            role: true,
                            posts: {
                                select: {
                                    body: true,
                                    title: true
                                }
                            }
                        }
                    })];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json(users)];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(500).json({ error: 'Something went wrong' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update
app.put('/users/:uuid', userValidationRules, checkForErrors, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, role, uuid, user, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, role = _a.role;
                uuid = req.params.uuid;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma.user.findOne({ where: { uuid: uuid } })];
            case 2:
                user = _b.sent();
                console.log(user);
                if (!user)
                    throw { user: 'User not found' };
                return [4 /*yield*/, prisma.user.update({
                        where: { uuid: uuid },
                        data: { name: name, email: email, role: role }
                    })];
            case 3:
                user = _b.sent();
                return [2 /*return*/, res.json(user)];
            case 4:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.status(404).json(err_3)];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Delete
app["delete"]('/users/:uuid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user["delete"]({ where: { uuid: req.params.uuid } })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: 'User deleted' })];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.status(500).json({ error: 'Something went wrong' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Find
app.get('/users/:uuid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findOne({ where: { uuid: req.params.uuid } })];
            case 1:
                user = _a.sent();
                return [2 /*return*/, res.json(user)];
            case 2:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.status(404).json({ user: 'User not found' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
var postValidationRules = [
    express_validator_1.body('title').isLength({ min: 1 }).withMessage('Title must not be empty'),
];
// Create a post
app.post('/posts', postValidationRules, checkForErrors, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, body, userUuid, post, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, body = _a.body, userUuid = _a.userUuid;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.post.create({
                        data: { title: title, body: body, user: { connect: { uuid: userUuid } } }
                    })];
            case 2:
                post = _b.sent();
                return [2 /*return*/, res.json(post)];
            case 3:
                err_6 = _b.sent();
                console.log(err_6);
                return [2 /*return*/, res.status(500).json(err_6)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Read all posts
app.get('/posts', function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.post.findMany({
                        orderBy: { createdAt: 'desc' },
                        include: { user: true }
                    })];
            case 1:
                posts = _a.sent();
                return [2 /*return*/, res.json(posts)];
            case 2:
                err_7 = _a.sent();
                console.log(err_7);
                return [2 /*return*/, res.status(500).json(err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(5000, function () { return console.log('Server running at http://localhost:5000'); });
//# sourceMappingURL=app.js.map