import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface OverdueInfoProps {
  data: {
    overdueItems: OverdueItem[];
  };
}

const PAGE_SIZE = 10;

const columns = [
  { key: 'period', label: '账期' },
  { key: 'businessNumber', label: '业务号码' },
  { key: 'deviceType', label: '设备类型' },
  { key: 'accountCode', label: '帐目编码' },
  { key: 'accountName', label: '帐目类型名称' },
  { key: 'status', label: '状态' },
  { key: 'billingAmount', label: '出帐金额(元)' },
  { key: 'totalOverdue', label: '总欠费金额(元)' },
  { key: 'crmAccountCode', label: 'CRM系统帐户编码' },
  { key: 'actualOverdueAmount', label: '帐目实际欠费金额' },
  { key: 'writeOffPeriod', label: '销账系统帐目欠费账期' },
  { key: 'settlementStatus', label: '结清状态' },
  { key: 'writeOffStatus', label: '销账系统帐目状态' },
  { key: 'badDebtFlag', label: '坏账标识' },
  { key: 'localNetworkCode', label: '本地网编码' },
  { key: 'writeOffTargetId', label: '销账系统唯一帐目目标标识' },
];

export default function OverdueInfo({ data }: OverdueInfoProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = data?.overdueItems ? Math.ceil(data.overdueItems.length / PAGE_SIZE) : 0;
  const currentData = useMemo(() => {
    if (!data?.overdueItems) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.overdueItems.slice(start, start + PAGE_SIZE);
  }, [data?.overdueItems, currentPage]);

  const totals = useMemo(() => {
    if (!data?.overdueItems) return { billingAmount: 0, totalOverdue: 0, actualOverdueAmount: 0 };
    const items = data.overdueItems;
    return {
      billingAmount: items.reduce((sum, item) => sum + item.billingAmount, 0),
      totalOverdue: items.reduce((sum, item) => sum + item.totalOverdue, 0),
      actualOverdueAmount: items.reduce((sum, item) => sum + item.actualOverdueAmount, 0),
    };
  }, [data?.overdueItems]);

  if (!data || !data.overdueItems || data.overdueItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-background-100">
            <i className="ri-bill-line text-2xl text-foreground-300"></i>
          </div>
          <p className="text-sm text-foreground-400">暂无欠费信息</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="bg-white rounded-lg border border-background-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1600px]">
              <thead>
                <tr className="bg-background-100 border-b border-background-100">
                  {columns.map((col) => (
                    <th key={col.key} className="text-center text-xs font-medium text-foreground-500 px-3 py-3 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => {
                  const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
                  return (
                    <tr key={globalIndex} className="border-b border-background-50 last:border-0">
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.period}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.businessNumber}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.deviceType}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.accountCode}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.accountName}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.status === '未销帐' ? 'bg-secondary-100 text-secondary-800' : 'bg-background-200 text-foreground-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-foreground-900 text-center whitespace-nowrap">{item.billingAmount.toFixed(2)}</td>
                      <td className="px-3 py-3 text-sm font-medium text-primary-600 text-center whitespace-nowrap">{item.totalOverdue.toFixed(2)}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.crmAccountCode}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.actualOverdueAmount.toFixed(2)}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.writeOffPeriod}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.settlementStatus === '已结清' ? 'bg-primary-100 text-primary-800' :
                          item.settlementStatus === '部分结清' ? 'bg-accent-100 text-accent-800' :
                          'bg-secondary-100 text-secondary-800'
                        }`}>
                          {item.settlementStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.writeOffStatus}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.badDebtFlag === '是' ? 'bg-secondary-100 text-secondary-800' : 'bg-background-200 text-foreground-700'
                        }`}>
                          {item.badDebtFlag}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.localNetworkCode}</td>
                      <td className="px-3 py-3 text-sm text-foreground-900 text-center whitespace-nowrap">{item.writeOffTargetId}</td>
                    </tr>
                  );
                })}
                {/* 累计金额行 */}
                <tr className="bg-primary-50/80 border-t border-primary-100">
                  <td className="px-3 py-3 text-sm font-medium text-foreground-900 text-center" colSpan={6}>
                    累计金额：
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-primary-600 text-center whitespace-nowrap">{totals.billingAmount.toFixed(2)}</td>
                  <td className="px-3 py-3 text-sm font-medium text-primary-600 text-center whitespace-nowrap">{totals.totalOverdue.toFixed(2)}</td>
                  <td className="px-3 py-3 text-sm font-medium text-foreground-400 text-center whitespace-nowrap">-</td>
                  <td className="px-3 py-3 text-sm font-medium text-primary-600 text-center whitespace-nowrap">{totals.actualOverdueAmount.toFixed(2)}</td>
                  <td colSpan={6} className="px-3 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 分页 */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-background-100">
              <div className="text-sm text-foreground-500">
                共 {data.overdueItems.length} 条记录
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-background-200 text-foreground-600 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'border border-background-200 text-foreground-600 hover:bg-background-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-background-200 text-foreground-600 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}