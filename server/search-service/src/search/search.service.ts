import { Injectable } from '@nestjs/common';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';

@Injectable()
export class SearchService {
  private readonly defaultSuggestions: SearchSuggestionDto[] = [
    { keyword: 'Tops pour femmes', link: 'genders=1::apparels=1' },
    { keyword: 'Robes pour femmes', link: 'genders=1::apparels=2' },
    { keyword: 'Pantalons pour femmes', link: 'genders=1::apparels=3' },
    { keyword: 'Jupes pour femmes', link: 'genders=1::apparels=4' },
    { keyword: 'Vêtements pour hommes', link: 'genders=2' },
    { keyword: 'Vêtements pour enfants', link: 'genders=3,4' },
  ];

  private readonly allSuggestions: SearchSuggestionDto[] = [
    ...this.defaultSuggestions,
    { keyword: 'H&M', link: 'brands=1' },
    { keyword: 'SASSAFRAS', link: 'brands=2' },
    { keyword: 'Roadster', link: 'brands=3' },
    { keyword: 'DOROTHY PERKINS', link: 'brands=4' },
    { keyword: 'Harpa', link: 'brands=5' },
    { keyword: 'MANGO', link: 'brands=6' },
    { keyword: 'ONLY', link: 'brands=7' },
    { keyword: 'Marks & Spencer', link: 'brands=8' },
    { keyword: 'FOREVER 21', link: 'brands=9' },
    { keyword: 'HERE&NOW', link: 'brands=10' },
    { keyword: 'Tops', link: 'genders=1::apparels=1' },
    { keyword: 'Robes', link: 'genders=1::apparels=2' },
    { keyword: 'Pantalons', link: 'genders=1::apparels=3' },
    { keyword: 'Jupes', link: 'genders=1::apparels=4' },
    { keyword: 'Costumes', link: 'genders=1::apparels=5' },
    { keyword: 'Tops SASSAFRAS', link: 'genders=1::apparels=1::brands=2' },
    { keyword: 'Robes H&M', link: 'genders=1::apparels=2::brands=1' },
    { keyword: 'Pantalons Roadster', link: 'genders=1::apparels=3::brands=3' },
    { keyword: 'Jupes FOREVER 21', link: 'genders=1::apparels=4::brands=9' },
    { keyword: 'Vêtements Marks & Spencer', link: 'brands=8' },
  ];

  getSearchSuggestions(prefix: string): SearchSuggestionDto[] {
    if (!prefix) {
      return this.defaultSuggestions;
    }

    const lowerPrefix = prefix.toLowerCase();
    return this.allSuggestions.filter(suggestion => 
      suggestion.keyword.toLowerCase().includes(lowerPrefix)
    ).slice(0, 10);
  }

  getDefaultSuggestions(): SearchSuggestionDto[] {
    return this.defaultSuggestions;
  }
}
