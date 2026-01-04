export interface ZodiacSign {
    name: string;
    start: string;
    end: string;
    compatibleWith: string[];
    description: string;
    element: string;
}

export interface CompatibilityBreakdown {
    name: number;
    age: number;
    zodiac: number;
    element: number;
    random: number;
    total: number;
}

export interface URLParams {
    n1: string | null;
    g1: string | null;
    d1: string | null;
    n2: string | null;
    g2: string | null;
    d2: string | null;
    r: string | null;
}