import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowEditDialogComponent } from './flow-edit-dialog.component';

describe('FlowEditDialogComponent', () => {
  let component: FlowEditDialogComponent;
  let fixture: ComponentFixture<FlowEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
