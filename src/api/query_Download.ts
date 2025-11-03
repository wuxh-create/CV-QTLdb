import {
    type VariantType,
    type PhenotypeType,
} from "@/interface/types_query";

interface QueryDownloadParams {
    download_type: "variants" | "qtl" | "gwas";
    variant_type: VariantType | null;
    phenotype_type: PhenotypeType | null;
}

const queryDownload = ({
    download_type,
    variant_type,
    phenotype_type,
}: QueryDownloadParams) => {
    return $fetch.raw(`/api/download`, {
        method: "GET",
        params: {
            download_type: download_type,
            variant_type: variant_type,
            phenotype_type: phenotype_type,
        }
    })
}

export {
    type QueryDownloadParams,
    queryDownload
}

