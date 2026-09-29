import { useState } from 'react';

// ── Types ──────────────────────────────────────────

export interface CustomerInfoFields {
  customerCode?: string;
  customerName?: string;
  paymentMethod?: string;
  uimCard?: string;
  receivableAmount?: string;
  industryCustomerStatus?: string;
  accountEndTime?: string;
  idType?: string;
  idNumber?: string;
  idAddress?: string;
}

export interface MainProductFields {
  _2g3g?: string;
  ccgPlatformFlag?: string;
  serviceStatus?: string;
  vipLevel?: string;
  realNameRegType?: string;
  realNameStatus?: string;
  billQueryLevel?: string;
  userPlanType?: string;
}

export interface SubProductItem {
  name: string;
  active: boolean;
}

export interface OrderHeaderFields {
  localNetworkId?: string;
  orderHeaderCode?: string;
  orderNumber?: string;
  priority?: string;
  orderTypeCode?: string;
  orderTypeName?: string;
  paymentMethodCode?: string;
  paymentMethod?: string;
  orderStatusCode?: string;
  orderStatusName?: string;
  orderCreator?: string;
  createDate?: string;
  acceptDate?: string;
  acceptTime?: string;
  statusDate?: string;
  lastUpdateDate?: string;
  remark?: string;
  regionId?: string;
  externalOrderHeaderCode?: string;
  externalChannelOrderNo?: string;
  sourceSystem?: string;
  sourceSystemName?: string;
  orderNo?: string;
  orderSourceDetail?: string;
  customerCode20?: string;
  transferCustomerId?: string;
  fixedPhoneSupplementFlag?: string;
  paperlessFlag?: string;
  acceptChannelType?: string;
  acceptChannelDetail?: string;
  cancelReason?: string;
  reservationNo?: string;
  shoppingGuideId?: string;
  groupPhoneAcceptChannelCode?: string;
  businessEntity?: string;
  acceptNewCode?: string;
  groupNetworkCode?: string;
  outletCode?: string;
  teamName?: string;
  businessEntity2?: string;
  marketingStaffAccept?: string;
  groupStaffNoAccept?: string;
  secondDeveloper?: string;
  orderTrackingId?: string;
  lastOrderHandlerId?: string;
  handlerName?: string;
  handlerIdType?: string;
  handlerIdNo?: string;
  handlerPhone?: string;
  handlerAddress?: string;
  handlerIdExpiry?: string;
  hasCustomerOrder?: string;
  joinNetworkTime?: string;
  reservationNoN?: string;
  orderCreateTime?: string;
}

export interface OrderLineItem {
  localNetworkCode?: string;
  orderLineCode?: string;
  rentOrderItemCode?: string;
  parentOrderItemId?: string;
  orderCode?: string;
  statusCode?: string;
  status?: string;
  statusDate?: string;
  orderLineTypeCode?: string;
  orderLineType?: string;
  isMarketingSaleProduct?: string;
  productInstanceCode?: string;
  productCode?: string;
  productMainType?: string;
  saleProductInstance?: string;
  saleProductCode?: string;
  saleProductType?: string;
  mainPlanSaleProductCode?: string;
  saleProductId?: string;
  serviceProvideId?: string;
  orderAction?: string;
  orderSubAction?: string;
  completeTime?: string;
  lastCompleteDate?: string;
  lastCompleteTime?: string;
  lastUpdateDate?: string;
  remark?: string;
  productLevel4Code?: string;
  serviceOfficeNo?: string;
  businessNumber?: string;
  dedicatedLineCode?: string;
  regionId?: string;
  regionName?: string;
  installAddress?: string;
  useCustomerId?: string;
  customerCode?: string;
  paymentMethod?: string;
  developer?: string;
  secondDeveloper?: string;
  inspector?: string;
  inspectDate?: string;
  productCode20?: string;
  saleProductCode20?: string;
  createTime?: string;
  statusUpdateTime?: string;
  joinNetworkTime?: string;
  reverseOrderLine?: string;
  reverseOrder?: string;
  reverseOutlet?: string;
  reverseTime?: string;
  instantBuySupplementFlag?: string;
}

// ── Helpers ────────────────────────────────────────

