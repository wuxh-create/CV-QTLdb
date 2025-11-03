import { defineMongooseModel } from '#nuxt/mongoose'

export const CorrelationSchema = defineMongooseModel({
    name: 'Correlation',
    schema: {
        Phenotype_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Phenotype_ID: {
            type: 'string',
            required: false,
            unique: false,
        },
        Indicator_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Indicator_name: {
            type: 'string',
            required: false,
            unique: false,
        },
    },
})
