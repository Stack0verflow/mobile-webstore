import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyModelComponent } from './modify-model.component';

describe('ModifyModelComponent', () => {
  let component: ModifyModelComponent;
  let fixture: ComponentFixture<ModifyModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
