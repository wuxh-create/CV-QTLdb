import {
    type PhenotypeType,
    type PaginationParams
  } from '@/interface/types_query'
  import { queryVariantHints } from './query_Variants'
  
// QTL 查询参数（固定 SV）
interface QuerySVParams extends PaginationParams {
  variant_id: string | null,              // 变异 ID（SV）
  phenotype_type: PhenotypeType | null,   // 表型类型
  phenotype_id: string | null             // 表型 ID
} 
// 查询 SV-QTL 列表
const querySV = ({
  variant_id,
  phenotype_type,
  phenotype_id,
  page = 1,
  pageSize = 10,
  sortBy = 'FDR',
  order = 1
}: QuerySVParams) => {
  return $fetch(`/api/qtls_sv`, {
    method: 'GET',
    params: {
      variant_type: 'SV',  // 固定
      variant_id,
      phenotype_type,
      phenotype_id,
      page,
      pageSize,
      sortBy: sortBy,
      order
    }
  })
}

// 查询 boxplot 数据
interface QueryBoxplotParams {
  variant_id: string,
  phenotype_type: PhenotypeType,
  phenotype_id: string
}
const queryBoxplotSV = ({
  variant_id,
  phenotype_type,
  phenotype_id
}: QueryBoxplotParams) => {
  return $fetch(`/api/boxplot`, {
    method: 'GET',
    params: {
      variant_type: 'SV',
      variant_id,
      phenotype_type,
      phenotype_id
    }
  })
}

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
  
  // 导出
export {
  type PhenotypeType,
  querySV,
  queryBoxplotSV as queryBoxplot,
  queryVariantHints,      // 复用外部的变异提示
  queryPhenotypeHints     // 查询表型ID提示
}