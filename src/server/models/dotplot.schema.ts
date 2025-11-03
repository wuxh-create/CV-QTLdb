import { defineMongooseModel } from '#nuxt/mongoose'

export const DotplotSchema = defineMongooseModel({
    name: 'Dotplot',
    
    schema: {
        Phenotype_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Phenotype_ID: {
            type: 'string',
            required: true,
            unique: false,
        },
        Indicator_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Indicator_name: {
            type: 'string',
            required: true,
            unique: false,
        }
    },
})
