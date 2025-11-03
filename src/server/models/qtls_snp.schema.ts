import { defineMongooseModel } from '#nuxt/mongoose'

export const QtlSNP = defineMongooseModel({
  // 模型名
  name: 'QtlSNP',
  // 指定 MongoDB 集合名
  // collection: 'qtls_SNP',    Error: Invalid schema configuration: `qtls_SNP` is not a valid type at path `collection`.
  // collection: 'qtlsnps',
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