import { Component } from '@angular/core';

interface Card { id: number; text: string; };

@Component({
  selector: 'basic-sortable',
  templateUrl: './basic-sortable.component.html',
  styles: [`
    .sorted { width: 100%; max-width: 400px; }
  `]
})
export class BasicSortableComponent {

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

  findCard(id: number) {
    return this.cards.find(c => c.id === id);
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

  tracker(_index, card: Card) {
      return card.id;
  }

}
