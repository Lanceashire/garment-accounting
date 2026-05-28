import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

/**
 * 将记录数组导出为 Excel (.xlsx) 并调用系统分享
 * @param {Array} records  - [{ id, code, qty, price, total, time }, ...]
 * @returns {Promise<string>} 导出文件路径
 */
export async function exportToExcel(records) {
  if (!records || records.length === 0) {
    throw new Error('没有可导出的记录');
  }

  const totalAmount = records.reduce((sum, r) => sum + Number(r.total || 0), 0);
  const totalRowNumber = records.length + 3;
  const rows = [
    ['序号', '产品编号', '件数', '单价(元)', '总价(元)', '记录时间'],
    ...records.map((r, i) => [
      i + 1,
      r.code,
      Number(r.qty),
      Number(r.price),
      Number(r.total),
      r.time,
    ]),
    [],
    ['', '', '', '合计', { f: `SUM(E2:E${records.length + 1})`, v: totalAmount, t: 'n' }, ''],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet[`D${totalRowNumber}`].s = { font: { bold: true } };
  worksheet[`E${totalRowNumber}`].s = { font: { bold: true } };
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 16 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '记账明细');

  const path = FileSystem.documentDirectory + '记账明细.xlsx';
  const workbookBase64 = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'base64',
  });

  await FileSystem.writeAsStringAsync(path, workbookBase64, {
    encoding: 'base64',
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(path, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: '导出记账明细',
    });
  }

  return path;
}
