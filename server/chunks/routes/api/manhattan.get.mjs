import { d as defineEventHandler, g as getQuery, M as ManhattanSchema } from '../../nitro/nitro.mjs';
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

const manhattan_get = defineEventHandler(async (event) => {
  const {
    variant_type,
    indicator_type,
    indicator_name
  } = getQuery(event);
  if (!variant_type || !indicator_name) {
    return {
      code: 400,
      message: "variant_type and indicator_name is required"
    };
  }
  const query = {};
  if (indicator_type) query.Indicator_type = indicator_type;
  query.Variant_type = variant_type;
  query.Indicator_name = indicator_name;
  return {
    code: 200,
    message: "success",
    data: await ManhattanSchema.findOne(query)
  };
});

export { manhattan_get as default };
//# sourceMappingURL=manhattan.get.mjs.map
