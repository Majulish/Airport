import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuggageSelectionModalComponent } from './luggage-selection-modal.component';

describe('LuggageSelectionModalComponent', () => {
  let component: LuggageSelectionModalComponent;
  let fixture: ComponentFixture<LuggageSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuggageSelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuggageSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
