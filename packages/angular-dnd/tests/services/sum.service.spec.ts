import { inject, TestBed } from '@angular/core/testing';

import { DndService } from '../../public_api';

describe('SumService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DndService
            ]
        });
    });

    it('should not throw',
        inject([DndService],
            (sumService: DndService) => {
                const src = sumService.dragSource()
                expect(() => src.destroy()).not.toThrow();
            })
    );

});
