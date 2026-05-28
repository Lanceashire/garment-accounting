import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { registerRootComponent } from 'expo';
import { exportToExcel } from './src/utils/excel';

function App() {
  const [code, setCode] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [bills, setBills] = useState([{ id: 'bill-1', name: '账单1', records: [] }]);
  const [currentBillId, setCurrentBillId] = useState('bill-1');

  const currentBill = bills.find(bill => bill.id === currentBillId) || bills[0];
  const records = currentBill.records;

  const totalPrice = qty && price ? (parseFloat(qty) * parseFloat(price)).toFixed(2) : '0.00';

  const updateCurrentBillRecords = (updater) => {
    setBills(prev => prev.map(bill => {
      if (bill.id !== currentBill.id) return bill;
      const nextRecords = typeof updater === 'function' ? updater(bill.records) : updater;
      return { ...bill, records: nextRecords };
    }));
  };

  const addRecord = () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return Alert.alert('提示', '请输入产品编号');
    if (!/^[a-zA-Z0-9]+$/.test(trimmedCode)) {
      return Alert.alert('提示', '产品编号只能包含英文字母和数字');
    }
    const qtyNum = parseInt(qty, 10);
    if (!qty || qtyNum <= 0) return Alert.alert('提示', '请输入有效件数');
    const priceNum = parseFloat(price);
    if (!price || priceNum <= 0) return Alert.alert('提示', '请输入有效单价');

    const now = new Date();
    const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    updateCurrentBillRecords(prev => [{
      id: Date.now().toString(),
      code: trimmedCode,
      qty: qtyNum,
      price: priceNum,
      total: qtyNum * priceNum,
      time,
    }, ...prev]);
    setCode('');
    setQty('');
    setPrice('');
  };

  const deleteRecord = (id) => {
    updateCurrentBillRecords(prev => prev.filter(r => r.id !== id));
  };

  const createBill = () => {
    const nextIndex = bills.length + 1;
    const bill = {
      id: `bill-${Date.now()}`,
      name: `账单${nextIndex}`,
      records: [],
    };
    setBills(prev => [...prev, bill]);
    setCurrentBillId(bill.id);
    setCode('');
    setQty('');
    setPrice('');
  };

  const deleteCurrentBill = () => {
    if (bills.length <= 1) {
      Alert.alert('提示', '至少保留一个账单');
      return;
    }

    Alert.alert('删除账单', `确定删除 ${currentBill.name} 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          const currentIndex = bills.findIndex(bill => bill.id === currentBill.id);
          const nextBills = bills.filter(bill => bill.id !== currentBill.id);
          const nextIndex = Math.max(0, currentIndex - 1);
          setBills(nextBills);
          setCurrentBillId(nextBills[nextIndex].id);
          setCode('');
          setQty('');
          setPrice('');
        },
      },
    ]);
  };

  const handleExport = async () => {
    try {
      await exportToExcel(records);
    } catch (e) {
      Alert.alert('导出失败', e.message);
    }
  };

  const sumTotal = records.reduce((s, r) => s + r.total, 0);
  const allBillsTotal = bills.reduce(
    (sum, bill) => sum + bill.records.reduce((billSum, r) => billSum + r.total, 0),
    0
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* 顶部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>记账星</Text>
        <Text style={styles.headerSub}>记录每一笔工序收入</Text>
      </View>

      <View style={styles.billBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={bills}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.billList}
          renderItem={({ item }) => {
            const isActive = item.id === currentBill.id;
            const billTotal = item.records.reduce((s, r) => s + r.total, 0);
            return (
              <TouchableOpacity
                style={[styles.billChip, isActive && styles.billChipActive]}
                onPress={() => setCurrentBillId(item.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.billChipName, isActive && styles.billChipNameActive]}>{item.name}</Text>
                <Text style={[styles.billChipTotal, isActive && styles.billChipTotalActive]}>¥{billTotal.toFixed(2)}</Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <TouchableOpacity style={styles.addBillBtn} onPress={createBill} activeOpacity={0.8}>
              <Text style={styles.addBillText}>+ 新账单</Text>
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        keyboardShouldPersistTaps="handled"
      >
        {/* 输入卡片 */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>{currentBill.name} - 新建记录</Text>
            <TouchableOpacity
              style={[styles.deleteBillBtn, bills.length <= 1 && styles.deleteBillBtnDisabled]}
              onPress={deleteCurrentBill}
              activeOpacity={0.8}
              disabled={bills.length <= 1}
            >
              <Text style={[styles.deleteBillText, bills.length <= 1 && styles.deleteBillTextDisabled]}>删除账单</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>产品编号</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="如 A001 或 BX88"
                placeholderTextColor="#bbb"
                autoCapitalize="characters"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>件数</Text>
              <TextInput
                style={styles.input}
                value={qty}
                onChangeText={setQty}
                placeholder="0"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>单价 (元)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          {/* 实时总价预览 */}
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>总价</Text>
            <Text style={styles.previewValue}>¥ {totalPrice}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={addRecord} activeOpacity={0.8}>
            <Text style={styles.btnText}>添加记录</Text>
          </TouchableOpacity>
        </View>

        {/* 记录列表 */}
        <View style={styles.section}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{currentBill.name} 明细</Text>
            <Text style={styles.listCount}>{records.length} 条</Text>
          </View>
          <View style={styles.list}>
            {records.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>暂无记录，上方添加第一条</Text>
              </View>
            ) : records.map(item => (
              <View key={item.id} style={styles.recordCard}>
                <View style={styles.recordTop}>
                  <Text style={styles.recordCode}>{item.code}</Text>
                  <TouchableOpacity onPress={() => deleteRecord(item.id)}>
                    <Text style={styles.deleteBtn}>删除</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recordBody}>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>件数</Text>
                    <Text style={styles.recordValue}>{item.qty}</Text>
                  </View>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>单价</Text>
                    <Text style={styles.recordValue}>¥{item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>总价</Text>
                    <Text style={[styles.recordValue, styles.recordTotal]}>¥{item.total.toFixed(2)}</Text>
                  </View>
                </View>
                <Text style={styles.recordTime}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>账单汇总</Text>
            <Text style={styles.listCount}>{bills.length} 个</Text>
          </View>
          <View style={styles.billSummaryList}>
            {bills.map(bill => {
              const billTotal = bill.records.reduce((s, r) => s + r.total, 0);
              const isActive = bill.id === currentBill.id;
              return (
                <TouchableOpacity
                  key={bill.id}
                  style={[styles.billSummaryCard, isActive && styles.billSummaryCardActive]}
                  onPress={() => setCurrentBillId(bill.id)}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={[styles.billSummaryName, isActive && styles.billSummaryNameActive]}>{bill.name}</Text>
                    <Text style={styles.billSummaryMeta}>{bill.records.length} 条记录</Text>
                  </View>
                  <Text style={[styles.billSummaryTotal, isActive && styles.billSummaryTotalActive]}>¥ {billTotal.toFixed(2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 底部栏 */}
        <View style={styles.footer}>
          <View style={styles.sumBox}>
            <Text style={styles.sumLabel}>当前账单合计</Text>
            <Text style={styles.sumValue}>¥ {sumTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.sumBox}>
            <Text style={styles.sumLabel}>全部账单总计</Text>
            <Text style={styles.allSumValue}>¥ {allBillsTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.exportBtn, records.length === 0 && styles.btnDisabled]}
            onPress={handleExport}
            activeOpacity={0.8}
            disabled={records.length === 0}
          >
            <Text style={styles.btnText}>导出 Excel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

const C = {
  primary: '#2b6cb0',
  bg: '#f7f8fa',
  white: '#fff',
  border: '#e8ecf1',
  text: '#1a1a2e',
  muted: '#8e8e93',
  danger: '#e74c3c',
};

const styles = {
  container:        { flex: 1, backgroundColor: C.bg },
  header:           { backgroundColor: C.white, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: C.border },
  headerTitle:      { fontSize: 24, fontWeight: '700', color: C.text },
  headerSub:        { fontSize: 13, color: C.muted, marginTop: 4 },
  billBar:          { backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
  billList:         { paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  content:          { flex: 1 },
  contentInner:     { paddingBottom: 24 },
  billChip:         { minWidth: 112, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: C.border, borderRadius: 8, marginRight: 10, backgroundColor: C.bg },
  billChipActive:   { borderColor: C.primary, backgroundColor: '#eef6ff' },
  billChipName:     { fontSize: 14, color: C.text, fontWeight: '600' },
  billChipNameActive: { color: C.primary },
  billChipTotal:    { fontSize: 12, color: C.muted, marginTop: 3 },
  billChipTotalActive: { color: C.primary },
  addBillBtn:       { height: 52, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  addBillText:      { color: C.primary, fontSize: 14, fontWeight: '600' },
  card:             { backgroundColor: C.white, margin: 16, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardHead:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle:        { flex: 1, fontSize: 16, fontWeight: '600', color: C.text },
  deleteBillBtn:    { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: C.danger, marginLeft: 10 },
  deleteBillBtnDisabled: { borderColor: C.border },
  deleteBillText:   { color: C.danger, fontSize: 13, fontWeight: '600' },
  deleteBillTextDisabled: { color: C.muted },
  row:              { flexDirection: 'row', marginBottom: 12 },
  inputGroup:       { flex: 1 },
  label:            { fontSize: 13, color: C.muted, marginBottom: 6 },
  input:            { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, backgroundColor: C.bg },
  preview:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderTopWidth: 1, borderColor: C.border, marginBottom: 4 },
  previewLabel:     { fontSize: 14, color: C.muted },
  previewValue:     { fontSize: 20, fontWeight: '700', color: C.primary },
  btn:              { backgroundColor: C.primary, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnText:          { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnDisabled:      { opacity: 0.4 },
  listHeader:       { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
  listTitle:        { fontSize: 16, fontWeight: '600', color: C.text },
  listCount:        { fontSize: 13, color: C.muted },
  section:          { marginBottom: 12 },
  list:             { paddingHorizontal: 16 },
  emptyContainer:   { minHeight: 86, justifyContent: 'center', alignItems: 'center', backgroundColor: C.white, borderRadius: 10, marginHorizontal: 16, borderWidth: 1, borderColor: C.border },
  empty:            { color: C.muted, fontSize: 14 },
  recordCard:       { backgroundColor: C.white, borderRadius: 10, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  recordTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  recordCode:       { fontSize: 16, fontWeight: '600', color: C.text },
  deleteBtn:        { color: C.danger, fontSize: 14 },
  recordBody:       { flexDirection: 'row', marginBottom: 8 },
  recordCol:        { flex: 1 },
  recordLabel:      { fontSize: 11, color: C.muted, marginBottom: 2 },
  recordValue:      { fontSize: 15, color: C.text, fontWeight: '500' },
  recordTotal:      { color: C.primary, fontWeight: '700' },
  recordTime:       { fontSize: 11, color: '#bbb' },
  billSummaryList:  { paddingHorizontal: 16 },
  billSummaryCard:  { backgroundColor: C.white, borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billSummaryCardActive: { borderColor: C.primary, backgroundColor: '#eef6ff' },
  billSummaryName:  { fontSize: 15, fontWeight: '700', color: C.text },
  billSummaryNameActive: { color: C.primary },
  billSummaryMeta:  { fontSize: 12, color: C.muted, marginTop: 4 },
  billSummaryTotal: { fontSize: 17, fontWeight: '700', color: C.text },
  billSummaryTotalActive: { color: C.primary },
  footer:           { backgroundColor: C.white, padding: 16, paddingBottom: 32, borderTopWidth: 1, borderColor: C.border },
  sumBox:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sumLabel:         { fontSize: 15, color: C.text, fontWeight: '500' },
  sumValue:         { fontSize: 22, fontWeight: '700', color: C.primary },
  allSumValue:      { fontSize: 18, fontWeight: '700', color: C.text },
  exportBtn:        { marginTop: 0 },
};

registerRootComponent(App);
