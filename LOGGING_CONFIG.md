# Server Logging Configuration

## Important: DO NOT REMOVE OR MODIFY

This document describes the logging setup for the NestJS server. The logging configuration is critical for debugging and monitoring.

## Files Involved

### 1. `/src/main.ts`
Contains the bootstrap configuration with:
- Logger levels: `['error', 'warn', 'log', 'debug', 'verbose']`
- Global LoggingInterceptor
- Bootstrap logger for startup messages

**DO NOT REMOVE:**
```typescript
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
});

// Enable global logging interceptor
app.useGlobalInterceptors(new LoggingInterceptor());

const logger = new Logger('Bootstrap');
logger.log(`Application is running on: http://localhost:${port}`);
logger.log(`CORS enabled for: ${corsOrigins.join(', ')}`);
logger.log(`TypeORM logging: ${process.env.TYPEORM_LOGGING}`);
```

### 2. `/src/common/interceptors/logging.interceptor.ts`
HTTP request/response logging interceptor that logs:
- Incoming requests: `→ METHOD /url`
- Request bodies (with sanitized passwords)
- Response status and timing: `← METHOD /url STATUS - XXXms`
- Errors: `✖ METHOD /url STATUS - XXXms`

**Features:**
- Sanitizes sensitive data (passwords)
- Shows request/response timing
- Logs error stack traces in debug mode
- Color-coded output with emojis

### 3. `.env` Configuration
```
TYPEORM_LOGGING=true
```

## Log Output Examples

### Successful Request:
```
[HTTP] → POST /auth/login
[HTTP] Request body: {"email":"admin@midivision.com","password":"***"}
query: SELECT "User"."id" AS "User_id", ...
[HTTP] ← POST /auth/login 200 - 45ms
```

### Error Request:
```
[HTTP] → POST /auth/login
[HTTP] ✖ POST /auth/login 401 - 12ms
[HTTP] Error: Invalid credentials
```

### Server Startup:
```
[Bootstrap] Application is running on: http://localhost:3000
[Bootstrap] CORS enabled for: http://localhost:3000, http://localhost:3001
[Bootstrap] TypeORM logging: true
```

## Troubleshooting

If logs are not appearing:
1. Check `.env` file has `TYPEORM_LOGGING=true`
2. Verify `LoggingInterceptor` is registered in `main.ts`
3. Ensure logger levels are set in `NestFactory.create()`
4. Check terminal/console output settings

## CRITICAL NOTICE

⚠️ **These logging configurations must NOT be removed or modified without explicit request.**
⚠️ **They are essential for debugging, monitoring, and development.**
⚠️ **Always maintain the LoggingInterceptor in the bootstrap process.**
