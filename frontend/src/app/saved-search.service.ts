import { Injectable } from '@angular/core';

interface SavedSearch {
  name: string;
  filters: any;
  sort: any;
}

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {
  private searches: SavedSearch[] = [];

  constructor() {}

  saveSearch(name: string, filters: any, sort: any): void {
    const search: SavedSearch = { name, filters, sort };
    this.searches.push(search);
  }

  getSavedSearches(): SavedSearch[] {
    return this.searches;
  }

  getSearchByName(name: string): SavedSearch | undefined {
    return this.searches.find(search => search.name === name);
  }
}
