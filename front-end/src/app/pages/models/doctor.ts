export interface Doctor {
    id: number;
    name: string;
    image: string | null;
    professionalStatement: string;
    practicingFrom: string;
    specializations: string[];  // Just an array of specialization names          
  }