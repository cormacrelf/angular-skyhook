import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'chessboard' },
    {
        path: 'bins',
        pathMatch: 'full',
        loadChildren: './bins/module#BinsModule'
    },
    {
        path: 'basic-sortable',
        pathMatch: 'full',
        loadChildren: './basic-sortable/module#BasicSortableModule'
    },
    {
        path: 'chessboard',
        pathMatch: 'full',
        loadChildren: './chessboard/module#ChessboardModule'
    },
    {
        path: 'calendar',
        pathMatch: 'full',
        loadChildren: './calendar/module#CalendarModule'
    },
    {
        path: 'touch',
        pathMatch: 'full',
        loadChildren: './touch/module#TouchModule'
    },
    {
        path: 'drilldown',
        pathMatch: 'full',
        loadChildren: './drilldown/module#DrilldownModule'
    },
    {   path: 'drag-layer', children: [
            {
                path: 'simple',
                pathMatch: 'full',
                loadChildren: './drag-layer/module#DragLayerModule'
            },
            {
                path: 'xy-pad',
                pathMatch: 'full',
                loadChildren: './xy-pad/module#XyPadModule'
            },
    ] },
    {   path: 'nested', children: [
        {
            path: 'sources',
            pathMatch: 'full',
            loadChildren: './nested/sources/module#NestedSourcesModule'
        },
        {
            path: 'targets',
            pathMatch: 'full',
            loadChildren: './nested/targets/module#NestedTargetsModule'
        },
    ] },
    {   path: 'html5', children: [
        {
            path: 'handles-previews',
            pathMatch: 'full',
            loadChildren: './html5/handles-previews/module#HandlesPreviewsModule'
        },
        {
            path: 'drop-effects',
            pathMatch: 'full',
            loadChildren: './html5/drop-effects/module#DropEffectsModule'
        },
        {
            path: 'native-types',
            pathMatch: 'full',
            loadChildren: './html5/native-types/module#NativeTypesModule'
        },
    ] },
    {   path: 'sortable',
        children: [
        {
            path: 'kanban',
            pathMatch: 'full',
            loadChildren: './sortable/kanban/module#KanbanModule'
        },
        {
            path: 'simple',
            pathMatch: 'full',
            loadChildren: './sortable/simple/module#SimpleModule'
        },
        {
            path: 'simple-kanban',
            pathMatch: 'full',
            loadChildren: './sortable/simple-kanban/module#KanbanModule'
        },
        {
            path: 'quiz',
            pathMatch: 'full',
            loadChildren: './sortable/quiz/module#QuizModule'
        },
        {
            path: 'keyboard',
            pathMatch: 'full',
            loadChildren: './sortable/keyboard/module#KeyboardModule'
        },
        {
            path: 'fixed-height',
            pathMatch: 'full',
            loadChildren: './sortable/fixed-height/module#FixedHeightModule'
        },
    ] },
];
