import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionsSearchBarComponent } from './sessions-search-bar.component';

/**
 * Module for different components used in instructor search page.
 */
@NgModule({
  declarations: [
    SessionsSearchBarComponent,
  ],
  exports: [
    SessionsSearchBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class SessionsSearchBarComponentModule { }
