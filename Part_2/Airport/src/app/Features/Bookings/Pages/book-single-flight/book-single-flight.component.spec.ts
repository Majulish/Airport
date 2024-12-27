import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSingleFlightComponent } from './book-single-flight.component';

describe('BookSingleFlightComponent', () => {
  let component: BookSingleFlightComponent;
  let fixture: ComponentFixture<BookSingleFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSingleFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSingleFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
