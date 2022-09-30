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
exports.__esModule = true;
exports.safelyGetDocumentReferences = exports.safelyGetCollectionsSnapshot = exports.batchExecutor = exports.sleep = exports.isRootOfDatabase = exports.isLikeDocument = exports.getDBReferenceFromPath = exports.getFirestoreDBReference = exports.getCredentialsFromFile = void 0;
var admin = require("firebase-admin");
var load_json_file_1 = require("load-json-file");
var SLEEP_TIME = 1000;
var getCredentialsFromFile = function (credentialsFilename) {
    return (0, load_json_file_1["default"])(credentialsFilename);
};
exports.getCredentialsFromFile = getCredentialsFromFile;
var getFirestoreDBReference = function (credentials) {
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
        databaseURL: "https://".concat(credentials.project_id, ".firebaseio.com")
    });
    return admin.firestore();
};
exports.getFirestoreDBReference = getFirestoreDBReference;
var getDBReferenceFromPath = function (db, dataPath) {
    var startingRef;
    if (dataPath) {
        var parts = dataPath.split('/').length;
        var isDoc = parts % 2 === 0;
        startingRef = isDoc ? db.doc(dataPath) : db.collection(dataPath);
    }
    else {
        startingRef = db;
    }
    return startingRef;
};
exports.getDBReferenceFromPath = getDBReferenceFromPath;
var isLikeDocument = function (ref) {
    return ref.collection !== undefined;
};
exports.isLikeDocument = isLikeDocument;
var isRootOfDatabase = function (ref) {
    return ref.batch !== undefined;
};
exports.isRootOfDatabase = isRootOfDatabase;
var sleep = function (timeInMS) { return new Promise(function (resolve) { return setTimeout(resolve, timeInMS); }); };
exports.sleep = sleep;
var batchExecutor = function (promises, batchSize) {
    if (batchSize === void 0) { batchSize = 50; }
    return __awaiter(this, void 0, void 0, function () {
        var res, temp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = [];
                    _a.label = 1;
                case 1:
                    if (!(promises.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(promises.splice(0, batchSize))];
                case 2:
                    temp = _a.sent();
                    res.push.apply(res, temp);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, res];
            }
        });
    });
};
exports.batchExecutor = batchExecutor;
var safelyGetCollectionsSnapshot = function (startingRef, logs) {
    if (logs === void 0) { logs = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var collectionsSnapshot, deadlineError, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deadlineError = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 7]);
                    return [4 /*yield*/, startingRef.listCollections()];
                case 2:
                    collectionsSnapshot = _a.sent();
                    deadlineError = false;
                    return [3 /*break*/, 7];
                case 3:
                    e_1 = _a.sent();
                    if (!(e_1.message === 'Deadline Exceeded')) return [3 /*break*/, 5];
                    logs && console.log("Deadline Error in getCollections()...waiting ".concat(SLEEP_TIME / 1000, " second(s) before retrying"));
                    return [4 /*yield*/, sleep(SLEEP_TIME)];
                case 4:
                    _a.sent();
                    deadlineError = true;
                    return [3 /*break*/, 6];
                case 5: throw e_1;
                case 6: return [3 /*break*/, 7];
                case 7:
                    if (deadlineError || !collectionsSnapshot) return [3 /*break*/, 1];
                    _a.label = 8;
                case 8: return [2 /*return*/, collectionsSnapshot];
            }
        });
    });
};
exports.safelyGetCollectionsSnapshot = safelyGetCollectionsSnapshot;
var safelyGetDocumentReferences = function (collectionRef, logs) {
    if (logs === void 0) { logs = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var allDocuments, deadlineError, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deadlineError = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 7]);
                    return [4 /*yield*/, collectionRef.listDocuments()];
                case 2:
                    allDocuments = _a.sent();
                    deadlineError = false;
                    return [3 /*break*/, 7];
                case 3:
                    e_2 = _a.sent();
                    if (!(e_2.code && e_2.code === 4)) return [3 /*break*/, 5];
                    logs && console.log("Deadline Error in getDocuments()...waiting ".concat(SLEEP_TIME / 1000, " second(s) before retrying"));
                    return [4 /*yield*/, sleep(SLEEP_TIME)];
                case 4:
                    _a.sent();
                    deadlineError = true;
                    return [3 /*break*/, 6];
                case 5: throw e_2;
                case 6: return [3 /*break*/, 7];
                case 7:
                    if (deadlineError || !allDocuments) return [3 /*break*/, 1];
                    _a.label = 8;
                case 8: return [2 /*return*/, allDocuments];
            }
        });
    });
};
exports.safelyGetDocumentReferences = safelyGetDocumentReferences;
