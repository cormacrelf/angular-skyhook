import { Reconnector } from './Reconnector';

describe('Reconnector', () => {
    let node: any;
    let options: string | undefined;
    let unsubscribeCount = 0;
    let reconnector: Reconnector;
    let spy = () => {};

    beforeEach(() => {
        reconnector = new Reconnector<string>((_handlerId, _node, _options) => {
            // the 'backend'
            node = _node;
            options = _options;
            spy();
            return () => {
                unsubscribeCount ++;
            };
        });
    });

    it('should work', () => {
        const div = document.createElement('div');
        const second = document.createElement('div');

        reconnector.reconnect("parentHandlerId");

        reconnector.hook(div, 'options');
        expect(node).toBe(div);
        expect(options).toBe("options");
        expect(unsubscribeCount).toBe(0);

        reconnector.hook(second, 'options v2');
        expect(node).toBe(second);
        expect(options).toBe("options v2");
        expect(unsubscribeCount).toBe(1);

        let calledSpy = false;
        spy = () => calledSpy = true;
        reconnector.reconnect(null);
        expect(unsubscribeCount).toBe(2);
        expect(calledSpy).toBe(false);
    });

    it("should not reconnect if node and options don't change", () => {
        let div = document.createElement('div');
        options = "";
        reconnector.reconnect('parentHandlerId');
        reconnector.hook(div, options);
        let calledSpy = false;
        spy = () => calledSpy = true;
        reconnector.hook(div, options);
        expect(calledSpy).toBe(false);
    });

});
