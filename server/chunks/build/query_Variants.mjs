const queryVariant = ({
  variant_type,
  variant_id,
  range,
  page = 1,
  pageSize = 10,
  sortBy = "Chromosome",
  order = 1
}) => {
  return $fetch(`/api/variant`, {
    method: "GET",
    params: {
      variant_type,
      range,
      variant_id,
      page,
      pageSize,
      sortBy,
      order
    }
  });
};
const queryVariantHints = ({ variant_type, input }) => {
  return $fetch(`/api/variant_hints`, {
    method: "GET",
    params: {
      variant_type,
      input
    }
  });
};

export { queryVariant as a, queryVariantHints as q };
//# sourceMappingURL=query_Variants.mjs.map
