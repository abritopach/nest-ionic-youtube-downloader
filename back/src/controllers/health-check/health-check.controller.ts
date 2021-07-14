import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {

    @Get()
    healthCheck(): {
        uptime: number,
        message: string,
        timestamp: number
    } {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        return healthcheck;
    }
}
