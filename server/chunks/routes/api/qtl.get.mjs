import { d as defineEventHandler, g as getQuery, Q as QTLSchema } from '../../nitro/nitro.mjs';
import 'mongoose';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'consola/utils';
import 'node:url';

const qtl_get = defineEventHandler(async (event) => {
  const {
    variant_type,
    variant_id,
    phenotype_type,
    phenotype_id,
    page,
    pageSize,
    sortBy,
    order
  } = getQuery(event);
  const query = {};
  if (variant_type) query.Variant_type = variant_type;
  if (variant_id) query.Variant_ID = variant_id;
  if (phenotype_type) query.Phenotype_type = phenotype_type;
  if (phenotype_id) query.Phenotype_ID = phenotype_id;
  const pageSizeNumber = Number(pageSize) || 10;
  const pageNumber = Number(page) || 1;
  let limit = 10;
  let skip = 0;
  if (pageSizeNumber > 0) {
    limit = pageSizeNumber;
    skip = (pageNumber - 1) * limit;
  }
  const [total, raw_result_cursor, variant_type_stats, phenotype_type_stats] = await Promise.all([
    // 查询总条数
    QTLSchema.countDocuments(query),
    // 查询主结果列表（带分页或不分页）
    pageSizeNumber === -1 ? QTLSchema.find(query).sort(sortBy ? [[sortBy, Number(order) || 1]] : []) : QTLSchema.find(query).sort(sortBy ? [[sortBy, Number(order) || 1]] : []).skip(skip).limit(limit),
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
  ]);
  const variantTypes = ["SNP", "MNV", "InDel", "SV"];
  const phenotypeTypes = ["apaQTL", "eQTL", "meQTL", "sQTL"];
  const statsMap = [...variantTypes, ...phenotypeTypes].reduce(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {}
  );
  variant_type_stats.forEach(({ _id, count }) => {
    if (statsMap.hasOwnProperty(_id)) {
      statsMap[_id] = count;
    }
  });
  phenotype_type_stats.forEach(({ _id, count }) => {
    if (statsMap.hasOwnProperty(_id)) {
      statsMap[_id] = count;
    }
  });
  return {
    code: 200,
    message: "success",
    stat: statsMap,
    // 各类型数量统计
    total,
    // 总记录条数
    data: raw_result_cursor
    // 当前页数据
  };
});

export { qtl_get as default };
//# sourceMappingURL=qtl.get.mjs.map
