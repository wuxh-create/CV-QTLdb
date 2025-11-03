import { defineMongooseModel } from '#nuxt/mongoose'

export const GwasSNP = defineMongooseModel({
    name: 'GwasSNP',
    
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
        Indocator_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Indocator_name: {
            type: 'string',
            required: false,
            unique: true,
        }
    },
})
