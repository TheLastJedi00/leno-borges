import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gradient } from './gradient';

describe('Gradient', () => {
  let component: Gradient;
  let fixture: ComponentFixture<Gradient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gradient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gradient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
