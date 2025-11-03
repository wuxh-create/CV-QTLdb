import { d as defineEventHandler, g as getQuery, B as BoxplotSchema } from '../../nitro/nitro.mjs';
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

const boxplot_get = defineEventHandler(async (event) => {
  const {
    variant_type,
    variant_id,
    phenotype_type,
    phenotype_id
  } = getQuery(event);
  if (!Boolean(variant_id) || !Boolean(phenotype_id)) {
    return {
      code: 400,
      message: "variant_id and phenotype_id are required"
    };
  }
  const query = {};
  if (Boolean(variant_type)) query.Variant_type = variant_type;
  if (Boolean(phenotype_type)) query.Phenotype_type = phenotype_type;
  query.Variant_ID = variant_id;
  query.Phenotype_ID = phenotype_id;
  return {
    code: 200,
    message: "success",
    data: await BoxplotSchema.findOne(query)
  };
});

export { boxplot_get as default };
//# sourceMappingURL=boxplot.get.mjs.map
