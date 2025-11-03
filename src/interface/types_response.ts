import type {
    VariantType,
    PhenotypeType,
    IndicatorType,
} from "./types_query";

interface ResponseType<T = any> {
    code: number;
    message: string;
    data: T | null;
    stat?: Record<VariantType | PhenotypeType | IndicatorType, number>
    total?: number;
}

export type { ResponseType };
