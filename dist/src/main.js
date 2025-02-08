"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet = require("helmet");
const compression = require("compression");
const express = require("express");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(helmet.default());
    app.use(compression());
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use('/uploads', express.static((0, path_1.join)(__dirname, '..', 'uploads')));
    console.log('✅ Dossier statique servi:', (0, path_1.join)(__dirname, '..', 'uploads'));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map