import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'chessboard' },
    {
        path: 'bins',
        pathMatch: 'full',
        loadChildren: './bins/bins.module#BinsModule'
    },
    {
        path: 'basic-sortable',
        pathMatch: 'full',
        loadChildren: './basic-sortable/basic-sortable.module#BasicSortableModule'
    },
    {
        path: 'chessboard',
        pathMatch: 'full',
        loadChildren: './chessboard/chessboard.module#ChessboardModule'
    },
    {
        path: 'calendar',
        pathMatch: 'full',
        loadChildren: './calendar/calendar.module#CalendarModule'
    },
    {
        path: 'touch',
        pathMatch: 'full',
        loadChildren: './touch/touch.module#TouchModule'
    },
    {
        path: 'drilldown',
        pathMatch: 'full',
        loadChildren: './drilldown/drilldown.module#DrilldownModule'
    },
    {   path: 'drag-layer', children: [
            {
                path: 'simple',
                pathMatch: 'full',
                loadChildren: './drag-layer/drag-layer.module#DragLayerModule'
            },
            {
                path: 'xy-pad',
                pathMatch: 'full',
                loadChildren: './xy-pad/xy-pad.module#XyPadModule'
            },
    ] },
    {   path: 'nested', children: [
        {
            path: 'sources',
            pathMatch: 'full',
            loadChildren: './nested/sources/nested-sources.module#NestedSourcesModule'
        },
        {
            path: 'targets',
            pathMatch: 'full',
            loadChildren: './nested/targets/nested-targets.module#NestedTargetsModule'
        },
    ] },
    {   path: 'html5', children: [
        {
            path: 'handles-previews',
            pathMatch: 'full',
            loadChildren: './html5/handles-previews/handles-previews.module#HandlesPreviewsModule'
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
            loadChildren: './sortable/kanban/kanban.module#KanbanModule'
        },
        {
            path: 'simple',
            pathMatch: 'full',
            loadChildren: './sortable/simple/simple.module#SimpleModule'
        },
        {
            path: 'quiz',
            pathMatch: 'full',
            loadChildren: './sortable/quiz/quiz.module#QuizModule'
        },
        {
            path: 'keyboard',
            pathMatch: 'full',
            loadChildren: './sortable/keyboard/keyboard.module#KeyboardModule'
        },
        {
            path: 'fixed-height',
            pathMatch: 'full',
            loadChildren: './sortable/fixed-height/fixed-height.module#FixedHeightModule'
        },
    ] },
];
