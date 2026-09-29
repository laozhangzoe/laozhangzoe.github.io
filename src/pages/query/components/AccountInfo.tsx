import { useMemo, useState } from 'react';
import RadarChart from '@/components/base/RadarChart';

interface OverdueItem {
  period: string;
  businessNumber: string;
  deviceType: string;
  accountCode: string;
  accountName: string;
  status: string;
  billingAmount: number;
  totalOverdue: number;
  crmAccountCode: string;
  actualOverdueAmount: number;
  writeOffPeriod: string;
  settlementStatus: string;
  writeOffStatus: string;
  badDebtFlag: string;
  localNetworkCode: string;
  writeOffTargetId: string;
}

interface OrderItem {
  id: string;
  product: string;
  businessNumber: string;
  customerName: string;
  action: string;
  acceptTime: string;
  status: string;
  detail: {
    subProducts?: { name: string; active: boolean }[];
    [key: string]: unknown;
  };
}

interface ComplaintItem {
  id: string;
  date: string;
  type: string;
  businessNumber: string;
  status: string;
  acceptTime: string;
  closeTime: string;
  archiveTime: string;
  closePosition: string;
  closePerson: string;
  content: string;
  departmentId: string;
  channelSource: string;
  sceneContent: string;
}

interface RadarInput {
  accountInfo: {
    accountName: string;
    account: string;
    representativeNumber: string;
    deliveryMethod: string;
    email: string;
    billType: string;
    region: string;
    paymentMethod: string;
    secondaryDeduction: string;
    bankName: string;
    bankAccount: string;
    accountHolder: string;
    idCard: string;
    isSubmitted: string;
    callBankInterface: string;
    refundMethod: string;
    refundAccount: string;
    refundAccountName: string;
    refundBank: string;
    accountStatus: string;
    effectiveDate: string;
    statusChangeDate: string;
    expiryDate: string;
    businessAreaId: string;
    accountRepCodeId: string;
    localNetworkId: string;
    contract97Id: string;
    crmCustomerId: string;
    operationType: string;
    statusCode: string;
    remark: string;
  };
  overdueInfo?: {
    overdueItems: OverdueItem[];
  };
  orderInfo?: {
    orders: OrderItem[];
  };
  complaintInfo?: {
    totalComplaints: number;
    resolvedComplaints: number;
    complaints: ComplaintItem[];
  };
}

interface DimensionDetail {
  label: string;
  score: number;
  desc: string;
  detailLines: { label: string; value: string }[];
}

interface ProfileData {
  labels: string[];
  values: number[];
  comprehensiveScore: number;
  tierLabel: string;
  tierClass: string;
  dimensions: DimensionDetail[];
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-accent-500';
  if (score >= 60) return 'bg-primary-500';
  if (score >= 40) return 'bg-secondary-500';
  return 'bg-foreground-400';
}

function getTierInfo(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'VIP客户', className: 'bg-accent-500 text-white' };
  if (score >= 70) return { label: '优质客户', className: 'bg-primary-500 text-white' };
  if (score >= 50) return { label: '普通客户', className: 'bg-secondary-500 text-white' };
  if (score >= 30) return { label: '关注客户', className: 'bg-foreground-700 text-white' };
  return { label: '风险客户', className: 'bg-foreground-900 text-white' };
}

