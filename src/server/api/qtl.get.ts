// Nuxt 3 API 处理函数，监听 /api/qtl GET 请求
export default defineEventHandler(async (event) => {
    // 从 URL 查询参数中提取前端传来的参数
    const {
        variant_type,
        variant_id,
        phenotype_type,
        phenotype_id,
        page,
        pageSize,
        sortBy,
        order
    } = getQuery(event)

    // 构造 MongoDB 查询条件
    const query: any = {}

    if (variant_type) query.Variant_type = variant_type
    if (variant_id) query.Variant_ID = variant_id
    if (phenotype_type) query.Phenotype_type = phenotype_type
    if (phenotype_id) query.Phenotype_ID = phenotype_id

    // 分页参数处理（默认每页10条，第1页）
    const pageSizeNumber = Number(pageSize) || 10
    const pageNumber = Number(page) || 1
    let limit = 10
    let skip = 0
    if (pageSizeNumber > 0) {
        limit = pageSizeNumber
        skip = (pageNumber - 1) * limit
    }

    // 并发查询多个数据库信息
    const [total, raw_result_cursor, variant_type_stats, phenotype_type_stats] = await Promise.all([
        // 查询总条数
        QTLSchema.countDocuments(query),

        // 查询主结果列表（带分页或不分页）
        pageSizeNumber === -1 ? 
            QTLSchema.find(query)  // 不分页，返回全部
                .sort(sortBy ? [[sortBy, Number(order) || 1]] : []) :
            QTLSchema.find(query)  // 分页返回
                .sort(sortBy ? [[sortBy, Number(order) || 1]] : [])
                .skip(skip)
                .limit(limit),

        // 按 Variant_type 聚合，统计每种变异类型下的独立 Variant_ID 数量
        QTLSchema.aggregate([
            { $match: query },
            { $group: { _id: "$Variant_type", count: { $sum: 1 }, uniqueVariantIDs: { $addToSet: "$Variant_ID" } } },
            { $project: { _id: 1, count: { $size: "$uniqueVariantIDs" } } }
        ]),

        // 按 Phenotype_type 聚合，统计每种表型类型的数量
        QTLSchema.aggregate([
            { $match: query },
            { $group: { _id: "$Phenotype_type", count: { $sum: 1 } } }
        ])
    ])

    // 预定义所有支持的类型（防止部分类型在当前查询中缺失）
    const variantTypes = ["SNP", "MNV", "InDel", "SV"]
    const phenotypeTypes = ["apaQTL", "eQTL", "meQTL", "sQTL"]

    // 初始化 statsMap，默认所有类型数量为 0
    const statsMap = [...variantTypes, ...phenotypeTypes].reduce(
        (acc: { [key: string]: number }, type) => {
            acc[type] = 0
            return acc
        },
        {}
    )

    // 将 variant_type 的实际统计结果更新到 statsMap 中
    variant_type_stats.forEach(({ _id, count }) => {
        if (statsMap.hasOwnProperty(_id)) {
            statsMap[_id] = count
        }
    })

    // 将 phenotype_type 的实际统计结果更新到 statsMap 中
    phenotype_type_stats.forEach(({ _id, count }: { _id: string, count: number }) => {
        if (statsMap.hasOwnProperty(_id)) {
            statsMap[_id] = count
        }
    })

    // 返回响应结果
    return {
        code: 200,
        message: 'success',
        stat: statsMap,     // 各类型数量统计
        total: total,       // 总记录条数
        data: raw_result_cursor  // 当前页数据
    }
})
