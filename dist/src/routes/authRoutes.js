"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
const authController = new authController_1.AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map