import { Module } from '@nestjs/common';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';

@Module({
  imports: [],
  controllers: [SearchController],
  providers: [SearchService],
})
export class AppModule {}
