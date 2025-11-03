import { d as defineEventHandler, g as getQuery, D as DotplotSchema } from '../../nitro/nitro.mjs';
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

const dotplot_get = defineEventHandler(async (event) => {
  const {
    phenotype_type,
    phenotype_id,
    indicator_type,
    indicator_name
  } = getQuery(event);
  if (!Boolean(phenotype_id) || !Boolean(indicator_name)) {
    return {
      code: 400,
      message: "phenotype_id and indicator_name are required"
    };
  }
  const query = {};
  if (Boolean(phenotype_type)) query.Phenotype_type = phenotype_type;
  if (Boolean(indicator_type)) query.Indicator_type = indicator_type;
  query.Phenotype_ID = phenotype_id;
  query.Indicator_name = indicator_name;
  return {
    code: 200,
    message: "success",
    data: await DotplotSchema.findOne(query)
    // data: test_data
  };
});

export { dotplot_get as default };
//# sourceMappingURL=dotplot.get.mjs.map
