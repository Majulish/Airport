import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAFlightComponent } from './search-a-flight.component';

describe('SearchAFlightComponent', () => {
  let component: SearchAFlightComponent;
  let fixture: ComponentFixture<SearchAFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
