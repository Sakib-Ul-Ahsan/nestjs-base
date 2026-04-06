import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return { data: { id: 1, name: 'sakib' }, message: 'monir' };
  }
}
