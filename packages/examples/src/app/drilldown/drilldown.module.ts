import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from "@angular-skyhook/core";

import { Container } from './container.component';
import { Target } from './target.component';
import { Box } from './box.component';
import { TreeService } from './tree.service';
import { Folder } from './folder.component';
import { UtilityModule } from '../utility.module';

@NgModule({
    declarations: [
        Container,
        Target,
        Box,
        Folder
    ],
    imports: [
        CommonModule,
        SkyhookDndModule,
        RouterModule.forChild([{ path: '', component: Container }]),
        UtilityModule
    ],
    providers: [
        TreeService
    ]
})
export class DrilldownModule { }

