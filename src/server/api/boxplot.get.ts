export default defineEventHandler(async (event) => {
    const {
        variant_type,
        variant_id,
        phenotype_type,
        phenotype_id
    } = getQuery(event)

    if (!Boolean(variant_id) || !Boolean(phenotype_id)) {
        return {
            code: 400,
            message: "variant_id and phenotype_id are required"
        }
    }

    const query: any = {}
    if (Boolean(variant_type)) query.Variant_type = variant_type
    if (Boolean(phenotype_type)) query.Phenotype_type = phenotype_type
    query.Variant_ID = variant_id
    query.Phenotype_ID = phenotype_id
    return {
        code: 200,
        message: 'success',
        data: await BoxplotSchema.findOne(query)
    }
})
