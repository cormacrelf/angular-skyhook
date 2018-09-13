export enum QuestionTypes {
    Math = "Math",
    Name = "Name",
}


export class MathQuestion {
    readonly formType = QuestionTypes.Math;
    static readonly templateDescription = "Math question";
    readonly templateDescription = MathQuestion.templateDescription;
    constructor(
        public id: any,
        public question: string,
        public answer: number
    ) {}
}

export class NameQuestion {
    readonly formType = QuestionTypes.Name;
    static readonly templateDescription = "Name and student ID";
    readonly templateDescription = NameQuestion.templateDescription;
    constructor(
        public id: any,
        public name: string,
        public studentId: string,
    ) {}
}

export type Question = MathQuestion | NameQuestion;
