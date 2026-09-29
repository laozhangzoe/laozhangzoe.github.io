import { useState, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OrderDetailSections, {
  type CustomerInfoFields,
  type MainProductFields,
  type SubProductItem,
  type OrderHeaderFields,
  type OrderLineItem,
} from './OrderDetailSections';

interface OrderDetail {
  orderId: string;
  product: string;
  businessNumber: string;
  customerName: string;
  action: string;
  acceptTime: string;
  status: string;
  acceptChannel?: string;
  acceptStaff?: string;
  remark?: string;

  // New sectioned fields
  customerInfo?: CustomerInfoFields;
  mainProduct?: MainProductFields;
  subProductsNew?: SubProductItem[];
  orderHeader?: OrderHeaderFields;
  orderLines?: OrderLineItem[];

  // Legacy — kept for backward compat
  subProducts?: { name: string; active: boolean }[];
  optionalPackages?: { name: string; period: string }[];
  [key: string]: unknown;
}

interface PaperlessInfo {
  customerOrderNo?: string;
  fileName?: string;
  fileNo?: string;
  businessNumber?: string;
  orderName?: string;
  operationType?: string;
  statusCode?: string;
  fileType?: string;
  fileSize?: string;
  createTime?: string;
  statusTime?: string;
  updateTime?: string;
  orderSource?: string;
  orderType?: string;
  businessType?: string;
  locationName?: string;
  activeFlag?: string;
  needWatermark?: string;
  serialNo?: string;
  photoType?: string;
}

interface IdCardFtpRecord {
  idNumber?: string;
  path?: string;
  statusCode?: string;
  effectiveTime?: string;
  expiryTime?: string;
  createDate?: string;
  operationType?: string;
}

interface DocPhotoRecord {
  docNumber?: string;
  propertyCustomerDocNumber?: string;
  docType?: string;
  relatedOrderNo?: string;
  businessNumber?: string;
  photoName?: string;
  photoPath?: string;
  staffNo?: string;
  businessAreaId?: string;
  teamId?: string;
  faceSimilarity?: string;
  recordStatus?: string;
  source?: string;
  isNewClientPhoto?: string;
  needPatchWatermark?: string;
}

interface OrderItem {
  id: string;
  product: string;
  businessNumber: string;
  customerName: string;
  action: string;
  acceptTime: string;
  status: string;
  detail: OrderDetail;
  paperless: PaperlessInfo;
  idCardFtpRecords: IdCardFtpRecord[];
  docPhotoRecords: DocPhotoRecord[];
}

export interface OrderDetailExtraTab {
  key: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

export interface OrderInfoProps {
  data: {
    orders: OrderItem[];
  };
  /** 订单详情里额外的 tab（如 无纸化信息 / 读卡拍照记录） */
  extraTabs?: OrderDetailExtraTab[];
}

const PAGE_SIZE = 10;

const columns = [
  { key: 'id', label: '订单编号' },
  { key: 'product', label: '产品' },
  { key: 'businessNumber', label: '业务号码' },
  { key: 'customerName', label: '客户名称' },
  { key: 'action', label: '行为' },
  { key: 'acceptTime', label: '受理时间' },
  { key: 'status', label: '状态' },
];

function OrderDetailPanel({
  order,
  onBack,
  extraTabs,
}: {
  order: OrderItem;
  onBack: () => void;
  extraTabs?: OrderDetailExtraTab[];
}) {
  const [activeTab, setActiveTab] = useState('detail');

  const tabs = [
    { key: 'detail', label: '订单详情', icon: undefined as ReactNode },
    ...(extraTabs || []).map((t) => ({ key: t.key, label: t.label, icon: t.icon })),
  ];
  const hasExtraTabs = (extraTabs?.length ?? 0) > 0;
  const activeExtra = extraTabs?.find((t) => t.key === activeTab);
  const activeLabel = tabs.find((t) => t.key === activeTab)?.label || '订单详情';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-arrow-left-line"></i>
          订单信息
        </button>
        <i className="ri-arrow-right-s-line text-foreground-300"></i>
        <span className="text-foreground-500 whitespace-nowrap">{activeLabel}</span>
        <i className="ri-arrow-right-s-line text-foreground-300"></i>
        <span className="text-foreground-900 font-medium">{order.id}</span>
      </div>

      {/* Tabs */}
      {hasExtraTabs && (
        <div className="flex gap-1 border-b border-background-100 mb-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.key ? 'text-primary-600' : 'text-foreground-500 hover:text-foreground-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'detail' ? (
          <OrderDetailSections
            customerInfo={order.detail.customerInfo}
            mainProduct={order.detail.mainProduct}
            subProducts={order.detail.subProductsNew || order.detail.subProducts}
            orderHeader={order.detail.orderHeader}
            orderLines={order.detail.orderLines}
          />
        ) : (
          activeExtra?.content || null
        )}
      </div>
    </div>
  );
}

export default function OrderInfo({ data, extraTabs }: OrderInfoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const totalPages = data?.orders ? Math.ceil(data.orders.length / PAGE_SIZE) : 0;
  const currentData = useMemo(() => {
    if (!data?.orders) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.orders.slice(start, start + PAGE_SIZE);
  }, [data?.orders, currentPage]);

  if (!data || !data.orders || data.orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-background-100">
            <i className="ri-file-list-3-line text-2xl text-foreground-300"></i>
          </div>
          <p className="text-sm text-foreground-400">暂无订单信息</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return <OrderDetailPanel order={selectedOrder} onBack={() => setSelectedOrder(null)} extraTabs={extraTabs} />;
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-background-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-100 border-b border-background-100">
                {columns.map((col) => (
                  <th key={col.key} className="text-left text-xs font-medium text-foreground-500 px-4 py-3 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="border-b border-background-50 last:border-0 hover:bg-background-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(item)}
                      className="text-sm font-medium text-primary-500 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                    >
                      {item.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.product}</td>
                  <td className="px-4 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.businessNumber}</td>
                  <td className="px-4 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.customerName}</td>
                  <td className="px-4 py-3 text-sm text-foreground-900 whitespace-nowrap">{item.action}</td>
                  <td className="px-4 py-3 text-sm text-foreground-600 whitespace-nowrap">{item.acceptTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-background-200 text-foreground-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-background-100">
            <div className="text-sm text-foreground-500">
              共 {data.orders.length} 条记录
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-background-200 text-foreground-600 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-background-200 text-foreground-600 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}