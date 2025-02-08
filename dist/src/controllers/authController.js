"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const { email, password, userType } = req.body;
            const user = await authService.registerUser(email, password, userType);
            res.status(201).json({ message: 'User registered successfully', userId: user.id });
        }
        catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService.validateUser(email, password);
            if (user) {
                const token = authService.generateToken(user.id.toString());
                const refreshToken = authService.generateRefreshToken(user.id.toString());
                res.json({ token, refreshToken, userType: user.userType });
            }
            else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const newToken = await authService.refreshToken(refreshToken);
            res.json({ token: newToken });
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid refresh token' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map