import { defineMongooseModel } from '#nuxt/mongoose'

export const ManhattanSchema = defineMongooseModel({
    name: 'Manhattan',
    
    schema: {
        Variant_type: {
            type: 'string',
            required: true,
            unique: false,
        },
        Indocator_type: {
            type: 'string',
            required: false,
            unique: false,
        },
        Indocator_name: {
            type: 'string',
            required: true,
            unique: true,
        }
    },
})
