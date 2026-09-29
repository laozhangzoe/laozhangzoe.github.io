import { X, Shield, Camera } from 'lucide-react';
import OrderInfo, { type OrderInfoProps, type OrderDetailExtraTab } from '@/pages/query/components/OrderInfo';
import PaperlessInfoPanel from './PaperlessInfoPanel';
import CardPhotoRecordsPanel from './CardPhotoRecordsPanel';
import type {
  SalesProduct,
  PaperlessDocument,
  CardReadRecord,
  PhotoRecord,
} from '@/mocks/workOrderInfoData';

interface SalesProductDetailModalProps {
  product: SalesProduct;
  paperlessDocuments: PaperlessDocument[];
  cardReadRecords: CardReadRecord[];
  photoRecords: PhotoRecord[];
  orderInfo: OrderInfoProps['data'];
  onClose: () => void;
}

export default function SalesProductDetailModal({
  product,
  paperlessDocuments,
  cardReadRecords,
  photoRecords,
  orderInfo,
  onClose,
}: SalesProductDetailModalProps) {
  const extraTabs: OrderDetailExtraTab[] = [
    {
      key: 'paperless',
      label: '无纸化信息',
      icon: <Shield size={16} />,
      content: <PaperlessInfoPanel paperlessDocuments={paperlessDocuments} />,
    },
    {
      key: 'card',
      label: '读卡拍照记录',
      icon: <Camera size={16} />,
      content: (
        <CardPhotoRecordsPanel
          cardReadRecords={cardReadRecords}
          photoRecords={photoRecords}
        />
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[920px] h-full flex flex-col border-l border-background-200 animate-drawer-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 shrink-0">
              <i className="ri-shopping-bag-3-line text-primary-600"></i>
            </div>
            <h3 className="text-base font-semibold text-foreground-900 truncate">{product.name}</h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                product.valid ? 'bg-primary-100 text-primary-800' : 'bg-background-200 text-foreground-600'
              }`}
            >
              {product.valid ? '有效' : '无效'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-100 transition-colors text-foreground-500 cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <OrderInfo data={orderInfo} extraTabs={extraTabs} />
        </div>
      </div>
    </div>
  );
}