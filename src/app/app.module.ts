import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DndModule, DRAG_DROP_BACKEND } from '../angular-dnd';
import Html5Backend from 'react-dnd-html5-backend';
import { BinComponent } from './bin/bin.component';
import { TrashComponent } from './trash/trash.component';
import { SortedComponent } from './components/sorted/sorted.component';
import { CardComponent, CardInnerDirective } from './components/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    BinComponent,
    TrashComponent,
    SortedComponent,
    CardComponent,
    CardInnerDirective
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(),
  ],
  providers: [
    DndModule.provideBackend(Html5Backend),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
