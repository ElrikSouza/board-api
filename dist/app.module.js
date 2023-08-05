"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const connect_redis_1 = require("connect-redis");
const session = require("express-session");
const passport = require("passport");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const boards_module_1 = require("./boards/boards.module");
const client_const_1 = require("./redis/client.const");
const redis_module_1 = require("./redis/redis.module");
const users_module_1 = require("./users/users.module");
let AppModule = exports.AppModule = class AppModule {
    constructor(redis) {
        this.redis = redis;
    }
    configure(consumer) {
        consumer
            .apply(session({
            store: new connect_redis_1.default({ client: this.redis }),
            saveUninitialized: false,
            secret: 'sup3rs3cr3t',
            resave: false,
            cookie: {
                sameSite: true,
                httpOnly: false,
                maxAge: 600000000,
            },
        }), passport.initialize(), passport.session())
            .forRoutes('*');
    }
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                port: +process.env.PORT,
                host: process.env.DB_HOST,
                password: process.env.DB_PASS,
                username: process.env.DB_USER,
                synchronize: true,
                autoLoadEntities: true,
            }),
            boards_module_1.BoardsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            redis_module_1.RedisModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __param(0, (0, common_1.Inject)(client_const_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [Object])
], AppModule);
//# sourceMappingURL=app.module.js.map