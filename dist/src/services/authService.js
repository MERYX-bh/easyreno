"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthService {
    async registerUser(email, password, userType) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        return await prisma.user.create({
            data: { email, password: hashedPassword, userType }
        });
    }
    async validateUser(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt_1.default.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
    async refreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return this.generateToken(decoded.id);
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map