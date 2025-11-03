import { defineMongooseModel } from '#nuxt/mongoose'

export const QTLSchema = defineMongooseModel({
    name: 'Qtl',
    
    schema: {
        Variant_type: {
            type: 'string',
            required: true,
            unique: false,
        },
        Variant_ID: {
            type: 'string',
            required: false,
            unique: true,
        },
        Phenotype_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Phenotype_ID: {
            type: 'string',
            required: false,
            unique: true,
        }
    },
})
