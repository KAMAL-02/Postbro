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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApiRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const sendApiRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body is: ", req.body);
    const { method, url } = req.body;
    if (!url || !method) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        const response = yield (0, axios_1.default)({ method, url });
        if (!response) {
            res.status(404).json({ message: 'Not found' });
            return;
        }
        res.status(200).json({ status: response.status, data: response.data });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.sendApiRequest = sendApiRequest;
