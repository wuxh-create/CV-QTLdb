import {
    type VariantType,
    type PaginationParams
} from "@/interface/types_query";

interface QueryVariantParams extends PaginationParams {
    variant_type: VariantType | null;
    range: string | null;
    variant_id: string | null;
}
const queryVariant = ({
    variant_type,
    variant_id,
    range,
    page = 1,
    pageSize = 10,
    sortBy = 'Chromosome',
    order = 1
}: QueryVariantParams) => {
    return $fetch(`/api/variant`, {
        method: 'GET',
        params: {
            variant_type: variant_type,
            range: range,
            variant_id: variant_id,
            page: page,
            pageSize: pageSize,
            sortBy: sortBy,
            order: order
        }
    })
}

interface QueryVariantHintsParams {
    variant_type: VariantType | null;
    input: string;
}
const queryVariantHints = ({ variant_type, input }: QueryVariantHintsParams) => {
    return $fetch(`/api/variant_hints`, {
        method: 'GET',
        params: {
            variant_type: variant_type,
            input: input
        }
    })
}

export {
    type VariantType,
    queryVariant,
    queryVariantHints
}
