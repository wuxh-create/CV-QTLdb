import fs from 'fs';

export const count_lines = (file_path: fs.PathLike) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let isLastChunk = false; // 标记是否是最后一个数据块

    fs.createReadStream(file_path)
      .on('data', (buffer) => {
        let lastCharIsNewLine = false;
        for (let i = 0; i < buffer.length; i++) {
          const charCode = buffer[i];
          if (charCode === 10) { // 检测换行符
            count++;
            lastCharIsNewLine = true;
          } else if (charCode === 0) { // 检测字符为0，表示数据块结束
            isLastChunk = true;
          }
        }
        // 如果是最后一个数据块，并且最后一个字符不是换行符，增加一行
        if (isLastChunk && !lastCharIsNewLine) {
          count++;
          isLastChunk = false; // 重置标记
        }
      })
      .on('end', () => {
        if (!isLastChunk) { // 如果文件结束且不是最后一个数据块，增加一行
          count++;
        }
        setTimeout(() => {
          resolve(count);
        }, 2000);
      })
      .on('error', reject);
  });
}
