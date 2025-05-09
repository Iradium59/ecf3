import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  brand: {
    id: number;
    name: string;
  };
  gender: {
    id: number;
    name: string;
  };
  apparel: {
    id: number;
    name: string;
  };
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly commonDataServiceUrl: string;
  
  private readonly defaultSuggestions: SearchSuggestionDto[] = [
    { keyword: 'Tops pour femmes', link: 'genders=1::apparels=1' },
    { keyword: 'Robes pour femmes', link: 'genders=1::apparels=2' },
    { keyword: 'Pantalons pour femmes', link: 'genders=1::apparels=3' },
    { keyword: 'Jupes pour femmes', link: 'genders=1::apparels=4' },
    { keyword: 'Vêtements pour hommes', link: 'genders=2' },
    { keyword: 'Vêtements pour enfants', link: 'genders=3,4' },
  ];

  private cachedSuggestions: SearchSuggestionDto[] = [];
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; 

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.commonDataServiceUrl = this.configService.get<string>('COMMON_DATA_SERVICE_URL') || 'http://common-data-service:8081';
    this.refreshSuggestionsCache();
  }

  async getSearchSuggestions(prefix: string): Promise<SearchSuggestionDto[]> {
    if (!prefix) {
      return this.getDefaultSuggestions();
    }

    await this.ensureCacheIsFresh();

    const lowerPrefix = prefix.toLowerCase();
    return this.cachedSuggestions
      .filter(suggestion => suggestion.keyword.toLowerCase().includes(lowerPrefix))
      .slice(0, 10);
  }

  async getDefaultSuggestions(): Promise<SearchSuggestionDto[]> {
    await this.ensureCacheIsFresh();
    return this.cachedSuggestions.length > 0 
      ? this.cachedSuggestions.slice(0, 6) 
      : this.defaultSuggestions;
  }

  private async ensureCacheIsFresh(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCacheUpdate > this.CACHE_TTL || this.cachedSuggestions.length === 0) {
      await this.refreshSuggestionsCache();
    }
  }

  private async refreshSuggestionsCache(): Promise<void> {
    try {
      const products = await this.fetchProductsFromCommonData();
      
      if (products && products.length > 0) {
        this.cachedSuggestions = this.generateSuggestionsFromProducts(products);
        this.lastCacheUpdate = Date.now();
        this.logger.log(`Cache de suggestions mis à jour avec ${this.cachedSuggestions.length} suggestions`);
      } else {
        this.logger.warn('Aucun produit récupéré depuis common-data-service, utilisation des suggestions par défaut');
      }
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour du cache de suggestions: ${error.message}`);
      if (this.cachedSuggestions.length === 0) {
        this.cachedSuggestions = [...this.defaultSuggestions];
      }
    }
  }

  private async fetchProductsFromCommonData(): Promise<Product[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.commonDataServiceUrl}/home`).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Erreur lors de la récupération des produits: ${error.message}`);
            throw error;
          }),
        ),
      );

      if (response.data && response.data.products) {
        return response.data.products;
      }
      
      return [];
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des produits: ${error.message}`);
      return [];
    }
  }

  private generateSuggestionsFromProducts(products: Product[]): SearchSuggestionDto[] {
    const suggestions: SearchSuggestionDto[] = [];
    const brands = new Map<number, string>();
    const genders = new Map<number, string>();
    const apparels = new Map<number, string>();

    products.forEach(product => {
      if (product.brand) brands.set(product.brand.id, product.brand.name);
      if (product.gender) genders.set(product.gender.id, product.gender.name);
      if (product.apparel) apparels.set(product.apparel.id, product.apparel.name);
    });

    brands.forEach((name, id) => {
      suggestions.push({
        keyword: name,
        link: `brands=${id}`,
      });
    });

    genders.forEach((name, id) => {
      suggestions.push({
        keyword: `Vêtements pour ${name.toLowerCase()}`,
        link: `genders=${id}`,
      });
    });

    genders.forEach((genderName, genderId) => {
      apparels.forEach((apparelName, apparelId) => {
        suggestions.push({
          keyword: `${apparelName} pour ${genderName.toLowerCase()}`,
          link: `genders=${genderId}::apparels=${apparelId}`,
        });
      });
    });

    brands.forEach((brandName, brandId) => {
      apparels.forEach((apparelName, apparelId) => {
        suggestions.push({
          keyword: `${apparelName} ${brandName}`,
          link: `apparels=${apparelId}::brands=${brandId}`,
        });
      });
    });

    this.defaultSuggestions.forEach(suggestion => {
      if (!suggestions.some(s => s.keyword === suggestion.keyword)) {
        suggestions.push(suggestion);
      }
    });

    return suggestions;
  }
}
