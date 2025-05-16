import { Controller, Post } from '@nestjs/common';

@Controller('feed')
export class FeedController {
  @Post('/postar')
  async postar(): Promise<string> {
    return 'aaaa';
  }
}
