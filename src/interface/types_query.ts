type VariantType = 'SNP' | 'InDel' | 'MNV' | 'SV';
type PhenotypeType = 'eQTL' | 'meQTL' | 'sQTL' | 'apaQTL';
type IndicatorType = 'Measurement' | 'Nutrition' | 'Pathology' | 'Toxin' | 'Hormone' | 'Imaging' | 'Questionnaire';
type NetworkBaseNodeType = "Variant" | "Phenotype" | "Indicator";

interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy: string;
    order?: 1 | -1;
}

export type {
    VariantType,
    PhenotypeType,
    IndicatorType,
    NetworkBaseNodeType,
    PaginationParams
};
