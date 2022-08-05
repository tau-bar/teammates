import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SessionsSearchBarComponent } from './sessions-search-bar.component';

describe('SessionsSearchBarComponent', () => {
  let component: SessionsSearchBarComponent;
  let fixture: ComponentFixture<SessionsSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
      ],
      declarations: [SessionsSearchBarComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
