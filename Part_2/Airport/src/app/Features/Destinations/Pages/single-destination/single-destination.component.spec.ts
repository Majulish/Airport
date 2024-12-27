import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDestinationComponent } from './single-destination.component';

describe('SingleDestinationComponent', () => {
  let component: SingleDestinationComponent;
  let fixture: ComponentFixture<SingleDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDestinationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
