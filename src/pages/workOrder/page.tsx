import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, Upload, ChevronLeft, ChevronRight, Globe, Edit3 } from 'lucide-react';
import { workOrderList, statusOptions } from '@/mocks/workOrderData';

const PAGE_SIZE = 10;

const tableColumns = [
  { key: 'workOrderId', label: '工单编号', width: 'w-40' },
  { key: 'businessNumber', label: '业务号码', width: 'w-32' },
  { key: 'regionName', label: '区域名称', width: 'w-24' },
  { key: 'productName', label: '产品名称', width: 'w-24' },
  { key: 'status', label: '工单状态', width: 'w-24' },
  { key: 'acceptStaff', label: '受理人员', width: 'w-28' },
  { key: 'acceptDept', label: '受理部门', width: 'w-32' },
  { key: 'responsiblePerson', label: '责任人', width: 'w-24' },
  { key: 'responsibleDept', label: '责任部门', width: 'w-32' },
  { key: 'sourceSystem', label: '来源系统', width: 'w-24' },
  { key: 'acceptTime', label: '受理时间', width: 'w-36' },
  { key: 'customerName', label: '客户姓名', width: 'w-24' },
  { key: 'contactPhone', label: '联系电话', width: 'w-28' },
  { key: 'operation', label: '操作', width: 'w-16' },
];

const statusColorMap: Record<string, string> = {
  '待分配': 'bg-secondary-100 text-secondary-800',
  '已审单': 'bg-accent-100 text-accent-800',
  '处理中': 'bg-background-200 text-foreground-800',
  '归档': 'bg-background-200 text-foreground-700',
  '已结案': 'bg-primary-100 text-primary-800',
};

export default function WorkOrderPage() {
  const navigate = useNavigate();
  const [workOrderIdFilter, setWorkOrderIdFilter] = useState('');
  const [businessNumberFilter, setBusinessNumberFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [goToPage, setGoToPage] = useState('');

  const filteredData = useMemo(() => {
    let result = [...workOrderList];
    if (workOrderIdFilter.trim()) {
      result = result.filter((item) => item.workOrderId.includes(workOrderIdFilter.trim()));
    }
    if (businessNumberFilter.trim()) {
      result = result.filter((item) => item.businessNumber.includes(businessNumberFilter.trim()));
    }
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }
    return result;
  }, [workOrderIdFilter, businessNumberFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleReset = () => {
    setWorkOrderIdFilter('');
    setBusinessNumberFilter('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setGoToPage('');
  };

  const handleBusinessNumberClick = (businessNumber: string) => {
    navigate(`/detail/${businessNumber}`);
  };

  const selectedStatusLabel = statusOptions.find((o) => o.value === statusFilter)?.label || '全部';

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full md:w-[200px] bg-primary-600 flex flex-col shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-primary-500/30">
            <Globe size={20} className="text-white shrink-0" />
            <h1 className="text-sm font-semibold text-white whitespace-nowrap">宁波智能体平台</h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-primary-700">
            <div className="w-5 h-5 flex items-center justify-center text-white">
              <i className="ri-customer-service-line text-sm"></i>
            </div>
            <span className="text-sm font-medium text-white">客服工单</span>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4">
          {/* Query Bar */}
          <div className="bg-white rounded-lg border border-background-200 p-4 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* 工单编号 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-700 whitespace-nowrap">工单编号</span>
                <input
                  type="text"
                  value={workOrderIdFilter}
                  onChange={(e) => setWorkOrderIdFilter(e.target.value)}
                  placeholder="请输入工单编号"
                  className="px-3 py-1.5 bg-background-50 border border-background-200 rounded-md text-sm text-foreground-800 w-48 focus:outline-none focus:border-primary-400"
                />
              </div>

              {/* 业务号码 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-700 whitespace-nowrap">业务号码</span>
                <input
                  type="text"
                  value={businessNumberFilter}
                  onChange={(e) => setBusinessNumberFilter(e.target.value)}
                  placeholder="请输入业务号码"
                  className="px-3 py-1.5 bg-background-50 border border-background-200 rounded-md text-sm text-foreground-800 w-48 focus:outline-none focus:border-primary-400"
                />
              </div>

              {/* 工单状态 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-700 whitespace-nowrap">工单状态</span>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-background-50 border border-background-200 rounded-md text-sm text-foreground-700 w-36 focus:outline-none focus:border-primary-400"
                  >
                    <span className="flex-1 text-left truncate">{selectedStatusLabel}</span>
                    <i className="ri-arrow-down-s-line text-foreground-400"></i>
                  </button>
                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-background-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setStatusFilter(opt.value);
                            setStatusDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-background-50 transition-colors ${
                            statusFilter === opt.value ? 'text-primary-600 font-medium' : 'text-foreground-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 查询按钮 */}
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
              >
                <Search size={14} />
                查询
              </button>

              {/* 重置按钮 */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-background-200 text-foreground-600 rounded-md text-sm font-medium hover:bg-background-50 transition-colors whitespace-nowrap"
              >
                <RotateCcw size={14} />
                重置
              </button>

              {/* 导入工单 */}
              <button
                className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary-500 text-white rounded-md text-sm font-medium hover:bg-secondary-600 transition-colors whitespace-nowrap ml-auto"
              >
                <Upload size={14} />
                导入工单
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-background-200 overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <thead>
                  <tr className="bg-background-100 border-b border-background-200">
                    {tableColumns.map((col) => (
                      <th
                        key={col.key}
                        className={`text-center text-xs font-medium text-foreground-600 px-3 py-3 whitespace-nowrap ${col.width}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-background-100 last:border-0 hover:bg-background-50/50 transition-colors"
                    >
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.workOrderId}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleBusinessNumberClick(item.businessNumber)}
                          className="text-sm text-accent-600 hover:text-accent-700 hover:underline transition-colors whitespace-nowrap cursor-pointer"
                        >
                          {item.businessNumber}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.regionName || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.productName || '-'}
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                            statusColorMap[item.status] || 'bg-background-200 text-foreground-700'
                          }`}
                        >
                          {item.status || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.acceptStaff || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.acceptDept || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.responsiblePerson || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.responsibleDept || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.sourceSystem || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-600 text-center whitespace-nowrap">
                        {item.acceptTime}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.customerName || '-'}
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground-800 text-center whitespace-nowrap">
                        {item.contactPhone || '-'}
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
                          <Edit3 size={13} />
                          <span>编辑</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan={tableColumns.length} className="text-center py-8 text-sm text-foreground-400">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-background-200">
              <div></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-500 mr-2">{PAGE_SIZE}条/页</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-background-200 text-foreground-600 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 flex items-center justify-center rounded text-sm font-medium transition-colors ${
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
                  className="w-7 h-7 flex items-center justify-center rounded border border-background-200 text-foreground-600 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-sm text-foreground-500">前往</span>
                  <input
                    type="text"
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGoToPage();
                    }}
                    className="w-10 px-1 py-1 bg-white border border-background-200 rounded text-sm text-center text-foreground-800 focus:outline-none focus:border-primary-400"
                  />
                  <span className="text-sm text-foreground-500">页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}