import { Component, OnInit } from '@angular/core';

interface Card { id: number; text: string; };

@Component({
  selector: 'app-sorted',
  template: `
    <app-example-link path="sortable"></app-example-link>
    <skyhook-preview>
      <ng-template let-type let-item="item">
          <!-- sometimes you will want an &lt;ng-content&gt;, but here we want to limit preview width to 400px -->
          <div class="sorted" [ngSwitch]="type">
            <app-card *ngSwitchCase="'CARD'" [card]="findCard(item.id)">
              <span *cardInner="let card">{{item.index+1}} {{card.text}}</span>
            </app-card>
          </div>
      </ng-template>
    </skyhook-preview>
    <div class="sorted">
      <app-card *ngFor="let card of cards; let i = index; trackBy: tracker"
                [index]="i" [id]="card.id" [card]="card" (onMove)="moveCard($event)" (beginDrag)="beginDrag($event)" (endDrag)="endDrag($event)">
        <span *cardInner="let card"> {{i+1}}. {{card.text}} </span>
      </app-card>
    </div>
  `,
  styles: [`
    .sorted { width: 100%; max-width: 400px; }
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
        text: 'Write a glorious Medium post to promote it (note that this element is taller, and far more important, than the others)',
      }, {
        id: 6,
        text: 'Sit back and relax',
    }];

  origCards: Card[] = this.cards;

  constructor() { }

  findCard(id: number) {
    return this.cards.find(c => c.id === id);
  }

  ngOnInit() {
  }

  beginDrag() {
    this.origCards = this.cards.slice(0);
  }

  endDrag(goodEdit) {
    if (!goodEdit) {
      this.cards = this.origCards;
    }
  }

  moveCard([dragIndex, hoverIndex]) {
    const dragCard = this.cards[dragIndex];
    this.cards.splice(dragIndex, 1);
    this.cards.splice(hoverIndex, 0, dragCard);
  }

  tracker(ix, card: Card) { return card.id; }

}
