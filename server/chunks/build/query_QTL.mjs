const queryQTL = ({
  variant_type,
  variant_id,
  phenotype_type,
  phenotype_id,
  page = 1,
  // 默认页码：第1页
  pageSize = 10,
  // 每页显示10条
  sortBy = "FDR",
  // 排序字段，默认为FDR（假发现率）
  order = 1
  // 排序顺序，1为升序或降序（依据后端约定）
}) => {
  return $fetch(`/api/qtl`, {
    method: "GET",
    // 使用 GET 请求
    params: {
      variant_type,
      variant_id,
      phenotype_type,
      phenotype_id,
      page,
      pageSize,
      sortBy,
      order
    }
  });
};
const queryBoxplot = ({
  variant_type,
  variant_id,
  phenotype_type,
  phenotype_id
}) => {
  return $fetch(`/api/boxplot`, {
    method: "GET",
    params: {
      variant_type,
      variant_id,
      phenotype_type,
      phenotype_id
    }
  });
};
const queryPhenotypeHints = ({
  phenotype_type,
  input
}) => {
  return $fetch(`/api/hint_phenotype`, {
    method: "GET",
    params: {
      phenotype_type,
      input
    }
  });
};

export { queryPhenotypeHints as a, queryBoxplot as b, queryQTL as q };
//# sourceMappingURL=query_QTL.mjs.map
