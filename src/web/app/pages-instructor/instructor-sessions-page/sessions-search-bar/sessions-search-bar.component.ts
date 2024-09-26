import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Parameters inputted by user to be used in search
 */
 export interface SearchParams {
  searchKey: string;
}

@Component({
  selector: 'tm-sessions-search-bar',
  templateUrl: './sessions-search-bar.component.html',
  styleUrls: ['./sessions-search-bar.component.scss'],
})
export class SessionsSearchBarComponent {

  @Input() searchParams: SearchParams = {
    searchKey: '',
  };

  @Input() isSearchView: boolean = false;

  @Output() searched: EventEmitter<any> = new EventEmitter();

  @Output() searchParamsChange: EventEmitter<SearchParams> = new EventEmitter();

  @Output() clearSearchPress: EventEmitter<any> = new EventEmitter();

    /**
     * send the search data to parent for processing
     */
    search(): void {
      this.searched.emit();
    }

    clearSearch(): void {
      this.clearSearchPress.emit();
    }

    triggerSearchParamsChangeEvent(field: string, data: any): void {
      this.searchParamsChange.emit({ ...this.searchParams, [field]: data });
    }

    onSearchKeyChange(newKey: string): void {
      this.triggerSearchParamsChangeEvent('searchKey', newKey);
    }
}
