export enum FormTypes {
    MathQuestion = "MathQuestion",
    NameAndStudentId = "NameAndStudentId",
}


export class MathQuestion {
    readonly formType = FormTypes.MathQuestion;
    constructor(
        public id: any,
        public question: string,
        public answer: number
    ) {}
}

export class NameAndStudentId {
    readonly formType = FormTypes.NameAndStudentId;
    constructor(
        public id: any,
        public name: string,
        public studentId: string,
    ) {}
}

export type FormData = MathQuestion | NameAndStudentId;
