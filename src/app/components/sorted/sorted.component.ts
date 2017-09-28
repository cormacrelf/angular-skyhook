import { Component, OnInit } from '@angular/core';

interface Card { id: number; text: string; };

@Component({
  selector: 'app-sorted',
  template: `
    <div class="sorted">
      <app-card *ngFor="let card of cards; let i = index; trackBy: tracker"
                [index]="i"[id]="card.id" [card]="card" (onMove)="moveCard($event)" (beginDrag)="beginDrag($event)" (endDrag)="endDrag($event)">
        <em *cardInner="let card"> {{card.text}} more stuff </em>
      </app-card>
    </div>
  `,
  styles: [`
    .sorted { width: 400px; }
    `]
})
export class SortedComponent implements OnInit {

  cards: Card[] = [
      {
        id: 1,
        text: 'Write a cool JS library',
      }, {
        id: 2,
        text: 'Make it generic enough',
      }, {
        id: 3,
        text: 'Write README',
      }, {
        id: 4,
        text: 'Create some examples',
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      }, {
        id: 6,
        text: '???',
      }, {
        id: 7,
        text: 'PROFIT',
    }];

  origCards: Card[] = this.cards;

  dragging = false;

  constructor() { }

  ngOnInit() {
  }

  beginDrag() {
    this.origCards = this.cards.slice(0);
    this.dragging = true;
  }

  endDrag(goodEdit) {
    if (!goodEdit) {
      this.cards = this.origCards;
    }
    this.dragging = false;
  }

  moveCard([dragIndex, hoverIndex]) {
    const dragCard = this.cards[dragIndex];
    this.cards.splice(dragIndex, 1);
    this.cards.splice(hoverIndex, 0, dragCard);
  }

  tracker(ix, card: Card) { return card.id; }

}
