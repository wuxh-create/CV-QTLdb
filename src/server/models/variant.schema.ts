import { defineMongooseModel } from '#nuxt/mongoose'

export const VariantSchema = defineMongooseModel({
    name: 'Variant',
    
    schema: {
        Variant_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Variant_ID: {
            type: 'string',
            required: false,
            unique: true,
        }
    },
})
