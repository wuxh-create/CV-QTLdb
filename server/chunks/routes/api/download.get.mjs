import { d as defineEventHandler, g as getQuery, c as createError, s as setResponseHeader } from '../../nitro/nitro.mjs';
import path from 'path';
import fs from 'fs';
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

async function send_file(event, file_path) {
  console.log("file_path", file_path);
  if (!fs.existsSync(file_path)) {
    return {
      code: 404,
      message: "File not found"
    };
  } else {
    const fileBuffer = await fs.promises.readFile(file_path);
    setResponseHeader(event, "Content-Disposition", `attachment; filename=${encodeURIComponent(path.basename(file_path))}`);
    setResponseHeader(event, "Content-Type", "application/gzip");
    return fileBuffer;
  }
}
const download_get = defineEventHandler(async (event) => {
  const {
    download_type,
    variant_type,
    phenotype_type
  } = getQuery(event);
  if (!download_type || !["variants", "qtl", "gwas"].includes(download_type)) {
    return {
      code: 400,
      message: "Invalid download_type"
    };
  }
  if (download_type === "variants") {
    if (!variant_type || !["SNP", "InDel", "MNV", "SV"].includes(variant_type)) {
      return {
        args: getQuery(event),
        code: 400,
        message: "Invalid variant_type"
      };
    } else {
      return createError({
        statusCode: 500,
        statusMessage: "Downloading is not available until published"
      });
    }
  } else if (download_type === "qtl") {
    if (!phenotype_type || !variant_type || !["SNP", "InDel", "MNV", "SV"].includes(variant_type) || !["apaQTL", "eQTL", "sQTL", "meQTL"].includes(phenotype_type)) {
      return {
        code: 400,
        message: "Invalid variant_type or phenotype_type",
        data: null
      };
    } else {
      const file_name = `${variant_type}-${phenotype_type}.txt.gz`;
      const file_path = path.join("server", "data", file_name);
      return await send_file(event, file_path);
    }
  } else if (download_type === "gwas") {
    if (!variant_type || !["SNP", "InDel", "MNV", "SV"].includes(variant_type)) {
      return {
        code: 400,
        message: "Missing variant_type or indicator_type",
        data: null
      };
    } else {
      const file_name = `${variant_type}-GWAS.tsv.gz`;
      const file_path = path.join("server", "data", file_name);
      return await send_file(event, file_path);
    }
  }
  return {
    code: 400,
    message: "Invalid download_type",
    data: null
  };
});

export { download_get as default };
//# sourceMappingURL=download.get.mjs.map
