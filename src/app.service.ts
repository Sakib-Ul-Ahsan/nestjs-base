import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // @TODO: Replace this placeholder method with actual business logic
  // This is just a sample endpoint - implement your own services here
  getHello(): any {
    return { 
      message: 'Welcome to NestJS API',
      status: 'API is running' 
    };
  }
}
