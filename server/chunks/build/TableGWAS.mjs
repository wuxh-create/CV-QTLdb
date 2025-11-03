const model_gwas = [
  {
    name: "Plot",
    label: "Plot",
    field: "",
    sortable: false,
    align: "center"
  },
  {
    name: "Indicator_type",
    label: "Indicator_type",
    field: "Indicator_type",
    sortable: false,
    align: "center"
  },
  {
    name: "Indicator_name",
    label: "Indicator_name",
    field: "Indicator_name",
    sortable: false,
    align: "center"
  },
  {
    name: "Variant_type",
    label: "Variant_type",
    field: "Variant_type",
    sortable: false,
    align: "center"
  },
  {
    name: "Chromosome",
    label: "Chromosome",
    field: "CHR",
    sortable: false,
    align: "center",
    format: (val, _row) => `chr${val}`
  },
  {
    name: "Variant_ID",
    label: "Variant_ID",
    field: "Variant_ID",
    sortable: false,
    align: "center"
  },
  {
    name: "Variant_position",
    label: "Variant_position",
    field: "BP",
    sortable: false,
    align: "center"
  },
  {
    name: "Risk_allele",
    label: "Risk_allele",
    field: "A1",
    sortable: false,
    align: "center"
  },
  {
    name: "BETA",
    label: "Beta",
    field: "BETA",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  },
  {
    name: "STAT",
    // name要和field一致，否则会无法排序
    label: "Stat",
    field: "STAT",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  },
  {
    name: "P",
    label: "P",
    field: "P",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toExponential(3)
  },
  {
    name: "FDR",
    label: "FDR",
    field: "FDR",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toExponential(3)
  }
];

export { model_gwas as m };
//# sourceMappingURL=TableGWAS.mjs.map
