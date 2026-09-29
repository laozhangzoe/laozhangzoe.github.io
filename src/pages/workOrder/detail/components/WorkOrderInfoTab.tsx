import { useState, useMemo, useEffect } from 'react';
import { workOrderList } from '@/mocks/workOrderData';
import { userProfiles } from '@/mocks/queryData';
import { userProfilesExtra } from '@/mocks/queryDataExtra';
import {
  workOrderInfoMap,
  defaultWorkOrderInfo,
  demandCategories,
  type SalesProduct,
} from '@/mocks/workOrderInfoData';
import SalesProductDetailModal from './SalesProductDetailModal';

const allUserProfiles = { ...userProfilesExtra, ...userProfiles };

interface WorkOrderInfoTabProps {
  businessNumber: string;
}

function SectionTitle({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 flex items-center justify-center rounded-md bg-primary-100">
          <i className={`${icon} text-sm text-primary-600`}></i>
        </div>
        <h3 className="text-sm font-semibold text-foreground-900 whitespace-nowrap">{title}</h3>
      </div>
      {description && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-50 text-xs font-medium text-primary-700">
          <i className="ri-information-line text-sm"></i>
          {description}
        </span>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-start gap-2 min-w-0 py-1">
      <span className="text-xs text-foreground-400 shrink-0 w-20 text-right leading-6">{label}</span>
      <span className="text-sm text-foreground-900 leading-6 break-all">
        {value || '\u2014'}
      </span>
    </div>
  );
}

function CategoryDropdown({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-foreground-700 whitespace-nowrap">{label}</span>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm w-44 transition-colors ${
            disabled
              ? 'bg-background-100 border-background-200 text-foreground-300 cursor-not-allowed'
              : 'bg-background-50 border-background-200 text-foreground-700 hover:border-primary-300 cursor-pointer'
          }`}
        >
          <span className={`flex-1 text-left truncate ${selected ? '' : 'text-foreground-400'}`}>
            {selected ? selected.label : '请选择'}
          </span>
          <i className={`ri-arrow-down-s-line text-foreground-400 transition-transform ${open ? 'rotate-180' : ''}`}></i>
        </button>
        {open && !disabled && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
            <div className="absolute top-full left-0 mt-1 bg-white border border-background-200 rounded-lg shadow-lg z-20 w-full max-h-56 overflow-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-background-50 transition-colors cursor-pointer ${
                    value === opt.value ? 'text-primary-600 font-medium' : 'text-foreground-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function WorkOrderInfoTab({ businessNumber }: WorkOrderInfoTabProps) {
  const workOrder = useMemo(
    () => workOrderList.find((w) => w.businessNumber === businessNumber),
    [businessNumber]
  );
  const info = workOrderInfoMap[businessNumber] || defaultWorkOrderInfo;
  const userData = businessNumber
    ? allUserProfiles[businessNumber as keyof typeof allUserProfiles]
    : null;

  const [selectedProduct, setSelectedProduct] = useState<SalesProduct | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [validFilter, setValidFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [validFilterOpen, setValidFilterOpen] = useState(false);

  const [demandSummary, setDemandSummary] = useState(info.demandSummary);
  const [closingContent, setClosingContent] = useState(info.closingContent);
  const [remark, setRemark] = useState(info.remark);
  const [level1, setLevel1] = useState(info.demandL1);
  const [level2, setLevel2] = useState(info.demandL2);
  const [savedTip, setSavedTip] = useState(false);

  useEffect(() => {
    setDemandSummary(info.demandSummary);
    setClosingContent(info.closingContent);
    setRemark(info.remark);
    setLevel1(info.demandL1);
    setLevel2(info.demandL2);
    setSavedTip(false);
    setSelectedIndex(null);
  }, [info]);

  const level2Options = useMemo(() => {
    const cat = demandCategories.find((c) => c.value === level1);
    return cat ? cat.children : [];
  }, [level1]);

  const penaltyRecords = useMemo(
    () => info.salesProducts.flatMap((p) => p.penalty),
    [info]
  );

  const filteredProducts = useMemo(() => {
    if (validFilter === 'all') return info.salesProducts;
    return info.salesProducts.filter((p) => (validFilter === 'valid' ? p.valid : !p.valid));
  }, [info, validFilter]);

  const validFilterOptions = [
    { value: 'all', label: '全部' },
    { value: 'valid', label: '有效' },
    { value: 'invalid', label: '无效' },
  ] as const;

  const penaltyColumns = [
    { key: 'businessNumber', label: '业务号码' },
    { key: 'riskPackage', label: '存在违约金风险包' },
    { key: 'penaltyType', label: '违约金类型' },
    { key: 'penaltyAmount', label: '违约金额' },
    { key: 'remainingMonths', label: '违约金剩余月份' },
    { key: 'penaltyAlgorithm', label: '违约金算法' },
    { key: 'changeRestriction', label: '变更限制' },
  ] as const;

  const baseFields = [
    { label: '工单编号', value: workOrder?.workOrderId },
    { label: '业务号码', value: workOrder?.businessNumber || businessNumber },
    { label: '区域名称', value: workOrder?.regionName },
    { label: '产品名称', value: workOrder?.productName },
    { label: '受理人员', value: workOrder?.acceptStaff },
    { label: '受理部门', value: workOrder?.acceptDept },
    { label: '责任人', value: workOrder?.responsiblePerson },
    { label: '责任部门', value: workOrder?.responsibleDept },
    { label: '客户姓名', value: workOrder?.customerName },
    { label: '联系电话', value: workOrder?.contactPhone },
  ];

  const handleCancel = () => {
    setDemandSummary(info.demandSummary);
    setClosingContent(info.closingContent);
    setRemark(info.remark);
    setLevel1(info.demandL1);
    setLevel2(info.demandL2);
    setSavedTip(false);
  };

  const handleConfirm = () => {
    setSavedTip(true);
  };

  return (
    <div className="space-y-6">
      {/* ── 基础信息 ── */}
      <section>
        <SectionTitle icon="ri-file-info-line" title="基础信息" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {baseFields.map((f) => (
            <ReadOnlyField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
        <div className="mt-2 space-y-1">
          <ReadOnlyField label="投诉内容" value={info.complaintContent} />
        </div>
      </section>

      {/* ── 销售品信息 ── */}
      <section>
        <SectionTitle
          icon="ri-shopping-bag-3-line"
          title="销售品信息"
          description="请先选中一条销售品，再点击「获取详情」按钮查看该销售品的订单信息、无纸化信息、读卡拍照记录"
        />
        <div className="border border-background-100 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background-100 border-b border-background-100">
                  {['选择', '序号', '类型', '销售品名称', '是否有效', '生效方式', '开始时间', '结束时间', '操作'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-foreground-500 px-4 py-3 whitespace-nowrap"
                    >
                      {h === '是否有效' ? (
                        <div className="relative inline-flex items-center gap-1">
                          <span className={validFilter !== 'all' ? 'text-primary-600' : ''}>是否有效</span>
                          <button
                            type="button"
                            onClick={() => setValidFilterOpen((v) => !v)}
                            aria-label="筛选是否有效"
                            className={`w-5 h-5 flex items-center justify-center rounded transition-colors cursor-pointer ${
                              validFilter !== 'all'
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-foreground-400 hover:text-foreground-700 hover:bg-background-200'
                            }`}
                          >
                            <i className={`text-base ${validFilter === 'all' ? 'ri-filter-3-line' : 'ri-filter-3-fill'}`}></i>
                          </button>
                          {validFilterOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setValidFilterOpen(false)}></div>
                              <div className="absolute top-full left-0 mt-1 bg-white border border-background-200 rounded-lg shadow-lg z-20 min-w-[110px] py-1 normal-case">
                                {validFilterOptions.map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setValidFilter(opt.value);
                                      setValidFilterOpen(false);
                                      setSelectedIndex(null);
                                    }}
                                    className={`flex items-center justify-between gap-3 w-full text-left px-3 py-1.5 text-xs font-normal hover:bg-background-50 transition-colors cursor-pointer ${
                                      validFilter === opt.value ? 'text-primary-600 font-medium' : 'text-foreground-700'
                                    }`}
                                  >
                                    {opt.label}
                                    {validFilter === opt.value && <i className="ri-check-line text-primary-500"></i>}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        h
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const isSelected = selectedIndex === p.index;
                    return (
                    <tr
                      key={p.index}
                      onClick={() => setSelectedIndex(p.index)}
                      className={`border-b border-background-50 last:border-0 transition-colors cursor-pointer ${
                        isSelected ? 'bg-primary-50' : 'hover:bg-background-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIndex(p.index);
                          }}
                          aria-label={`选择第 ${p.index} 条销售品`}
                          className="w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer"
                          style={{ borderColor: isSelected ? 'oklch(var(--primary-500))' : 'oklch(var(--background-300))' }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                            style={{ backgroundColor: 'oklch(var(--primary-500))' }}
                          ></span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-600 whitespace-nowrap">{p.index}</td>
                      <td className="px-4 py-3 text-sm text-foreground-800 whitespace-nowrap">{p.type}</td>
                      <td className="px-4 py-3 text-sm text-foreground-800 whitespace-nowrap">{p.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                            p.valid ? 'bg-primary-100 text-primary-800' : 'bg-background-200 text-foreground-600'
                          }`}
                        >
                          {p.valid ? '有效' : '无效'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-800 whitespace-nowrap">{p.effectType}</td>
                      <td className="px-4 py-3 text-sm text-foreground-600 whitespace-nowrap">{p.startTime}</td>
                      <td className="px-4 py-3 text-sm text-foreground-600 whitespace-nowrap">{p.endTime}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isSelected ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(p);
                            }}
                            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-file-list-3-line transition-transform group-hover:translate-x-0.5"></i>
                            获取详情
                          </button>
                        ) : (
                          <span className="text-xs text-foreground-300">—</span>
                        )}
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-sm text-foreground-400 text-center">
                      暂无符合条件的销售品
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 违约金信息 ── */}
      <section>
        <SectionTitle icon="ri-error-warning-line" title="违约金信息" />
        <div className="border border-background-100 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-background-100 border-b border-background-100">
                  {penaltyColumns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left text-xs font-medium text-foreground-500 px-4 py-3 whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {penaltyRecords.length > 0 ? (
                  penaltyRecords.map((rec, idx) => (
                    <tr key={idx} className="border-b border-background-50 last:border-0 hover:bg-background-50/50 transition-colors">
                      {penaltyColumns.map((col, ci) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-sm whitespace-nowrap ${
                            ci === 0 ? 'text-foreground-600 bg-background-50/60' : 'text-foreground-900'
                          }`}
                        >
                          {rec[col.key] || '\u2014'}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={penaltyColumns.length}
                      className="px-4 py-6 text-sm text-foreground-400 text-center"
                    >
                      暂无违约金记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 诉求总结 ── */}
      <section>
        <SectionTitle icon="ri-chat-check-line" title="诉求总结" />
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground-700 mb-2">诉求总结</label>
            <textarea
              value={demandSummary}
              onChange={(e) => setDemandSummary(e.target.value)}
              placeholder="请输入本次工单的诉求总结…"
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 text-sm text-foreground-800 bg-background-50 border border-background-200 rounded-lg focus:outline-none focus:border-primary-400 resize-none"
            />
            <div className="text-right text-xs text-foreground-400 mt-1">{demandSummary.length}/500</div>
          </div>

          <div>
            <label className="block text-sm text-foreground-700 mb-2">结案内容</label>
            <textarea
              value={closingContent}
              onChange={(e) => setClosingContent(e.target.value)}
              placeholder="请输入结案内容…"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 text-sm text-foreground-800 bg-background-50 border border-background-200 rounded-lg focus:outline-none focus:border-primary-400 resize-none"
            />
            <div className="text-right text-xs text-foreground-400 mt-1">{closingContent.length}/500</div>
          </div>

          <div>
            <label className="block text-sm text-foreground-700 mb-2">备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请输入备注…"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 text-sm text-foreground-800 bg-background-50 border border-background-200 rounded-lg focus:outline-none focus:border-primary-400 resize-none"
            />
            <div className="text-right text-xs text-foreground-400 mt-1">{remark.length}/500</div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <CategoryDropdown
              label="一级分类"
              value={level1}
              options={demandCategories.map((c) => ({ value: c.value, label: c.label }))}
              onChange={(v) => {
                setLevel1(v);
                setLevel2('');
              }}
            />
            <CategoryDropdown
              label="二级分类"
              value={level2}
              options={level2Options}
              disabled={!level1}
              onChange={setLevel2}
            />
          </div>

          {savedTip && (
            <div className="flex items-center gap-2 text-sm text-primary-700 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
              <i className="ri-checkbox-circle-line text-primary-500"></i>
              诉求总结已保存
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleConfirm}
              className="px-5 py-1.5 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              确定
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-1.5 bg-white border border-background-200 text-foreground-600 rounded-md text-sm font-medium hover:bg-background-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <SalesProductDetailModal
          product={selectedProduct}
          paperlessDocuments={info.paperlessDocuments}
          cardReadRecords={info.cardReadRecords}
          photoRecords={info.photoRecords}
          orderInfo={userData?.orderInfo || { orders: [] }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}