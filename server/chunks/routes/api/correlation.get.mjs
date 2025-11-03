import { d as defineEventHandler, g as getQuery, C as CorrelationSchema } from '../../nitro/nitro.mjs';
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

const correlation_get = defineEventHandler(async (event) => {
  const {
    phenotype_type,
    phenotype_id,
    indicator_type,
    indicator_name,
    page,
    pageSize,
    sortBy,
    order
  } = getQuery(event);
  const query = {};
  if (Boolean(phenotype_type)) query.Phenotype_type = phenotype_type;
  if (Boolean(indicator_type)) query.Indicator_type = indicator_type;
  if (Boolean(phenotype_id)) query.Phenotype_ID = phenotype_id;
  if (Boolean(indicator_name)) query.Indicator_name = indicator_name;
  const pageSizeNumber = Number(pageSize) || 10;
  const pageNumber = Number(page) || 1;
  let limit = 10;
  let skip = 0;
  if (pageSizeNumber > 0) {
    limit = pageSizeNumber;
    skip = (pageNumber - 1) * limit;
  }
  const [total, raw_result_cursor, phentype_type_stats, indicator_type_stats] = await Promise.all([
    CorrelationSchema.countDocuments(query),
    pageSizeNumber === -1 ? CorrelationSchema.find(query).sort(sortBy ? [[sortBy, Number(order)]] : []) : CorrelationSchema.find(query).sort(sortBy ? [[sortBy, Number(order)]] : []).skip(skip).limit(limit),
    CorrelationSchema.aggregate([
      { $match: query },
      { $group: { _id: "$Phenotype_type", count: { $sum: 1 }, uniquePhenotypeIDs: { $addToSet: "$Phenotype_ID" } } },
      { $project: { _id: 1, count: { $size: "$uniquePhenotypeIDs" } } }
    ]),
    CorrelationSchema.aggregate([
      { $match: query },
      { $group: { _id: "$Indicator_type", count: { $sum: 1 }, uniqueIndicatorNames: { $addToSet: "$Indicator_name" } } },
      { $project: { _id: 1, count: { $size: "$uniqueIndicatorNames" } } }
    ])
  ]);
  const phenotypeTypes = ["apaQTL", "eQTL", "meQTL", "sQTL"];
  const indicatorTypes = ["Pathology", "Nutrition", "Toxin", "Measurement", "Hormone", "Questionnaire"];
  const statsMap = [...phenotypeTypes, ...indicatorTypes].reduce(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {}
  );
  phentype_type_stats.forEach(({ _id, count }) => {
    if (statsMap.hasOwnProperty(_id)) {
      statsMap[_id] = count;
    }
  });
  indicator_type_stats.forEach(({ _id, count }) => {
    if (statsMap.hasOwnProperty(_id)) {
      statsMap[_id] = count;
    }
  });
  return {
    code: 200,
    message: "success",
    stat: statsMap,
    total,
    data: raw_result_cursor
  };
});

export { correlation_get as default };
//# sourceMappingURL=correlation.get.mjs.map
