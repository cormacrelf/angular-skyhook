import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'chessboard' },
    { path: 'bins', pathMatch: 'full', loadChildren: './bins/index#Module' },
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
        path: 'drag-layer/simple',
        pathMatch: 'full',
        loadChildren: './drag-layer/index#Module'
    },
    {
        path: 'drag-layer/xy-pad',
        pathMatch: 'full',
        loadChildren: './xy-pad/index#Module'
    },
    { path: 'touch', pathMatch: 'full', loadChildren: './touch/index#Module' },
    {
        path: 'drilldown',
        pathMatch: 'full',
        loadChildren: './drilldown/index#Module'
    },
    {
        path: 'nested/sources',
        pathMatch: 'full',
        loadChildren: './nested/sources/index#Module'
    },
    {
        path: 'nested/targets',
        pathMatch: 'full',
        loadChildren: './nested/targets/index#Module'
    },
    {
        path: 'html5/handles-previews',
        pathMatch: 'full',
        loadChildren: './html5/handles-previews/index#HandlesPreviewsModule'
    },
    {
        path: 'html5/drop-effects',
        pathMatch: 'full',
        loadChildren: './html5/drop-effects/drop-effects.module#DropEffectsModule'
    },
    {
        path: 'html5/native-types',
        pathMatch: 'full',
        loadChildren: './html5/native-types/native-types.module#NativeTypesModule'
    },
    {
        path: 'sortable/kanban',
        pathMatch: 'full',
        loadChildren: './kanban/index#KanbanModule'
    },
    {
        path: 'sortable/simple',
        pathMatch: 'full',
        loadChildren: './simple/index#SimpleModule'
    },
    {
        path: 'calendar',
        pathMatch: 'full',
        loadChildren: './calendar/calendar.module#CalendarModule'
    },
];
