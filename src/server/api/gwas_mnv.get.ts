export default defineEventHandler(async (event) => {
    const {
        // variant_type,
        variant_id,
        indicator_type,
        indicator_name,
        page,
        pageSize,
        sortBy,
        order
    } = getQuery(event)
    const query: any = { Variant_type: 'MNV' }

    // if (Boolean(variant_type)) query.Variant_type = variant_type
    if (Boolean(variant_id)) query.Variant_ID = variant_id
    if (Boolean(indicator_type)) query.Indicator_type = indicator_type
    if (Boolean(indicator_name)) query.Indicator_name = indicator_name

    const pageSizeNumber = Number(pageSize) || 10
    const pageNumber = Number(page) || 1
    let limit = 10
    let skip = 0
    if (pageSizeNumber > 0) {
        limit = pageSizeNumber
        skip = (pageNumber - 1) * limit
    }

    const [total, raw_result_cursor, indicator_type_stats] = await Promise.all([
        GwasMNV.countDocuments(query),
        pageSizeNumber === -1 ?
            GwasMNV.find(query)
                .sort(sortBy ? [[sortBy, Number(order)]] : []) :
            GwasMNV.find(query)
                .sort(sortBy ? [[sortBy, Number(order)]] : [])
                .skip(skip)
                .limit(limit),
        // GwasMNV.aggregate([
        //     { $match: query },
        //     { $group: { _id: "$Variant_type", count: { $sum: 1 }, uniqueVariantIDs: { $addToSet: "$Variant_ID" } } },
        //     { $project: { _id: 1, count: { $size: "$uniqueVariantIDs" } } }
        // ]),
        GwasMNV.aggregate([
            { $match: query },
            { $group: { _id: "$Indicator_type", count: { $sum: 1 }, uniqueIndicatorNames: { $addToSet: "$Indicator_name" } } },
            { $project: { _id: 1, count: { $size: "$uniqueIndicatorNames" } } }
        ]),
    ])

    // const variantTypes = ["MNV", "MNV", "InDel", "SV"]
    const indicatorTypes = ["Pathology", "Nutrition", "Toxin", "Measurement", "Hormone", "Questionnaire"]

    // const statsMap = [...variantTypes, ...indicatorTypes].reduce(
    //     (acc: { [key: string]: number }, type) => {
    //         acc[type] = 0
    //         return acc
    //     },
    //     {}
    // )
    const statMap = indicatorTypes.reduce((acc, t) => {
        acc[t] = 0; return acc
      }, {} as Record<string, number>)

    // variant_type_stats.forEach(({ _id, count }) => {
    //     if (statsMap.hasOwnProperty(_id)) {
    //         statsMap[_id] = count
    //     }
    // })

    indicator_type_stats.forEach(({ _id, count }: { _id: string, count: number }) => {
        if (statMap.hasOwnProperty(_id)) {
            statMap[_id] = count
        }
    })

    return {
        code: 200,
        message: 'success',
        stat: statMap,
        total: total,
        data: raw_result_cursor
    }
})
