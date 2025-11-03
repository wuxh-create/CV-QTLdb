// 引入类型定义：VariantType（变异类型）、PhenotypeType（表型类型）、PaginationParams（分页参数）
import {
    type VariantType,
    type PhenotypeType,
    type PaginationParams
} from "@/interface/types_query"

// 从本地模块引入 queryVariantHints 函数（通常用于自动提示变异 ID）
import { queryVariantHints } from "./query_Variants"

// ---------------------------------------------
// 接口：QTL查询参数，包含变异、表型信息及分页、排序控制
// ---------------------------------------------
interface QueryQTLParams extends PaginationParams {
    variant_type: VariantType | null,       // 变异类型（如 SNP、SV）
    variant_id: string | null,              // 变异ID（可选）
    phenotype_type: PhenotypeType | null,   // 表型类型（如表达量、甲基化）
    phenotype_id: string | null             // 表型ID（可选）
}

// ---------------------------------------------
// 函数：查询 QTL 数据表（分页、排序、自定义筛选）
// ---------------------------------------------
const queryQTL = ({
    variant_type,
    variant_id,
    phenotype_type,
    phenotype_id,
    page = 1,               // 默认页码：第1页
    pageSize = 10,          // 每页显示10条
    sortBy = 'FDR',         // 排序字段，默认为FDR（假发现率）
    order = 1               // 排序顺序，1为升序或降序（依据后端约定）
}: QueryQTLParams) => {
    return $fetch(`/api/qtl`, {
        method: 'GET',      // 使用 GET 请求
        params: {
            variant_type: variant_type,
            variant_id: variant_id,
            phenotype_type: phenotype_type,
            phenotype_id: phenotype_id,
            page: page,
            pageSize: pageSize,
            sortBy: sortBy,
            order: order
        }
    })
}

// ---------------------------------------------
// 接口：boxplot查询所需的精确信息（必须完整）
// ---------------------------------------------
interface QueryBoxplotParams {
    variant_type: VariantType,          // 变异类型
    variant_id: string,                 // 变异ID
    phenotype_type: PhenotypeType,      // 表型类型
    phenotype_id: string                // 表型ID
}

// ---------------------------------------------
// 函数：查询绘制 boxplot 所需的表达或表型值
// ---------------------------------------------
const queryBoxplot = ({
    variant_type,
    variant_id,
    phenotype_type,
    phenotype_id
}: QueryBoxplotParams) => {
    return $fetch(`/api/boxplot`, {
        method: "GET",
        params: {
            variant_type: variant_type,
            variant_id: variant_id,
            phenotype_type: phenotype_type,
            phenotype_id: phenotype_id
        }
    })
}

// ---------------------------------------------
// 接口：表型提示词查询参数
// ---------------------------------------------
interface QueryPhenotypeHintsParams {
    phenotype_type: PhenotypeType | null,  // 可选的表型类型，用于限定搜索范围
    input: string                          // 用户输入的关键词（如前缀、模糊匹配）
}

// ---------------------------------------------
// 函数：查询表型 ID 提示（如自动完成下拉列表）
// ---------------------------------------------
const queryPhenotypeHints = ({
    phenotype_type,
    input
}: QueryPhenotypeHintsParams) => {
    return $fetch(`/api/hint_phenotype`, {
        method: "GET",
        params: {
            phenotype_type: phenotype_type,
            input: input
        }
    })
}

// ---------------------------------------------
// 导出类型和函数，供其他组件或模块调用
// ---------------------------------------------
export {
    type VariantType,
    type PhenotypeType,
    queryQTL,               // 查询QTL表
    queryBoxplot,           // 查询箱线图数据
    queryVariantHints,      // 查询变异ID提示（引自外部）
    queryPhenotypeHints     // 查询表型ID提示
}
