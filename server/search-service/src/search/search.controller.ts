import { Controller, Get, Query, Logger } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';

@Controller()
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get('search-suggestion')
  async getSearchSuggestions(@Query('q') query: string): Promise<SearchSuggestionDto[]> {
    return await this.searchService.getSearchSuggestions(query);
  }

  @Get('default-search-suggestion')
  async getDefaultSuggestions(): Promise<SearchSuggestionDto[]> {
    return await this.searchService.getDefaultSuggestions();
  }
}
