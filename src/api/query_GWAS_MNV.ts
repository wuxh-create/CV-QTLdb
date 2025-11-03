import {
    // type VariantType,
    type IndicatorType,
    type PaginationParams,
} from "@/interface/types_query";
import { queryVariantHints } from "./query_Variants"

interface QueryGWASParams extends PaginationParams {
    // variant_type: VariantType | null;
    variant_id: string | null;
    indicator_type: IndicatorType | null;
    indicator_name: string | null;
}

const queryGWAS = ({
    // variant_type,
    variant_id,
    indicator_type,
    indicator_name,
    page = 1,
    pageSize = 10,
    sortBy = "FDR",
    order = 1
}: QueryGWASParams) => {
    return $fetch(`/api/gwas_mnv`, {
        method: "GET",
        params: {
            variant_type: 'MNV',  // 固定
            variant_id: variant_id,
            indicator_type: indicator_type,
            indicator_name: indicator_name,
            page: page,
            pageSize: pageSize,
            sortBy: sortBy,
            order: order
        }
    })
}

interface QueryManhattanParams {
    // variant_type: VariantType;
    indicator_type: IndicatorType;
    indicator_name: string;
}
const queryManhattan = ({
    // variant_type,
    indicator_type,
    indicator_name
}: QueryManhattanParams) => {
    return $fetch(`/api/manhattan`, {
        method: "GET",
        params: {
            variant_type: 'MNV',  // 固定
            indicator_type: indicator_type,
            indicator_name: indicator_name
        }
    })
}

interface QueryIndicatorHintsParams {
    indicator_type: IndicatorType;
    input: string;
}
const queryIndicatorHints = ({
    indicator_type,
    input
}: QueryIndicatorHintsParams) => {
    return $fetch(`/api/hint_indicator`, {
        method: "GET",
        params: {
            indicator_type: indicator_type,
            input: input
        }
    })
}

export {
    // type VariantType,
    type IndicatorType,
    queryGWAS,
    queryManhattan,
    queryVariantHints,
    queryIndicatorHints,
}

