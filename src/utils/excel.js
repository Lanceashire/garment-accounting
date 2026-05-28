import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

/**
 * 将记录数组导出为 Excel (.xlsx) 并调用系统分享
 * @param {Array} records  - [{ id, code, qty, price, total, time }, ...]
 * @returns {Promise<string>} 导出文件路径
 */
export async function exportToExcel(records) {
  if (!records || records.length === 0) {
    throw new Error('没有可导出的记录');
  }

  // 手动构建 XLSX (SpreadsheetML)，避免在 RN 中引入完整的 xlsx 解析引擎
  const xml = buildXLSX(records);
  const path = FileSystem.documentDirectory + '记账明细.xlsx';

  await FileSystem.writeAsStringAsync(path, xml, {
    encoding: 'utf8',
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

function buildXLSX(records) {
  const now = new Date().toISOString();
  const rows = records.map((r, i) => row(i + 1, r));

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="记账明细">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">序号</Data></Cell>
        <Cell><Data ss:Type="String">产品编号</Data></Cell>
        <Cell><Data ss:Type="String">件数</Data></Cell>
        <Cell><Data ss:Type="String">单价(元)</Data></Cell>
        <Cell><Data ss:Type="String">总价(元)</Data></Cell>
        <Cell><Data ss:Type="String">记录时间</Data></Cell>
      </Row>
${rows}
    </Table>
  </Worksheet>
</Workbook>`;
}

function row(index, r) {
  const qty  = Number(r.qty);
  const price = Number(r.price);
  const total = (qty * price).toFixed(2);

  return `      <Row>
        <Cell><Data ss:Type="Number">${index}</Data></Cell>
        <Cell><Data ss:Type="String">${esc(r.code)}</Data></Cell>
        <Cell><Data ss:Type="Number">${qty}</Data></Cell>
        <Cell><Data ss:Type="Number">${price.toFixed(2)}</Data></Cell>
        <Cell ss:StyleID="total"><Data ss:Type="Number">${total}</Data></Cell>
        <Cell><Data ss:Type="String">${esc(r.time)}</Data></Cell>
      </Row>`;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
