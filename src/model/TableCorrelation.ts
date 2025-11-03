import type { QTableProps } from 'quasar'

const model_correlation: QTableProps['columns'] = [
    {
        name: 'Plot',
        label: 'Plot',
        field: '',
        sortable: false,
        align: 'center'
    },
    {
        name: 'Indicator_type',
        label: 'Indicator_type',
        field: 'Indicator_type',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Indicator_name',
        label: 'Indicator_name',
        field: 'Indicator_name',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Phenotype_type',
        label: 'Phenotype_type',
        field: 'Phenotype_type',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Phenotype_ID',
        label: 'Phenotype_ID',
        field: 'Phenotype_ID',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Cor_pearson',
        label: 'R_pearson',
        field: 'Cor_pearson',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
    {
        name: 'Cor_spearman',
        label: 'R_spearman',
        field: 'Cor_spearman',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
]

export default model_correlation
