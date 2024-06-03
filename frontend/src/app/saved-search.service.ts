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
  private localStorageKey = 'savedSearches';

  constructor() {
    this.loadSearches();
  }

  private searches: SavedSearch[] = [];

  saveSearch(name: string, filters: any, sort: any): void {
    const search: SavedSearch = { name, filters, sort };
    this.searches.push(search);
    this.saveToLocalStorage();
  }

  getSavedSearches(): SavedSearch[] {
    return this.searches;
  }

  getSearchByName(name: string): SavedSearch | undefined {
    return this.searches.find(search => search.name === name);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.searches));
  }

  private loadSearches(): void {
    const savedSearches = localStorage.getItem(this.localStorageKey);
    if (savedSearches) {
      this.searches = JSON.parse(savedSearches);
    }
  }
}
