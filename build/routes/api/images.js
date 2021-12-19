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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var ApiError_1 = __importDefault(require("../../middleware/ApiError"));
// constants
var images = ['fjord', 'encenadaport', 'palmtunnel', 'santamonica', 'icelandwaterfall'];
var imagePath = path_1.default.resolve(__dirname, '../../images');
var imageThumbnailPath = path_1.default.resolve(__dirname, '../../images/thumbnails');
// images Router
var imagesRouter = express_1.default.Router();
// using the default way of validating result from express validator and handle errors
var validateQueryParams = function (req, res, next) {
    // format error message
    var errorFormatter = function (_a) {
        var msg = _a.msg, param = _a.param;
        return "[".concat(param, "]: ").concat(msg);
    };
    var errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: 'error',
            errors: errors.array({ onlyFirstError: true })
        });
    }
    return next();
};
// returns a boolean in which the file path exists or not
var fileExists = function (filePath) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fs_1.promises.stat(filePath).catch(function (e) { return false; })];
        case 1: return [2 /*return*/, !!(_a.sent())];
    }
}); }); };
imagesRouter.get('/', [
    (0, express_validator_1.query)('width')
        .exists()
        .withMessage('Image height must have a value.')
        .toInt()
        .isInt({ max: 1000 })
        .withMessage('The max width should be 1000.'),
    (0, express_validator_1.query)('height')
        .exists()
        .withMessage('Image height must have a value.')
        .toInt()
        .isInt({ max: 1000 })
        .withMessage('The max height should be 1000.'),
    (0, express_validator_1.query)('filename')
        .exists()
        .withMessage('filename must have a value.')
        .isIn(images)
        .withMessage('Image does not exist, please write a correct image name!')
], validateQueryParams, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, width, height, filename, thumbnailImage, imageToRender, isFileExist;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, width = _a.width, height = _a.height, filename = _a.filename;
                thumbnailImage = "".concat(imageThumbnailPath, "/").concat(filename, "-").concat(width, "-").concat(height, ".jpg");
                imageToRender = "".concat(filename, "-").concat(width, "-").concat(height, ".jpg");
                // check if the thumbnails directory exist ( if not fs will create it )
                return [4 /*yield*/, fs_1.promises.mkdir(imageThumbnailPath, { recursive: true })
                    // check if the image thumbnail already exists using the fs
                ];
            case 1:
                // check if the thumbnails directory exist ( if not fs will create it )
                _b.sent();
                return [4 /*yield*/, fileExists(thumbnailImage)];
            case 2:
                isFileExist = _b.sent();
                if (isFileExist) {
                    // Thumbnail image is there ( no need to create it )
                    console.log('image already exist');
                    res.render('index', { title: 'Image Already exists', image: imageToRender });
                }
                else {
                    // Thumbnail image isn't there ( we have to create it )
                    // resize image using sharp
                    (0, sharp_1.default)("".concat(imagePath, "/").concat(filename, ".jpg"))
                        .resize(Number(parseInt(width, 10)), Number(parseInt(height, 10)))
                        .toFile(thumbnailImage)
                        .then(function () { return res.render('index', { title: 'Hoooooray! a new image created.', image: imageToRender }); })
                        .catch(function (err) { return next(ApiError_1.default.badRequest(err.message)); });
                }
                return [2 /*return*/];
        }
    });
}); });
exports.default = imagesRouter;
