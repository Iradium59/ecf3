import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search-suggestion')
  getSearchSuggestions(@Query('q') query: string): SearchSuggestionDto[] {
    return this.searchService.getSearchSuggestions(query);
  }

  @Get('default-search-suggestion')
  getDefaultSuggestions(): SearchSuggestionDto[] {
    return this.searchService.getDefaultSuggestions();
  }
}
