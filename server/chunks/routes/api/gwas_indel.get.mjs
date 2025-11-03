import { d as defineEventHandler, g as getQuery, G as GwasInDel } from '../../nitro/nitro.mjs';
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

const gwas_indel_get = defineEventHandler(async (event) => {
  const {
    // variant_type,
    variant_id,
    indicator_type,
    indicator_name,
    page,
    pageSize,
    sortBy,
    order
  } = getQuery(event);
  const query = { Variant_type: "InDel" };
  if (Boolean(variant_id)) query.Variant_ID = variant_id;
  if (Boolean(indicator_type)) query.Indicator_type = indicator_type;
  if (Boolean(indicator_name)) query.Indicator_name = indicator_name;
  const pageSizeNumber = Number(pageSize) || 10;
  const pageNumber = Number(page) || 1;
  let limit = 10;
  let skip = 0;
  if (pageSizeNumber > 0) {
    limit = pageSizeNumber;
    skip = (pageNumber - 1) * limit;
  }
  const [total, raw_result_cursor, indicator_type_stats] = await Promise.all([
    GwasInDel.countDocuments(query),
    pageSizeNumber === -1 ? GwasInDel.find(query).sort(sortBy ? [[sortBy, Number(order)]] : []) : GwasInDel.find(query).sort(sortBy ? [[sortBy, Number(order)]] : []).skip(skip).limit(limit),
    // GwasInDel.aggregate([
    //     { $match: query },
    //     { $group: { _id: "$Variant_type", count: { $sum: 1 }, uniqueVariantIDs: { $addToSet: "$Variant_ID" } } },
    //     { $project: { _id: 1, count: { $size: "$uniqueVariantIDs" } } }
    // ]),
    GwasInDel.aggregate([
      { $match: query },
      { $group: { _id: "$Indicator_type", count: { $sum: 1 }, uniqueIndicatorNames: { $addToSet: "$Indicator_name" } } },
      { $project: { _id: 1, count: { $size: "$uniqueIndicatorNames" } } }
    ])
  ]);
  const indicatorTypes = ["Pathology", "Nutrition", "Toxin", "Measurement", "Hormone", "Questionnaire"];
  const statMap = indicatorTypes.reduce((acc, t) => {
    acc[t] = 0;
    return acc;
  }, {});
  indicator_type_stats.forEach(({ _id, count }) => {
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

export { gwas_indel_get as default };
//# sourceMappingURL=gwas_indel.get.mjs.map
