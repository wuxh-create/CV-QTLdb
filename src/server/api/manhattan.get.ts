export default defineEventHandler(async (event) => {
    const {
        variant_type,
        indicator_type,
        indicator_name,
    } = getQuery(event)

    if (!variant_type || !indicator_name) {
        return {
            code: 400,
            message: "variant_type and indicator_name is required"
        }
    }

    const query: any = {}
    if (indicator_type) query.Indicator_type = indicator_type
    query.Variant_type = variant_type
    query.Indicator_name = indicator_name
    return {
        code: 200,
        message: 'success',
        data: await ManhattanSchema.findOne(query)
    }
})
