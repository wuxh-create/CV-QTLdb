import {
    type PhenotypeType,
    type IndicatorType,
    type PaginationParams,
} from "@/interface/types_query";

interface CorrelationQueryParams extends PaginationParams {
    phenotype_type: PhenotypeType | null;
    phenotype_id: string | null;
    indicator_type: IndicatorType | null;
    indicator_name: string | null;
}

const queryCorrelation = ({
    phenotype_type,
    phenotype_id,
    indicator_type,
    indicator_name,
    page = 1,
    pageSize = 10,
    sortBy = "Cor_pearson",
    order = -1,
}: CorrelationQueryParams) => {
    return $fetch(`/api/correlation`, {
        method: "GET",
        params: {
            phenotype_type,
            phenotype_id,
            indicator_type,
            indicator_name,
            page,
            pageSize,
            sortBy,
            order,
        },
    });
};

interface DotplotQueryParams {
    phenotype_type: PhenotypeType;
    phenotype_id: string;
    indicator_type: IndicatorType;
    indicator_name: string;
}
const queryDotplot = ({
    phenotype_type,
    phenotype_id,
    indicator_type,
    indicator_name,
}: DotplotQueryParams) => {
    return $fetch(`/api/dotplot`, {
        method: "GET",
        params: {
            phenotype_type,
            phenotype_id,
            indicator_type,
            indicator_name,
        },
    });
};

interface IndicatorHintsQueryParams {
    indicator_type: IndicatorType | null;
    input: string | null;
}
const queryIndicatorHints = ({
    indicator_type,
    input,
}: IndicatorHintsQueryParams) => {
    return $fetch(`/api/hint_indicator`, {
        method: "GET",
        params: {
            indicator_type,
            input,
        },
    });
};

interface PhenotypeHintsQueryParams {
    phenotype_type: PhenotypeType | null;
    input: string | null;
}
const queryPhenotypeHints = ({
    phenotype_type,
    input,
}: PhenotypeHintsQueryParams) => {
    return $fetch(`/api/hint_phenotype`, {
        method: "GET",
        params: {
            phenotype_type,
            input,
        },
    });
};

export {
    type PhenotypeType,
    type IndicatorType,
    queryCorrelation,
    queryDotplot,
    queryIndicatorHints,
    queryPhenotypeHints,
};