export default function AccountInfo({ accountInfo, overdueInfo, orderInfo, complaintInfo }: RadarInput) {
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);

  const profileData: ProfileData = useMemo(() => {
    if (!accountInfo) {
      return {
        labels: ['网龄', '消费能力', '缴费信用', '业务活跃', '满意度', '账户健康'],
        values: [0, 0, 0, 0, 0, 0],
        comprehensiveScore: 0,
        tierLabel: '普通客户',
        tierClass: 'bg-secondary-500 text-white',
        dimensions: [],
      };
    }

    const data = accountInfo;
    const now = new Date();

    // ──────────────────────────────────────────────
    // 1. 网龄 — 基于 effectiveDate，年数 / 20 × 100，封顶 100
    // ──────────────────────────────────────────────
    const effectiveDate = data.effectiveDate ? new Date(data.effectiveDate) : null;
    const ageYears = effectiveDate
      ? Math.max(0, Math.round((now.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)))
      : 0;
    const ageScore = effectiveDate ? Math.min(100, Math.round((ageYears / 20) * 100)) : 50;
    const ageDesc = ageScore >= 80
      ? `老用户，网龄超${ageYears}年，客户稳定性极高`
      : ageScore >= 60
        ? `网龄${ageYears}年，属于稳定型客户`
        : ageScore >= 40
          ? `网龄约${ageYears}年，客户关系尚在建立中`
          : '新入网用户，客户生命周期较短';
    const ageDetailLines = [
      { label: '开通日期', value: data.effectiveDate || '—' },
      { label: '网龄', value: `${ageYears}年` },
      { label: '计分公式', value: `min(100, ${ageYears}/20 × 100) = ${ageScore}` },
    ];

    // ──────────────────────────────────────────────
    // 2. 消费能力 — 多源综合评估
    //    主: 欠费账单月均消费金额
    //    辅: 可选套餐档位推断（如"5G套餐128元档"）
    //    辅: 付款方式（代扣=稳定客户，+8分）
    //    辅: 活跃子产品数量（+2分/个，上限10分）
    //    无数据时基础分 50（而非 30，避免误伤无欠费优质客户）
    // ──────────────────────────────────────────────
    const overdueItems = overdueInfo?.overdueItems ?? [];
    const billingAmounts = overdueItems.map((item) => item.billingAmount);
    const avgBilling = billingAmounts.length > 0
      ? Math.round(billingAmounts.reduce((a, b) => a + b, 0) / billingAmounts.length)
      : 0;
    // 尝试从可选套餐中推断消费档位
    let planInferredTier = 0;
    if (orderInfo?.orders) {
      for (const o of orderInfo.orders) {
        const pkgs = o.detail?.optionalPackages || [];
        for (const pkg of pkgs) {
          const match = (pkg.name || '').match(/(\d+)元/);
          if (match) {
            planInferredTier = Math.max(planInferredTier, parseInt(match[1], 10));
          }
        }
      }
    }
    const inferredMonthly = Math.max(avgBilling, planInferredTier);
    let consumptionBaseScore = 50;
    if (inferredMonthly >= 5000) consumptionBaseScore = 100;
    else if (inferredMonthly >= 1000) consumptionBaseScore = 85;
    else if (inferredMonthly >= 500) consumptionBaseScore = 75;
    else if (inferredMonthly >= 200) consumptionBaseScore = 65;
    else if (inferredMonthly >= 100) consumptionBaseScore = 55;
    else if (inferredMonthly >= 50) consumptionBaseScore = 45;
    // 代扣 +8 分
    if (data.paymentMethod === '代扣') consumptionBaseScore += 8;
    // 活跃子产品加分 (从最近一笔订单取)
    let activeSubCount = 0;
    if (orderInfo?.orders?.length) {
      const latest = orderInfo.orders[0];
      const subs = latest.detail?.subProducts || [];
      activeSubCount = subs.filter((s) => s.active).length;
    }
    consumptionBaseScore += Math.min(10, activeSubCount * 2);
    const consumptionScore = Math.max(20, Math.min(100, consumptionBaseScore));
    const consumptionDesc = consumptionScore >= 80
      ? `高消费层级${inferredMonthly > 0 ? `，月均约¥${inferredMonthly}` : ''}`
      : consumptionScore >= 60
        ? `中等偏上消费${inferredMonthly > 0 ? `，月均约¥${inferredMonthly}` : ''}`
        : consumptionScore >= 40
          ? `中等消费水平${inferredMonthly > 0 ? `，月均约¥${inferredMonthly}` : ''}`
          : '消费偏低';
    const recentBills = overdueItems.slice(0, 3).map((item) => ({
      period: item.period,
      amount: item.billingAmount,
    }));
    const consumptionDetailLines: { label: string; value: string }[] = [
      ...(recentBills.length > 0
        ? recentBills.map((b, i) => ({ label: `近${i + 1}月账单(${b.period})`, value: `¥${b.amount}` }))
        : [{ label: '欠费账单', value: '无数据' }]),
      { label: '账单月均', value: avgBilling > 0 ? `¥${avgBilling}` : '—' },
      { label: '套餐推断档位', value: planInferredTier > 0 ? `¥${planInferredTier}档` : '未推断出' },
      { label: '综合月均', value: inferredMonthly > 0 ? `¥${inferredMonthly}` : '—' },
      { label: '付款方式加成', value: data.paymentMethod === '代扣' ? '代扣 +8分' : '无加成' },
      { label: '活跃子产品加成', value: `${activeSubCount}个 +${Math.min(10, activeSubCount * 2)}分` },
      { label: '最终得分', value: `${consumptionScore}分 (基础分+加成)` },
    ];

    // ──────────────────────────────────────────────
    // 3. 缴费信用 — 累进扣分制
    //    基础 100 分，根据欠费严重度逐项扣分
    //    - 欠费率 (actualOverdue / billingAmount) 越高扣越多
    //    - 每笔未结清 -3
    //    - 坏账标记 -25 (重大风险)
    //    - 催缴中每笔 -4
    //    - 全部结清 +10
    // ──────────────────────────────────────────────
    let creditScore = 100;
    const totalActualOverdue = overdueItems.reduce((sum, item) => sum + item.actualOverdueAmount, 0);
    const totalBilling = overdueItems.reduce((sum, item) => sum + item.billingAmount, 0);
    const delinquencyRate = totalBilling > 0 ? totalActualOverdue / totalBilling : 0;
    const unsettledCount = overdueItems.filter((i) => i.settlementStatus !== '已结清').length;
    const hasBadDebt = overdueItems.some((i) => i.badDebtFlag === '是');
    const dunningCount = overdueItems.filter((i) => i.writeOffStatus === '催缴中').length;
    const allSettled = overdueItems.length > 0 && overdueItems.every((i) => i.settlementStatus === '已结清');

    if (overdueItems.length > 0) {
      // 欠费率扣分
      if (delinquencyRate >= 1) creditScore -= 35;
      else if (delinquencyRate >= 0.5) creditScore -= 25;
      else if (delinquencyRate >= 0.2) creditScore -= 15;
      else if (delinquencyRate > 0) creditScore -= 5;
      // 未结清数量扣分
      creditScore -= unsettledCount * 3;
      // 坏账标记
      if (hasBadDebt) creditScore -= 25;
      // 催缴中
      creditScore -= dunningCount * 4;
      // 全部结清加分
      if (allSettled) creditScore += 10;
    }
    creditScore = Math.max(15, Math.min(100, creditScore));
    const totalOverdueVal = overdueItems.reduce((sum, item) => sum + item.totalOverdue, 0);

    const creditDesc = creditScore >= 85
      ? '信用优异，缴费记录良好'
      : creditScore >= 65
        ? '信用良好，少量欠费'
        : creditScore >= 45
          ? `信用一般，累计欠费¥${totalOverdueVal}`
          : hasBadDebt
            ? `信用风险，存在坏账，累计欠费¥${totalOverdueVal}`
            : `信用风险，累计欠费¥${totalOverdueVal}`;
    const creditDetailLines = [
      { label: '累计出帐金额', value: `¥${totalBilling}` },
      { label: '实际欠费金额', value: `¥${totalActualOverdue}` },
      { label: '欠费率', value: `${Math.round(delinquencyRate * 100)}%` },
      { label: '未结清笔数', value: `${unsettledCount}笔 (每笔-3分)` },
      { label: '坏账标记', value: hasBadDebt ? '是 (-25分)' : '否' },
      { label: '催缴中笔数', value: `${dunningCount}笔 (每笔-4分)` },
      { label: '全部结清加成', value: allSettled ? '+10分' : '无' },
      { label: '基础分 → 最终', value: `100 → ${creditScore}` },
    ];

    // ──────────────────────────────────────────────
    // 4. 业务活跃度 — 订单频次+多样性+近因+子产品
    //    基础 25 分
    //    + 近一年订单数 × 6 (上限 40)
    //    + 操作多样性: 不同 action 类型数 × 5 (上限 20)
    //    + 渠道多样性: 不同 acceptChannel 数 × 3 (上限 10)
    //    + 最近 30 天有操作: +8
    //    - 存在停机保号操作: -10 (流失风险)
    // ──────────────────────────────────────────────
    let activityScore = 25;
    const orders = orderInfo?.orders ?? [];
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const recentOrders = orders.filter((o) => new Date(o.acceptTime) >= oneYearAgo);
    const recentOrderCount = recentOrders.length;

    const actionTypes = new Set(orders.map((o) => o.action));
    const channelTypes = new Set(
      orders.map((o) => (o.detail as Record<string, unknown>)?.acceptChannel || '').filter(Boolean),
    );
    const hasRecentActivity = recentOrders.some(
      (o) => (now.getTime() - new Date(o.acceptTime).getTime()) / (1000 * 60 * 60 * 24) <= 30,
    );
    const hasSuspendAction = orders.some((o) => o.action === '停机保号');

    activityScore += Math.min(40, recentOrderCount * 6);
    activityScore += Math.min(20, actionTypes.size * 5);
    activityScore += Math.min(10, channelTypes.size * 3);
    if (hasRecentActivity) activityScore += 8;
    if (hasSuspendAction) activityScore -= 10;

    let activeSubAvg = 0;
    if (orders.length > 0) {
      const totalActive = orders.reduce((sum, o) => {
        const subs = o.detail?.subProducts || [];
        return sum + subs.filter((s) => s.active).length;
      }, 0);
      activeSubAvg = parseFloat((totalActive / orders.length).toFixed(1));
    }
    activityScore = Math.max(10, Math.min(100, activityScore));
    const totalOrderCount = orders.length;

    const activityDesc = activityScore >= 80
      ? `业务高度活跃，近一年${recentOrderCount}笔订单`
      : activityScore >= 60
        ? `较为活跃，近一年${recentOrderCount}笔订单`
        : activityScore >= 40
          ? `活跃度一般，近一年${recentOrderCount}笔订单`
          : '活跃度低，交易频率偏低';
    const orderCountBonus = Math.min(40, recentOrderCount * 6);
    const actionDiversityBonus = Math.min(20, actionTypes.size * 5);
    const channelDiversityBonus = Math.min(10, channelTypes.size * 3);
    const activityDetailLines = [
      { label: '近一年订单数', value: `${recentOrderCount}笔 (+${orderCountBonus})` },
      { label: '操作类型多样性', value: `${actionTypes.size}种 (+${actionDiversityBonus})` },
      { label: '受理渠道多样性', value: `${channelTypes.size}种 (+${channelDiversityBonus})` },
      { label: '近30天有操作', value: hasRecentActivity ? '是 (+8分)' : '否' },
      { label: '停机保号扣分', value: hasSuspendAction ? '是 (-10分)' : '无' },
      { label: '平均活跃子产品', value: `${activeSubAvg}个/单` },
      { label: '历史总订单', value: `${totalOrderCount}笔` },
      { label: '计分公式', value: `25 + ${orderCountBonus} + ${actionDiversityBonus} + ${channelDiversityBonus}${hasRecentActivity ? ' + 8' : ''}${hasSuspendAction ? ' - 10' : ''} = ${activityScore}` },
    ];

    // ──────────────────────────────────────────────
    // 5. 满意度 — 渠道严重度分级扣分 + 处理速度 + 类型加权
    //    基础 100 分
    //    按投诉渠道严重度扣分: 工信部 -12, 集团网络投诉 -8, 10000热线 -5, 电话 -3
    //    服务投诉类额外 -2
    //    未结投诉(处理中)额外 -5
    //    平均结案速度 < 3天 +5, < 7天 +3
    //    解决率 > 80% +5
    // ──────────────────────────────────────────────
    let satisfactionScore = 100;
    const complaints = complaintInfo?.complaints ?? [];
    const channelPenaltyMap: Record<string, number> = {
      '工信部': 12,
      '集团网络投诉': 8,
      '10000热线': 5,
      '电话形式': 3,
    };
    let totalPenalty = 0;
    let servicePenalty = 0;
    let openPenalty = 0;
    for (const c of complaints) {
      totalPenalty += channelPenaltyMap[c.channelSource] || 4;
      if (c.type === '服务投诉') servicePenalty += 2;
      if (c.status === '处理中') openPenalty += 5;
    }
    satisfactionScore -= Math.min(60, totalPenalty);
    satisfactionScore -= servicePenalty;
    satisfactionScore -= openPenalty;

    // 平均结案速度
    let avgCloseDays = 0;
    const closedComplaints = complaints.filter((c) => c.closeTime);
    if (closedComplaints.length > 0) {
      const totalDays = closedComplaints.reduce((sum, c) => {
        const days = (new Date(c.closeTime).getTime() - new Date(c.acceptTime).getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      avgCloseDays = Math.round((totalDays / closedComplaints.length) * 10) / 10;
      if (avgCloseDays <= 3) satisfactionScore += 5;
      else if (avgCloseDays <= 7) satisfactionScore += 3;
    }

    // 解决率 > 80%
    const totalComp = complaints.length;
    const resolvedComp = complaints.filter((c) => c.status === '已结案' || c.status === '归档').length;
    const resolveRate = totalComp > 0 ? resolvedComp / totalComp : 1;
    if (resolveRate > 0.8) satisfactionScore += 5;

    satisfactionScore = Math.max(15, Math.min(100, satisfactionScore));

    const satisfactionDesc = satisfactionScore >= 85
      ? totalComp === 0 ? '满意度高，无投诉记录' : `满意度高，${totalComp}笔投诉处理良好`
      : satisfactionScore >= 65
        ? '基本满意，投诉处理情况尚可'
        : satisfactionScore >= 45
          ? `满意度一般，${complaints.filter((c) => c.status === '处理中').length}笔投诉待处理`
          : '满意度低，投诉处理有待改进';
    const satisfactionDetailLines = [
      { label: '投诉总数', value: `${totalComp}笔` },
      { label: '渠道扣分合计', value: `-${totalPenalty}分` },
      { label: '服务类投诉额外', value: servicePenalty > 0 ? `-${servicePenalty}分` : '无' },
      { label: '处理中投诉扣分', value: openPenalty > 0 ? `-${openPenalty}分` : '无' },
      { label: '平均结案天数', value: avgCloseDays > 0 ? `${avgCloseDays}天` : '—' },
      { label: '结案速度加分', value: avgCloseDays <= 3 ? '+5分' : avgCloseDays <= 7 ? '+3分' : '无' },
      { label: '解决率', value: `${Math.round(resolveRate * 100)}%` },
      { label: '解决率加分', value: resolveRate > 0.8 ? '+5分' : '无' },
      { label: '基础分 → 最终', value: `100 → ${satisfactionScore}` },
    ];

    // ──────────────────────────────────────────────
    // 6. 账户健康 — 状态 + 信息完整度 + 运营指标 + 风险指标
    //    基础 60 分
    //    账户状态: 有效 +25, 停机 -30, 无效 -40
    //    信息完整度 (共15): 邮箱+3, 银行+3, 身份证+3, 已提交+3, 退款方式+3
    //    运营指标: 银行接口可用+5, 二次托扣+3, 状态码正常+5
    //    风险指标: 即将到期(<3月) -15, 未结清欠费每笔 -4, 处理中投诉每笔 -3, 过户操作 -5
    // ──────────────────────────────────────────────
    let healthScore = 60;
    // 账户状态
    let statusText = '';
    if (data.accountStatus === '有效') { healthScore += 25; statusText = '有效 (+25)'; }
    else if (data.accountStatus === '停机') { healthScore -= 30; statusText = '停机 (-30)'; }
    else if (data.accountStatus === '无效') { healthScore -= 40; statusText = '无效 (-40)'; }
    else { statusText = `${data.accountStatus} (+0)`; }

    // 信息完整度
    let infoCompleteness = 0;
    const emailFilled = !!(data.email && data.email.trim());
    const bankFilled = !!(data.bankName && data.bankName.trim() && data.bankName !== '-');
    const idFilled = !!(data.idCard && data.idCard.trim());
    const isSubmitted = data.isSubmitted === '是';
    const refundSet = !!(data.refundMethod && data.refundMethod !== '-');
    if (emailFilled) { infoCompleteness += 3; }
    if (bankFilled) { infoCompleteness += 3; }
    if (idFilled) { infoCompleteness += 3; }
    if (isSubmitted) { infoCompleteness += 3; }
    if (refundSet) { infoCompleteness += 3; }
    healthScore += infoCompleteness;

    // 运营指标
    let opsBonus = 0;
    if (data.callBankInterface === '是') opsBonus += 5;
    if (data.secondaryDeduction === '是') opsBonus += 3;
    if (data.statusCode === '0') opsBonus += 5;
    healthScore += opsBonus;

    // 风险指标扣分
    let riskPenalty = 0;
    const riskDetails: string[] = [];
    // 即将到期
    if (data.expiryDate) {
      const expiry = new Date(data.expiryDate);
      const monthsToExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
      if (monthsToExpiry <= 3 && monthsToExpiry > 0) { riskPenalty += 15; riskDetails.push('即将到期(-15)'); }
      else if (monthsToExpiry <= 0) { riskPenalty += 20; riskDetails.push('已过期(-20)'); }
    }
    // 未结清欠费
    if (unsettledCount > 0) { riskPenalty += unsettledCount * 4; riskDetails.push(`未结清欠费×${unsettledCount}(-${unsettledCount * 4})`); }
    // 处理中投诉
    const openComplaints = complaints.filter((c) => c.status === '处理中').length;
    if (openComplaints > 0) { riskPenalty += openComplaints * 3; riskDetails.push(`处理中投诉×${openComplaints}(-${openComplaints * 3})`); }
    // 过户
    if (data.operationType === '过户') { riskPenalty += 5; riskDetails.push('过户操作(-5)'); }
    healthScore -= riskPenalty;

    healthScore = Math.max(5, Math.min(100, healthScore));

    const healthDesc = healthScore >= 80
      ? '账户健康，运行正常'
      : healthScore >= 60
        ? '基本正常，少量关注项'
        : healthScore >= 40
          ? data.accountStatus === '无效' || data.accountStatus === '停机'
            ? '需关注，账户状态异常'
            : '需关注，存在风险指标'
          : '账户异常，建议重点跟进';
    const healthDetailLines = [
      { label: '账户状态', value: statusText },
      { label: '信息完整度', value: `${infoCompleteness}/15` },
      { label: '  └ 邮箱', value: emailFilled ? '✓ +3' : '✗ 0' },
      { label: '  └ 银行信息', value: bankFilled ? '✓ +3' : '✗ 0' },
      { label: '  └ 身份证', value: idFilled ? '✓ +3' : '✗ 0' },
      { label: '  └ 资料已提交', value: isSubmitted ? '✓ +3' : '✗ 0' },
      { label: '  └ 退款方式', value: refundSet ? '✓ +3' : '✗ 0' },
      { label: '运营指标', value: `+${opsBonus}` },
      { label: '  └ 银行接口', value: data.callBankInterface === '是' ? '可用 +5' : '不可用 0' },
      { label: '  └ 二次托扣', value: data.secondaryDeduction === '是' ? '已启用 +3' : '未启用 0' },
      { label: '  └ 状态码', value: data.statusCode === '0' ? '正常 +5' : `异常(${data.statusCode}) 0` },
      { label: '风险扣分', value: riskPenalty > 0 ? `-${riskPenalty}` + (riskDetails.length > 0 ? ` ${riskDetails.join('; ')}` : '') : '无' },
      { label: '计分公式', value: `60${statusText.startsWith('有效') ? '+25' : statusText.includes('-') ? statusText.slice(statusText.indexOf('(')) : ''} +${infoCompleteness}(完整度) +${opsBonus}(运营) -${riskPenalty}(风险) = ${healthScore}` },
    ];

    const labels = ['网龄', '消费能力', '缴费信用', '业务活跃', '满意度', '账户健康'];
    const values = [ageScore, consumptionScore, creditScore, activityScore, satisfactionScore, healthScore];
    const comprehensiveScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const tier = getTierInfo(comprehensiveScore);

    return {
      labels,
      values,
      comprehensiveScore,
      tierLabel: tier.label,
      tierClass: tier.className,
      dimensions: [
        { label: '网龄', score: ageScore, desc: ageDesc, detailLines: ageDetailLines },
        { label: '消费能力', score: consumptionScore, desc: consumptionDesc, detailLines: consumptionDetailLines },
        { label: '缴费信用', score: creditScore, desc: creditDesc, detailLines: creditDetailLines },
        { label: '业务活跃', score: activityScore, desc: activityDesc, detailLines: activityDetailLines },
        { label: '满意度', score: satisfactionScore, desc: satisfactionDesc, detailLines: satisfactionDetailLines },
        { label: '账户健康', score: healthScore, desc: healthDesc, detailLines: healthDetailLines },
      ],
    };
  }, [accountInfo, overdueInfo, orderInfo, complaintInfo]);

  if (!accountInfo) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-background-100">
            <i className="ri-user-search-line text-2xl text-foreground-300"></i>
          </div>
          <p className="text-sm text-foreground-400">暂无账户信息</p>
        </div>
      </div>
    );
  }

  const data = accountInfo;

  const infoItems = [
    { label: '帐户名称', value: data.accountName },
    { label: '帐户状态', value: data.accountStatus, status: true },
    { label: '代表号码', value: data.representativeNumber },
    { label: '生效时间', value: data.effectiveDate },
    { label: '失效时间', value: data.expiryDate },
    { label: '投递方式', value: data.deliveryMethod },
    { label: '所属区域', value: data.region },
    { label: '二次托扣', value: data.secondaryDeduction, checkbox: true },
    { label: '付费方式', value: data.paymentMethod },
    { label: '营业区标识', value: data.businessAreaId },
    { label: '帐户代表码实例标识', value: data.accountRepCodeId },
    { label: '本地网标识', value: data.localNetworkId },
    { label: '97合同号标识', value: data.contract97Id },
    { label: 'CRM客户唯一标志编码', value: data.crmCustomerId },
    { label: '操作类型', value: data.operationType },
    { label: '状态码', value: data.statusCode },
    { label: '备注', value: data.remark },
  ];

  const getStatusColor = (status: string) => {
    if (status === '有效') return 'bg-primary-100 text-primary-800 border-primary-200';
    if (status === '无效' || status === '停机') return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    return 'bg-background-100 text-foreground-700 border-background-200';
  };

  return (
    <div>
      {/* 用户价值雷达图 */}
      <div className="mb-6 bg-white border border-background-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-accent-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-foreground-900">用户价值画像</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Radar Chart */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <RadarChart
              labels={profileData.labels}
              values={profileData.values}
              size={280}
              color="accent"
            />
            <div className="mt-2 flex items-center gap-4 text-xs text-foreground-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500/50 border border-accent-500"></div>
                <span>当前画像</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border border-foreground-300/40"></div>
                <span>参考基线</span>
              </div>
            </div>
          </div>

          {/* Right: Score & Dimensions */}
          <div className="flex-1 min-w-0">
            {/* Dimension List */}
            <div className="space-y-3">
              {profileData.dimensions.map((dim) => (
                <div
                  key={dim.label}
                  className="relative"
                  onMouseEnter={() => setHoveredDim(dim.label)}
                  onMouseLeave={() => setHoveredDim(null)}
                >
                  <div className="flex items-center gap-3 group cursor-default">
                    <span className="w-16 text-sm font-medium text-foreground-700 whitespace-nowrap group-hover:text-foreground-900 transition-colors">{dim.label}</span>
                    <span className="w-7 text-sm font-bold text-foreground-800 text-right">{dim.score}</span>
                    <div className="flex-1 h-2 bg-background-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(dim.score)}`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-foreground-500 hidden lg:block w-40 truncate">{dim.desc}</span>
                    <div className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-information-line text-xs text-foreground-400"></i>
                    </div>
                  </div>

                  {/* Hover Tooltip */}
                  {hoveredDim === dim.label && (
                    <div className="absolute top-full left-0 mt-2 z-50 w-72">
                      <div className="bg-foreground-900 text-white rounded-lg px-4 py-3 shadow-lg">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/15">
                          <div className={`w-2 h-2 rounded-full ${getScoreBarColor(dim.score)}`}></div>
                          <span className="text-sm font-semibold">{dim.label} · 计算详情</span>
                          <span className="ml-auto text-xs text-white/60">{dim.score}分</span>
                        </div>
                        <div className="space-y-1.5">
                          {dim.detailLines.map((line, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-white/60">{line.label}</span>
                              <span className="text-white font-medium ml-3 text-right">{line.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Arrow pointing up */}
                      <div className="absolute left-6 -top-1.5 w-3 h-3 bg-foreground-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-4 pt-3 border-t border-background-100">
              <p className="text-xs text-foreground-400">
                <i className="ri-information-line mr-1"></i>
                本画像基于账户近12个月的欠费、订单、投诉及账户状态数据综合评估生成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 账户详细信息 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-primary-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-foreground-900">账户详细信息</h3>
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-baseline gap-2 ${
                item.checkbox ? 'bg-accent-50/60 -mx-2 px-2 py-1 rounded-md' : ''
              }`}
            >
              <span
                className={`text-sm whitespace-nowrap shrink-0 ${
                  item.checkbox ? 'text-accent-700 font-semibold' : 'text-foreground-500'
                }`}
              >
                {item.label}
              </span>
              {item.checkbox ? (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs ${
                  item.value === '是'
                    ? 'bg-primary-500 text-white'
                    : 'border-2 border-foreground-300 bg-white'
                }`}>
                  {item.value === '是' && <i className="ri-check-line"></i>}
                </span>
              ) : item.status ? (
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(item.value)}`}>
                  {item.value}
                </span>
              ) : (
                <span className="text-sm text-foreground-900 whitespace-nowrap">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}