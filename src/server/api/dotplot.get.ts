export default defineEventHandler(async (event) => {
    const {
        phenotype_type,
        phenotype_id,
        indicator_type,
        indicator_name
    } = getQuery(event)

    if (!Boolean(phenotype_id) || !Boolean(indicator_name)) {
        return {
            code: 400,
            message: "phenotype_id and indicator_name are required"
        }
    }

    const query: any = {}
    if (Boolean(phenotype_type)) query.Phenotype_type = phenotype_type
    if (Boolean(indicator_type)) query.Indicator_type = indicator_type
    query.Phenotype_ID = phenotype_id
    query.Indicator_name = indicator_name

    return {
        code: 200,
        message: 'success',
        data: await DotplotSchema.findOne(query)
        // data: test_data
    }
})