function FieldValue({ value, className }: { value: string | undefined; className?: string }) {
  return (
    <span className={`text-sm text-foreground-900 truncate ${className || ''}`}>
      {value || '\u2014'}
    </span>
  );
}

function FieldGrid({ fields }: { fields: { label: string; value: string | undefined; full?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
      {fields.map((f, i) => (
        <div
          key={i}
          className={`flex items-baseline gap-1.5 min-w-0 ${f.full ? 'col-span-2' : ''}`}
        >
          <span className="text-xs text-foreground-400 shrink-0 whitespace-nowrap">{f.label}</span>
          <FieldValue value={f.value} />
        </div>
      ))}
    </div>
  );
}

function CollapsibleSection({
  icon,
  title,
  count,
  defaultOpen,
  children,
}: {
  icon: string;
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border border-background-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-background-50 hover:bg-background-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center rounded-md bg-background-200/70">
            <i className={`${icon} text-sm text-primary-500`}></i>
          </div>
          <span className="text-sm font-semibold text-foreground-900">{title}</span>
          <span className="text-xs text-foreground-400 bg-background-200/70 px-1.5 py-0.5 rounded-full font-medium">
            {count}项
          </span>
        </div>
        <div className="flex items-center gap-2">
          {open ? (
            <i className="ri-arrow-up-s-line text-foreground-400 text-base transition-transform duration-200"></i>
          ) : (
            <i className="ri-arrow-down-s-line text-foreground-400 text-base transition-transform duration-200"></i>
          )}
        </div>
      </button>
      {open && (
        <div className="p-4 border-t border-background-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Section Components ─────────────────────────────

export function CustomerSection({ data }: { data: CustomerInfoFields | undefined }) {
  if (!data) {
    return <p className="text-sm text-foreground-400 text-center py-4">暂无客户信息</p>;
  }

  const fields = [
    { label: '客户编码', value: data.customerCode },
    { label: '客户名称', value: data.customerName },
    { label: '付费方式', value: data.paymentMethod },
    { label: 'UIM卡', value: data.uimCard },
    { label: '应收金额', value: data.receivableAmount },
    { label: '行业客户状态', value: data.industryCustomerStatus },
    { label: '开户结束时间', value: data.accountEndTime },
    { label: '证件类型', value: data.idType },
    { label: '证件号码', value: data.idNumber },
    { label: '证件地址', value: data.idAddress, full: true },
  ];

  return <FieldGrid fields={fields} />;
}

export function MainProductSection({ data }: { data: MainProductFields | undefined }) {
  if (!data) {
    return <p className="text-sm text-foreground-400 text-center py-4">暂无主产品信息</p>;
  }

  const fields = [
    { label: '2/3G', value: data._2g3g },
    { label: 'CCG平台标识', value: data.ccgPlatformFlag },
    { label: '服务状态', value: data.serviceStatus },
    { label: '靓号等级', value: data.vipLevel },
    { label: '实名登记类型', value: data.realNameRegType },
    { label: '实名制', value: data.realNameStatus },
    { label: '详单查询等级', value: data.billQueryLevel },
    { label: '用户套餐类型', value: data.userPlanType },
  ];

  return <FieldGrid fields={fields} />;
}

export function SubProductSection({ data }: { data: SubProductItem[] | undefined }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-foreground-400 text-center py-4">暂无子产品信息</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
      {data.map((sp, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${sp.active ? 'bg-primary-500' : 'bg-background-300'}`}></div>
          <span className={`text-sm ${sp.active ? 'text-foreground-900' : 'text-foreground-400'}`}>
            {sp.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function OrderHeaderSection({ data }: { data: OrderHeaderFields | undefined }) {
  if (!data) {
    return <p className="text-sm text-foreground-400 text-center py-4">暂无订单头信息</p>;
  }

  const fields = [
    { label: '本地网标识', value: data.localNetworkId },
    { label: '订单头编码', value: data.orderHeaderCode },
    { label: '订单号', value: data.orderNumber },
    { label: '优先级', value: data.priority },
    { label: '订单类型编码', value: data.orderTypeCode },
    { label: '订单类型名称', value: data.orderTypeName },
    { label: '付款方式编码', value: data.paymentMethodCode },
    { label: '付费方式', value: data.paymentMethod },
    { label: '订单状态编码', value: data.orderStatusCode },
    { label: '订单状态名称', value: data.orderStatusName },
    { label: '订单创建人', value: data.orderCreator },
    { label: '创建日期', value: data.createDate },
    { label: '受理日期', value: data.acceptDate },
    { label: '受理时间', value: data.acceptTime },
    { label: '状态日期', value: data.statusDate },
    { label: '最后更新日期', value: data.lastUpdateDate },
    { label: '备注', value: data.remark, full: true },
    { label: '区域标识', value: data.regionId },
    { label: '现售部分业务受理订单从集中集客系统填写的订单头编码', value: data.externalOrderHeaderCode, full: true },
    { label: '外渠客户订单编号', value: data.externalChannelOrderNo },
    { label: '来源系统', value: data.sourceSystem },
    { label: '来源系统名称', value: data.sourceSystemName },
    { label: '订单编号', value: data.orderNo },
    { label: '订单来源细分', value: data.orderSourceDetail },
    { label: '2.0客户编码', value: data.customerCode20 },
    { label: '过户客户ID', value: data.transferCustomerId },
    { label: '固定电话追补录订单标识', value: data.fixedPhoneSupplementFlag },
    { label: '无纸化标识', value: data.paperlessFlag },
    { label: '受理渠道类型', value: data.acceptChannelType },
    { label: '受理渠道细项', value: data.acceptChannelDetail },
    { label: '拆机返销原因', value: data.cancelReason },
    { label: '预约单编号', value: data.reservationNo },
    { label: '导购员工号', value: data.shoppingGuideId },
    { label: '集团电话受理-受理渠道编码', value: data.groupPhoneAcceptChannelCode },
    { label: '经营主体', value: data.businessEntity },
    { label: '受理新装编码', value: data.acceptNewCode },
    { label: '集团网编码', value: data.groupNetworkCode },
    { label: '网点编码', value: data.outletCode },
    { label: '班组名', value: data.teamName },
    { label: '经营主体', value: data.businessEntity2 },
    { label: '营销员工号-受理', value: data.marketingStaffAccept },
    { label: '集团员工编号-受理', value: data.groupStaffNoAccept },
    { label: '第二发展人', value: data.secondDeveloper },
    { label: '跟单工号', value: data.orderTrackingId },
    { label: '最后订单经办人员标识', value: data.lastOrderHandlerId },
    { label: '经办人姓名', value: data.handlerName },
    { label: '经办人证件类型', value: data.handlerIdType },
    { label: '经办人证件号', value: data.handlerIdNo },
    { label: '经办人号码', value: data.handlerPhone },
    { label: '经办人地址', value: data.handlerAddress, full: true },
    { label: '经办人二代证有效期', value: data.handlerIdExpiry },
    { label: '是否有客户订单', value: data.hasCustomerOrder },
    { label: '入网时间', value: data.joinNetworkTime },
    { label: '预约单编号(N)', value: data.reservationNoN },
    { label: '订单创建时间', value: data.orderCreateTime },
  ];

  return <FieldGrid fields={fields} />;
}

export function OrderLineSection({ data }: { data: OrderLineItem[] | undefined }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-foreground-400 text-center py-4">暂无订单行信息</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((ol, idx) => (
        <div key={idx} className="border border-background-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary-500"></div>
            <span className="text-xs font-semibold text-foreground-700">
              {ol.orderLineCode || `订单行 ${idx + 1}`}
            </span>
            {ol.status && (
              <span className={`inline-flex items-center px-1.5 py-px text-xs font-medium rounded-full ${
                ol.status === '正常' || ol.status === '竣工' || ol.status === '已归档'
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-background-200 text-foreground-700'
              }`}>
                {ol.status}
              </span>
            )}
          </div>
          <FieldGrid fields={[
            { label: '本地网编码', value: ol.localNetworkCode },
            { label: '订单行编码', value: ol.orderLineCode },
            { label: '租单/订单项目编码', value: ol.rentOrderItemCode },
            { label: '上级订单项目标识', value: ol.parentOrderItemId },
            { label: '订单编码', value: ol.orderCode },
            { label: '状态码', value: ol.statusCode },
            { label: '状态', value: ol.status },
            { label: '状态日期', value: ol.statusDate },
            { label: '订单行类型编码', value: ol.orderLineTypeCode },
            { label: '订单行类型', value: ol.orderLineType },
            { label: '是否营销销售品', value: ol.isMarketingSaleProduct },
            { label: '产品实例编码', value: ol.productInstanceCode },
            { label: '产品编码', value: ol.productCode },
            { label: '产品主要类型', value: ol.productMainType },
            { label: '销售品实例', value: ol.saleProductInstance },
            { label: '销售品编码', value: ol.saleProductCode },
            { label: '销售品类型', value: ol.saleProductType },
            { label: '主套餐销售品编码', value: ol.mainPlanSaleProductCode },
            { label: '销售品标识', value: ol.saleProductId },
            { label: '服务提供标识', value: ol.serviceProvideId },
            { label: '订单行为', value: ol.orderAction },
            { label: '订单子行为', value: ol.orderSubAction },
            { label: '竣工时间', value: ol.completeTime },
            { label: '上次竣工日期', value: ol.lastCompleteDate },
            { label: '上次竣工时间', value: ol.lastCompleteTime },
            { label: '上次更新日期', value: ol.lastUpdateDate },
            { label: '备注', value: ol.remark, full: true },
            { label: '四级产品编码', value: ol.productLevel4Code },
            { label: '营服号', value: ol.serviceOfficeNo },
            { label: '业务号码', value: ol.businessNumber },
            { label: '专线编码', value: ol.dedicatedLineCode },
            { label: '区域标识', value: ol.regionId },
            { label: '区域名称', value: ol.regionName },
            { label: '安装详细地址', value: ol.installAddress, full: true },
            { label: '使用客户标识', value: ol.useCustomerId },
            { label: '客户编码', value: ol.customerCode },
            { label: '付款方式', value: ol.paymentMethod },
            { label: '发展人', value: ol.developer },
            { label: '第二发展人', value: ol.secondDeveloper },
            { label: '巡检人员', value: ol.inspector },
            { label: '巡检日期', value: ol.inspectDate },
            { label: '2.0产品编码', value: ol.productCode20 },
            { label: '2.0销售品编码', value: ol.saleProductCode20 },
            { label: '创建时间', value: ol.createTime },
            { label: '状态更新时间', value: ol.statusUpdateTime },
            { label: '入网时间', value: ol.joinNetworkTime },
            { label: '反销订单行', value: ol.reverseOrderLine },
            { label: '反销订单', value: ol.reverseOrder },
            { label: '反销网点', value: ol.reverseOutlet },
            { label: '反销时间', value: ol.reverseTime },
            { label: '即买即通补录订单标识位', value: ol.instantBuySupplementFlag },
          ]} />
        </div>
      ))}
    </div>
  );
}

// ── Combined Order Info Section ─────────────────

function CombinedOrderSection({
  orderHeader,
  orderLines,
}: {
  orderHeader: OrderHeaderFields | undefined;
  orderLines: OrderLineItem[] | undefined;
}) {
  const hasHeader = !!orderHeader;
  const hasLines = orderLines && orderLines.length > 0;

  if (!hasHeader && !hasLines) {
    return <p className="text-sm text-foreground-400 text-center py-4">暂无订单信息</p>;
  }

  return (
    <div className="space-y-5">
      {/* ── 订单头 ── */}
      {hasHeader && (
        <div>
          <FieldGrid fields={[
            { label: '本地网标识', value: orderHeader.localNetworkId },
            { label: '订单头编码', value: orderHeader.orderHeaderCode },
            { label: '订单号', value: orderHeader.orderNumber },
            { label: '优先级', value: orderHeader.priority },
            { label: '订单类型编码', value: orderHeader.orderTypeCode },
            { label: '订单类型名称', value: orderHeader.orderTypeName },
            { label: '付款方式编码', value: orderHeader.paymentMethodCode },
            { label: '付费方式', value: orderHeader.paymentMethod },
            { label: '订单状态编码', value: orderHeader.orderStatusCode },
            { label: '订单状态名称', value: orderHeader.orderStatusName },
            { label: '订单创建人', value: orderHeader.orderCreator },
            { label: '创建日期', value: orderHeader.createDate },
            { label: '受理日期', value: orderHeader.acceptDate },
            { label: '受理时间', value: orderHeader.acceptTime },
            { label: '状态日期', value: orderHeader.statusDate },
            { label: '最后更新日期', value: orderHeader.lastUpdateDate },
            { label: '备注', value: orderHeader.remark, full: true },
            { label: '区域标识', value: orderHeader.regionId },
            { label: '现售部分业务受理订单从集中集客系统填写的订单头编码', value: orderHeader.externalOrderHeaderCode, full: true },
            { label: '外渠客户订单编号', value: orderHeader.externalChannelOrderNo },
            { label: '来源系统', value: orderHeader.sourceSystem },
            { label: '来源系统名称', value: orderHeader.sourceSystemName },
            { label: '订单编号', value: orderHeader.orderNo },
            { label: '订单来源细分', value: orderHeader.orderSourceDetail },
            { label: '2.0客户编码', value: orderHeader.customerCode20 },
            { label: '过户客户ID', value: orderHeader.transferCustomerId },
            { label: '固定电话追补录订单标识', value: orderHeader.fixedPhoneSupplementFlag },
            { label: '无纸化标识', value: orderHeader.paperlessFlag },
            { label: '受理渠道类型', value: orderHeader.acceptChannelType },
            { label: '受理渠道细项', value: orderHeader.acceptChannelDetail },
            { label: '拆机返销原因', value: orderHeader.cancelReason },
            { label: '预约单编号', value: orderHeader.reservationNo },
            { label: '导购员工号', value: orderHeader.shoppingGuideId },
            { label: '集团电话受理-受理渠道编码', value: orderHeader.groupPhoneAcceptChannelCode },
            { label: '经营主体', value: orderHeader.businessEntity },
            { label: '受理新装编码', value: orderHeader.acceptNewCode },
            { label: '集团网编码', value: orderHeader.groupNetworkCode },
            { label: '网点编码', value: orderHeader.outletCode },
            { label: '班组名', value: orderHeader.teamName },
            { label: '经营主体', value: orderHeader.businessEntity2 },
            { label: '营销员工号-受理', value: orderHeader.marketingStaffAccept },
            { label: '集团员工编号-受理', value: orderHeader.groupStaffNoAccept },
            { label: '第二发展人', value: orderHeader.secondDeveloper },
            { label: '跟单工号', value: orderHeader.orderTrackingId },
            { label: '最后订单经办人员标识', value: orderHeader.lastOrderHandlerId },
            { label: '经办人姓名', value: orderHeader.handlerName },
            { label: '经办人证件类型', value: orderHeader.handlerIdType },
            { label: '经办人证件号', value: orderHeader.handlerIdNo },
            { label: '经办人号码', value: orderHeader.handlerPhone },
            { label: '经办人地址', value: orderHeader.handlerAddress, full: true },
            { label: '经办人二代证有效期', value: orderHeader.handlerIdExpiry },
            { label: '是否有客户订单', value: orderHeader.hasCustomerOrder },
            { label: '入网时间', value: orderHeader.joinNetworkTime },
            { label: '预约单编号(N)', value: orderHeader.reservationNoN },
            { label: '订单创建时间', value: orderHeader.orderCreateTime },
          ]} />
        </div>
      )}

      {/* ── 分隔线 ── */}
      {hasHeader && hasLines && (
        <div className="border-t border-background-100"></div>
      )}

      {/* ── 订单行 ── */}
      {hasLines && (
        <div>
          <div className="space-y-4">
            {orderLines!.map((ol, idx) => (
              <div key={idx} className="border border-background-100 rounded-lg p-4">
                <FieldGrid fields={[
                  { label: '本地网编码', value: ol.localNetworkCode },
                  { label: '订单行编码', value: ol.orderLineCode },
                  { label: '租单/订单项目编码', value: ol.rentOrderItemCode },
                  { label: '上级订单项目标识', value: ol.parentOrderItemId },
                  { label: '订单编码', value: ol.orderCode },
                  { label: '状态码', value: ol.statusCode },
                  { label: '状态', value: ol.status },
                  { label: '状态日期', value: ol.statusDate },
                  { label: '订单行类型编码', value: ol.orderLineTypeCode },
                  { label: '订单行类型', value: ol.orderLineType },
                  { label: '是否营销销售品', value: ol.isMarketingSaleProduct },
                  { label: '产品实例编码', value: ol.productInstanceCode },
                  { label: '产品编码', value: ol.productCode },
                  { label: '产品主要类型', value: ol.productMainType },
                  { label: '销售品实例', value: ol.saleProductInstance },
                  { label: '销售品编码', value: ol.saleProductCode },
                  { label: '销售品类型', value: ol.saleProductType },
                  { label: '主套餐销售品编码', value: ol.mainPlanSaleProductCode },
                  { label: '销售品标识', value: ol.saleProductId },
                  { label: '服务提供标识', value: ol.serviceProvideId },
                  { label: '订单行为', value: ol.orderAction },
                  { label: '订单子行为', value: ol.orderSubAction },
                  { label: '竣工时间', value: ol.completeTime },
                  { label: '上次竣工日期', value: ol.lastCompleteDate },
                  { label: '上次竣工时间', value: ol.lastCompleteTime },
                  { label: '上次更新日期', value: ol.lastUpdateDate },
                  { label: '备注', value: ol.remark, full: true },
                  { label: '四级产品编码', value: ol.productLevel4Code },
                  { label: '营服号', value: ol.serviceOfficeNo },
                  { label: '业务号码', value: ol.businessNumber },
                  { label: '专线编码', value: ol.dedicatedLineCode },
                  { label: '区域标识', value: ol.regionId },
                  { label: '区域名称', value: ol.regionName },
                  { label: '安装详细地址', value: ol.installAddress, full: true },
                  { label: '使用客户标识', value: ol.useCustomerId },
                  { label: '客户编码', value: ol.customerCode },
                  { label: '付款方式', value: ol.paymentMethod },
                  { label: '发展人', value: ol.developer },
                  { label: '第二发展人', value: ol.secondDeveloper },
                  { label: '巡检人员', value: ol.inspector },
                  { label: '巡检日期', value: ol.inspectDate },
                  { label: '2.0产品编码', value: ol.productCode20 },
                  { label: '2.0销售品编码', value: ol.saleProductCode20 },
                  { label: '创建时间', value: ol.createTime },
                  { label: '状态更新时间', value: ol.statusUpdateTime },
                  { label: '入网时间', value: ol.joinNetworkTime },
                  { label: '反销订单行', value: ol.reverseOrderLine },
                  { label: '反销订单', value: ol.reverseOrder },
                  { label: '反销网点', value: ol.reverseOutlet },
                  { label: '反销时间', value: ol.reverseTime },
                  { label: '即买即通补录订单标识位', value: ol.instantBuySupplementFlag },
                ]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Master Component ───────────────────────────────

interface OrderDetailSectionsProps {
  customerInfo?: CustomerInfoFields;
  mainProduct?: MainProductFields;
  subProducts?: SubProductItem[];
  orderHeader?: OrderHeaderFields;
  orderLines?: OrderLineItem[];
}

export default function OrderDetailSections({
  customerInfo,
  mainProduct,
  subProducts,
  orderHeader,
  orderLines,
}: OrderDetailSectionsProps) {
  return (
    <div className="space-y-3">
      <CollapsibleSection
        icon="ri-user-line"
        title="客户信息"
        count={10}
        defaultOpen
      >
        <CustomerSection data={customerInfo} />
      </CollapsibleSection>

      <CollapsibleSection
        icon="ri-smartphone-line"
        title="主产品"
        count={8}
      >
        <MainProductSection data={mainProduct} />
      </CollapsibleSection>

      <CollapsibleSection
        icon="ri-stack-line"
        title="子产品"
        count={subProducts?.length || 0}
      >
        <SubProductSection data={subProducts} />
      </CollapsibleSection>

      <CollapsibleSection
        icon="ri-file-list-3-line"
        title="订单信息"
        count={55 + (orderLines?.length || 0)}
      >
        <CombinedOrderSection orderHeader={orderHeader} orderLines={orderLines} />
      </CollapsibleSection>
    </div>
  );
}