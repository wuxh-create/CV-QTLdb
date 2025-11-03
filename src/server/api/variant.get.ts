export default defineEventHandler(async (event) => {
  const {
    variant_type,
    variant_id,
    range,
    page,
    pageSize,
    sortBy,
    order
  } = getQuery(event)

  const query: any = {}

  if (variant_type) query.Variant_type = variant_type
  if (variant_id) query.Variant_ID = variant_id
  if (range) {
    const [chr, start_end] = String(range).split(':')
    query.Chromosome = chr
    if (start_end) {
      const [start, end] = start_end.split('-')
      query.Start = {
        $gte: Number(start),
        $lte: Number(end)
      }
    }
  }


  const pageSizeNumber = Number(pageSize) || 10
  const pageNumber = Number(page) || 1

  let limit = 10
  let skip = 0
  if (pageSizeNumber > 0) {
    limit = pageSizeNumber
    skip = (pageNumber - 1) * limit
  }

  const [total, raw_result_cursor, results_stat] = await Promise.all([
    VariantSchema.countDocuments(query),
    pageSizeNumber === -1 ?
      VariantSchema.find(query)
        .sort(sortBy ? [[sortBy, Number(order) || 1]] : []) :
      VariantSchema.find(query)
        .sort(sortBy ? [[sortBy, Number(order) || 1]] : [])
        .skip(skip)
        .limit(limit),
    VariantSchema.aggregate([
      { $match: query },
      { $group: { _id: "$Variant_type", count: { $sum: 1 } } }
    ])
  ])

  const resultsStatMap = results_stat.reduce(
    (acc, { _id, count }) => {
      acc[_id] = count
      return acc
    },
    { SNP: 0, MNV: 0, SV: 0, InDel: 0 }
  )

  return {
    code: 200,
    message: 'success',
    stat: resultsStatMap,
    total: total,
    data: raw_result_cursor
  }
})
