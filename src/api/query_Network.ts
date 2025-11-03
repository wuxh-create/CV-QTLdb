import {
    type VariantType,
    type PhenotypeType,
    type IndicatorType,
    type NetworkBaseNodeType,
} from "@/interface/types_query";

interface QueryNetworkParams {
    baseNodeType: NetworkBaseNodeType;
    baseNodeID: VariantType | PhenotypeType | IndicatorType;
}

const queryNetwork = ({ baseNodeType, baseNodeID }: QueryNetworkParams) => {
    return $fetch(`/api/network`, {
        method: "GET",
        params: {
            base_node_type: baseNodeType,
            base_node_id: baseNodeID
        }
    })
}

export {
    queryNetwork,
}
