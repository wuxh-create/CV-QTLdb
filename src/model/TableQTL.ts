import type { QTableProps } from 'quasar'

const model_qtl: QTableProps["columns"] = [
    {
        name: 'Plot',
        label: 'Plot',
        field: '',
        sortable: false,
        align: 'center'
    },
    {
        name: 'QTL_type',
        label: 'QTL_type',
        field: 'qtl_type',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Variant_type',
        label: 'Variant_type',
        field: 'Variant_type',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Variant_ID',
        label: 'Variant_ID',
        field: 'Variant_ID',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Variant_position',
        label: 'Variant_position',
        field: 'Variant_position',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Ref',
        label: 'Ref',
        field: 'Ref',
        sortable: false,
        align: 'center'
    },
    {
        name: 'Alt',
        label: 'Alt',
        field: 'Alt',
        sortable: false,
        align: 'center'
    },
    {
        name: 'Phenotype_type',
        label: 'Phenotype_type',
        field: 'Phenotype_type',
        sortable: false,
        align: 'center'
    },
    {
        name: 'Phenotype_ID',
        label: 'Phenotype_ID',
        field: 'Phenotype_ID',
        sortable: false,
        align: 'center'
    },
    {
        name: 'Phenotype_position',
        label: 'Phenotype_position',
        field: 'Phenotype_position',
        sortable: false,
        align: 'center'
    },
    {
        name: 'Gene',
        label: 'Gene',
        field: 'Gene',
        sortable: false,
        align: 'center'
    },
    {
        name: 'distance',
        // name要和field一致，否则会无法排序
        label: 'Distance',
        field: 'distance',
        sortable: true,
        // sortable: false,
        align: 'center',
        format: (val: number, _row: any) => Number(val).toFixed(0)
    },
    {
        name: 'Beta',
        label: 'Beta',
        field: 'Beta',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
    {
        name: 'T_stat',
        label: 'T_stat',
        field: 'T_stat',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
    {
        name: 'Se',
        label: 'Se',
        field: 'Se',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
    {
        name: 'R_pearson',
        label: 'R_pearson',
        field: 'R_pearson',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
    {
        name: 'FDR',
        label: 'FDR',
        field: 'FDR',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toExponential(3)
    },
]

export default model_qtl
