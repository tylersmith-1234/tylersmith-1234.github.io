export class Recipe {
    title?: string;
    submittedBy?: string;
    recipeType?: string;
    year?: number;
    ingredients?: {
        amount: number;
        units: string;
        item: string;
    }[];
    instructions?: string;
    pic?: any;
    picMonth?: string;
    picYear?: number;
    picCaption?: string;
}