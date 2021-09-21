import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarpackComponent } from './criarpack.component';

describe('CriarpackComponent', () => {
  let component: CriarpackComponent;
  let fixture: ComponentFixture<CriarpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriarpackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
