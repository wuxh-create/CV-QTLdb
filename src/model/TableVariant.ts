import type { QTableProps } from 'quasar';

const model_variant: QTableProps['columns'] = [
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
        name: 'Chromosome',
        label: 'Chromosome',
        field: 'Chromosome',
        sortable: true,
        align: 'center',
    },
    {
        name: 'Start',
        label: 'Start',
        field: 'Start',
        sortable: false,
        align: 'center',
    },
    {
        name: 'End',
        label: 'End',
        field: 'End',
        sortable: false,
        align: 'center',
    },
    {
        name: 'Position',
        label: 'Position',
        field: 'Position',
        sortable: false,
        align: 'center'
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
        name: 'MAF',
        label: 'MAF',
        field: 'MAF',
        sortable: true,
        align: 'center',
        format: (val: string, _row: any) => Number(val).toFixed(3)
    },
]

export default model_variant
