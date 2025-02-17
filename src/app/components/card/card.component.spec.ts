import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.article = {
      url: '',
      source: '',
      publishedAt: '',
      title: '',
      content: '',
      sourceUrl: ''
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
