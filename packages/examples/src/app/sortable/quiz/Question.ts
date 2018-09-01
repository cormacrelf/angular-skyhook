export enum QuestionTypes {
    Math = "Math",
    Name = "Name",
}


export class MathQuestion {
    readonly formType = QuestionTypes.Math;
    constructor(
        public id: any,
        public question: string,
        public answer: number
    ) {}
}

export class NameQuestion {
    readonly formType = QuestionTypes.Name;
    constructor(
        public id: any,
        public name: string,
        public studentId: string,
    ) {}
}

export type Question = MathQuestion | NameQuestion;
