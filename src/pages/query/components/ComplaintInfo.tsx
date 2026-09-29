import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';

interface ComplaintItem {
  id: string;
  date: string;
  type: string;
  businessNumber: string;
  contactPhone?: string;
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

interface ComplaintInfoProps {
  data: {
    totalComplaints: number;
    resolvedComplaints: number;
    complaints: ComplaintItem[];
  };
}

const PAGE_SIZE = 10;

const filterOptions = [
  { value: 'all', label: '全部工单' },
  { value: 'province', label: '省内工单' },
  { value: 'super', label: '越级工单' },
];

const searchFieldOptions = [
  { value: 'businessNumber', label: '业务号码' },
  { value: 'contactPhone', label: '联系电话' },
];

const columns = [
  { key: 'index', label: '序号', width: 'w-12' },
  { key: 'id', label: '工单编号', width: 'w-32' },
  { key: 'businessNumber', label: '业务号码', width: 'w-28' },
  { key: 'status', label: '工单状态', width: 'w-20' },
  { key: 'acceptTime', label: '受理时间', width: 'w-36' },
  { key: 'closeTime', label: '结案时间', width: 'w-36' },
  { key: 'archiveTime', label: '归档时间', width: 'w-36' },
  { key: 'closePosition', label: '结案岗', width: 'w-40' },
  { key: 'closePerson', label: '结案人', width: 'w-20' },
  { key: 'content', label: '投诉内容', width: 'w-48' },
  { key: 'channelSource', label: '渠道来源', width: 'w-24' },
  { key: 'sceneContent', label: '投诉场景内容', width: 'w-48' },
];

export default function ComplaintInfo({ data }: ComplaintInfoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchFieldType, setSearchFieldType] = useState('businessNumber');
  const [searchFieldOpen, setSearchFieldOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    if (!data || !data.complaints) return [];

    let result = [...data.complaints];

    if (filterType !== 'all') {
      result = result.filter((item) => {
        if (filterType === 'province') return item.closePosition?.includes('省内');
        if (filterType === 'super') return item.closePosition?.includes('越级');
        return true;
      });
    }

    if (searchValue.trim()) {
      result = result.filter((item) => {
        if (searchFieldType === 'contactPhone') {
          return item.contactPhone?.includes(searchValue.trim()) || false;
        }
        return item.businessNumber.includes(searchValue.trim());
      });
    }

    if (startDate) {
      result = result.filter((item) => item.date >= startDate);
    }
    if (endDate) {
      result = result.filter((item) => item.date <= endDate);
    }

    return result;
  }, [data, filterType, searchValue, searchFieldType, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  if (!data || !data.complaints || data.complaints.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-background-100">
            <i className="ri-message-2-line text-2xl text-foreground-300"></i>
          </div>
          <p className="text-sm text-foreground-400">暂无投诉信息</p>
        </div>
      </div>
    );
  }

  const selectedLabel = filterOptions.find((o) => o.value === filterType)?.label || '全部工单';
  const selectedSearchLabel = searchFieldOptions.find((o) => o.value === searchFieldType)?.label || '业务号码';

  return (
    <div>
      {/* 查询栏 */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* 工单类型下拉 */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-background-200 rounded-lg text-sm text-foreground-700 hover:border-background-300 transition-colors"
          >
            <span>{selectedLabel}</span>
            <ChevronDown size={14} />
          </button>
          {filterOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-background-200 rounded-lg z-20 min-w-[120px]">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilterType(opt.value);
                    setFilterOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-background-50 transition-colors ${
                    filterType === opt.value ? 'text-primary-500 font-medium' : 'text-foreground-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 搜索字段类型下拉 + 输入框 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSearchFieldOpen(!searchFieldOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-background-200 rounded-lg text-sm text-foreground-700 hover:border-background-300 transition-colors"
            >
              <span>{selectedSearchLabel}</span>
              <ChevronDown size={14} />
            </button>
            {searchFieldOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-background-200 rounded-lg z-20 min-w-[120px]">
                {searchFieldOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSearchFieldType(opt.value);
                      setSearchFieldOpen(false);
                      setSearchValue('');
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-background-50 transition-colors ${
                      searchFieldType === opt.value ? 'text-primary-500 font-medium' : 'text-foreground-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="请输入"
            className="px-3 py-2 bg-white border border-background-200 rounded-lg text-sm text-foreground-700 w-32 focus:outline-none focus:border-primary-300"
          />
        </div>

        {/* 时间 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-500">时间</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-background-200 rounded-lg text-sm text-foreground-700 w-36 focus:outline-none focus:border-primary-300"
          />
          <span className="text-sm text-foreground-400">至</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-background-200 rounded-lg text-sm text-foreground-700 w-36 focus:outline-none focus:border-primary-300"
          />
        </div>

        {/* 查询按钮 */}
        <button
          onClick={() => setCurrentPage(1)}
          className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Search size={14} />
          查询
        </button>

        {/* 投诉次数 */}
        <div className="ml-auto text-sm text-foreground-600">
          投诉次数：<span className="font-medium text-primary-500">{filteredData.length}</span>
        </div>
      </div>

      {/* 投诉明细表格 */}
      <div className="bg-white rounded-lg border border-background-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-100 border-b border-background-100">
                {columns.map((col) => (
                  <th key={col.key} className={`text-left text-xs font-medium text-foreground-500 px-3 py-3 whitespace-nowrap ${col.width}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="border-b border-background-50 last:border-0 hover:bg-background-50/50 transition-colors">
                  <td className="px-3 py-3 text-sm text-foreground-600">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="px-3 py-3 text-sm text-foreground-600 whitespace-nowrap">{item.id}</td>
                  <td className="px-3 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.businessNumber}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.status === '已结案'
                        ? 'bg-primary-100 text-primary-800'
                        : item.status === '处理中'
                        ? 'bg-secondary-100 text-secondary-800'
                        : 'bg-background-200 text-foreground-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground-600 whitespace-nowrap">{item.acceptTime}</td>
                  <td className="px-3 py-3 text-sm text-foreground-600 whitespace-nowrap">{item.closeTime || '-'}</td>
                  <td className="px-3 py-3 text-sm text-foreground-600 whitespace-nowrap">{item.archiveTime || '-'}</td>
                  <td className="px-3 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.closePosition}</td>
                  <td className="px-3 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.closePerson}</td>
                  <td className="px-3 py-3 text-sm text-foreground-900 max-w-48 truncate" title={item.content}>{item.content}</td>
                  <td className="px-3 py-3 text-sm text-foreground-600 whitespace-nowrap">{item.channelSource}</td>
                  <td className="px-3 py-3 text-sm text-foreground-900 max-w-48 truncate" title={item.sceneContent}>{item.sceneContent || '-'}</td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-sm text-foreground-400">
                    暂无投诉记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-background-100">
            <div className="text-sm text-foreground-500">
              共 {filteredData.length} 条记录
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
  );
}