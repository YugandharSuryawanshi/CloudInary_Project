import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbImagesComponent } from './db-images.component';

describe('DbImagesComponent', () => {
  let component: DbImagesComponent;
  let fixture: ComponentFixture<DbImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
