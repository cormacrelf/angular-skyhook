import { Record } from 'immutable';
import { hasher } from './hasher';

export class Blob extends Record({ id: 0, hash: hasher(''), content: '' }) {
    static nextId = 0;
    static create(content: string) {
        return new Blob({ id: Blob.nextId++, content, hash: hasher(content) })
    }
}

