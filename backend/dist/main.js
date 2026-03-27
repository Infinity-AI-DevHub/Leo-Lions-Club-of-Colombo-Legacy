"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
async function bootstrap() {
    if (!(0, fs_1.existsSync)('./uploads')) {
        (0, fs_1.mkdirSync)('./uploads');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.enableCors({
        origin: ['http://localhost:3000'],
        credentials: true,
    });
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map