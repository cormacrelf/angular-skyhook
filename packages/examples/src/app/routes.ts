import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'chessboard' },
    {
        path: 'bins',
        pathMatch: 'full',
        loadChildren: './bins/index#Module'
    },
    {
        path: 'basic-sortable',
        pathMatch: 'full',
        loadChildren: './basic-sortable/index#Module'
    },
    {
        path: 'chessboard',
        pathMatch: 'full',
        loadChildren: './chessboard/index#Module'
    },
    {
        path: 'calendar',
        pathMatch: 'full',
        loadChildren: './calendar/calendar.module#CalendarModule'
    },
    {
        path: 'touch',
        pathMatch: 'full',
        loadChildren: './touch/index#Module'
    },
    {
        path: 'drilldown',
        pathMatch: 'full',
        loadChildren: './drilldown/index#Module'
    },
    {   path: 'drag-layer', children: [
            {
                path: 'simple',
                pathMatch: 'full',
                loadChildren: './drag-layer/index#Module'
            },
            {
                path: 'xy-pad',
                pathMatch: 'full',
                loadChildren: './xy-pad/index#Module'
            },
    ] },
    {   path: 'nested', children: [
        {
            path: 'sources',
            pathMatch: 'full',
            loadChildren: './nested/sources/index#Module'
        },
        {
            path: 'targets',
            pathMatch: 'full',
            loadChildren: './nested/targets/index#Module'
        },
    ] },
    {   path: 'html5', children: [
        {
            path: 'handles-previews',
            pathMatch: 'full',
            loadChildren: './html5/handles-previews/index#HandlesPreviewsModule'
        },
        {
            path: 'drop-effects',
            pathMatch: 'full',
            loadChildren: './html5/drop-effects/drop-effects.module#DropEffectsModule'
        },
        {
            path: 'native-types',
            pathMatch: 'full',
            loadChildren: './html5/native-types/native-types.module#NativeTypesModule'
        },
    ] },
    {   path: 'sortable',
        children: [
        {
            path: 'kanban',
            pathMatch: 'full',
            loadChildren: './sortable/kanban/index#KanbanModule'
        },
        {
            path: 'simple',
            pathMatch: 'full',
            loadChildren: './sortable/simple/index#SimpleModule'
        },
        {
            path: 'quiz',
            pathMatch: 'full',
            loadChildren: './sortable/quiz/index#QuizModule'
        },
        {
            path: 'keyboard',
            pathMatch: 'full',
            loadChildren: './sortable/keyboard/index#KeyboardModule'
        },
        {
            path: 'fixed-height',
            pathMatch: 'full',
            loadChildren: './sortable/fixed-height/index#FixedHeightModule'
        },
    ] },
];
