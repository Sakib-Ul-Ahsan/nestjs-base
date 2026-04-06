import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(
    // private readonly appService: AppService
) {}

  @Get()
  getHello(): string {
    return 'this.userService.getHello();'
  }
}
