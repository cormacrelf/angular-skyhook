import { Component, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  group
} from '@angular/animations';

export interface Card { id: number; lane: number; text: string; };

@Component({
  selector: 'app-sorted',
  template: `
    <div class="sorted" *ngFor="let l of [0, 1]">
    <div class="anim"
      [@cardIn]="animationInitialized.toString()"
      [@cardOut]="animationInitialized.toString()"
      (@cardIn.done)="animationInitialized = true"
      *ngFor="let card of lanes[l]; let i = index; trackBy: tracker">
        <app-card [index]="i" [id]="card.id" [card]="card" (onMove)="moveCard($event)" (beginDrag)="beginDrag($event)" (endDrag)="endDrag($event)">
          <p *cardInner="let card"> {{card.text}} more stuff </p>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; }
    .sorted { width: 400px; }
    .anim { overflow: hidden; }
  `],
  animations: [
    trigger('cardIn', [
      // state('in', style({ height: '*', 'padding-top': '*', 'padding-bottom': '*', 'margin-top': '*', 'margin-bottom': '*' })),
      transition('void => false', [
        /*no transition on first load*/
      ]),
      transition('void => *', [
        // style({ height: '0', 'padding-top': '0', 'padding-bottom': '0', 'margin-top': '0', 'margin-bottom': '0' }),
        // animate("0.5s ease", style({ height: '*', 'padding-top': '*', 'padding-bottom': '*', 'margin-top': '*', 'margin-bottom': '*' }))
      ])
    ]),
    trigger('cardOut', [
      // transition('* => void', [
      //   // style({ height: '*', 'padding-top': '*', 'padding-bottom': '*', 'margin-top': '*', 'margin-bottom': '*' }),
      //   animate("0.5s ease", style({ height: '0', 'padding-top': '0', 'padding-bottom': '0', 'margin-top': '0', 'margin-bottom': '0' }))
      // ])
    ])
  ]
})
export class SortedComponent implements OnInit {animationInitialized = false

  lanes: Card[][] = [
    [
      {
        id: 1,
        lane: 0,
        text: 'Write a cool JS library',
      }, {
        id: 2,
        lane: 0,
        text: 'Make it generic enough',
      }, {
        id: 3,
        lane: 0,
        text: 'Write README',
      }, {
        id: 4,
        lane: 0,
        text: 'Create some examples',
      }, {
        id: 5,
        lane: 0,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      }, {
        id: 6,
        lane: 0,
        text: '???',
      }, {
        id: 7,
        lane: 0,
        text: 'PROFIT',
    }],
    [
      { id: 81, lane: 1, text: 'noice 1' },
      { id: 82, lane: 1, text: 'noice 2' },
      { id: 83, lane: 1, text: 'noice 3' },
      { id: 84, lane: 1, text: 'noice 4' },
      { id: 85, lane: 1, text: 'noice 5' },
    ]
  ];

  originalLanes: Card[][] = this.lanes;

  dragging = false;

  constructor() { }

  ngOnInit() {
  }

  beginDrag() {
    this.originalLanes = this.lanes.map(x => x.slice(0));
    this.dragging = true;
  }

  endDrag(goodEdit) {
    if (!goodEdit) {
      this.lanes = this.originalLanes;
    }
    this.dragging = false;
  }

  moveCard([lane1, dragIndex, lane2, hoverIndex]) {
    let dragCard = this.lanes[lane1][dragIndex];
    dragCard = { ...dragCard, lane: lane2 }
    this.lanes[lane1].splice(dragIndex, 1);
    this.lanes[lane2].splice(hoverIndex, 0, dragCard);
  }

  tracker(ix, card: Card) { return card.id; }

}
