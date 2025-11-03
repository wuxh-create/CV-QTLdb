import { d as defineEventHandler, g as getQuery, i as QtlMNV } from '../../nitro/nitro.mjs';
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

const qtls_mnv_get = defineEventHandler(async (event) => {
  const {
    variant_id,
    phenotype_type,
    phenotype_id,
    page,
    pageSize,
    sortBy,
    order
  } = getQuery(event);
  const query = { Variant_type: "MNV" };
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
  const [total, raw_result_cursor, phenotype_type_stats] = await Promise.all([
    // 查询总条数
    QtlMNV.countDocuments(query),
    // 查询主结果列表（带分页或不分页）
    pageSizeNumber === -1 ? QtlMNV.find(query).sort(sortBy ? [[sortBy, Number(order) || 1]] : []) : QtlMNV.find(query).sort(sortBy ? [[sortBy, Number(order) || 1]] : []).skip(skip).limit(limit),
    // 按 Phenotype_type 聚合，统计每种表型类型的数量
    QtlMNV.aggregate([
      { $match: query },
      { $group: { _id: "$Phenotype_type", count: { $sum: 1 } } }
    ])
  ]);
  const phenotypeTypes = ["apaQTL", "eQTL", "meQTL", "sQTL"];
  const statMap = phenotypeTypes.reduce((acc, t) => {
    acc[t] = 0;
    return acc;
  }, {});
  phenotype_type_stats.forEach(({ _id, count }) => {
    if (statMap.hasOwnProperty(_id)) {
      statMap[_id] = count;
    }
  });
  return {
    code: 200,
    message: "success",
    stat: statMap,
    total,
    data: raw_result_cursor
  };
});

export { qtls_mnv_get as default };
//# sourceMappingURL=qtls_mnv.get.mjs.map
