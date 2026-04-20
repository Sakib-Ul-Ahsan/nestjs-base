import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseMessage } from './common/decorators/response-message.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @TODO: This is a sample health check endpoint
  // Replace or add additional endpoints based on your requirements
  @Get()
  getHello(): any {
    return this.appService.getHello();
  }
  
  // @TODO: Consider adding a dedicated health check endpoint
  // Example: GET /health for readiness/liveness probes
}
