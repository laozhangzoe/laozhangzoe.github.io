// 工单详情 —— 基础信息 / 销售品 / 无纸化 / 读卡拍照 的演示数据

export interface PenaltyInfo {
  businessNumber: string;
  riskPackage: string;
  penaltyType: string;
  penaltyAmount: string;
  remainingMonths: string;
  penaltyAlgorithm: string;
  changeRestriction: string;
}

export interface SalesProduct {
  index: number;
  type: string;
  name: string;
  valid: boolean;
  effectType: string;
  startTime: string;
  endTime: string;
  penalty: PenaltyInfo[];
}

export interface PaperlessDocument {
  key: string;
  label: string;
  fileName: string;
  fileNo: string;
  fileUrl: string;
  fileSize: string;
  updateTime: string;
  status: string;
  keyPages?: KeyInfoImage[];
}

export interface KeyInfoImage {
  title: string;
  url: string;
}

export interface CardReadRecord {
  customerName: string;
  docType: string;
  docNumber: string;
  operator: string;
  operatorNo: string;
  authTime: string;
  authMethod: string;
  status: string;
}

export interface PhotoRecord {
  customerName: string;
  docType: string;
  docNumber: string;
  businessNumber: string;
  hallName: string;
  operator: string;
  operatorNo: string;
  photoTime: string;
  source: string;
  scenePhotoUrl: string;
  docPhotoUrl: string;
}

export interface DemandCategory {
  value: string;
  label: string;
  children: { value: string; label: string }[];
}

export interface WorkOrderInfoDetail {
  complaintContent: string;
  closingContent: string;
  remark: string;
  salesProducts: SalesProduct[];
  paperlessDocuments: PaperlessDocument[];
  cardReadRecords: CardReadRecord[];
  photoRecords: PhotoRecord[];
  demandSummary: string;
  demandL1: string;
  demandL2: string;
}

const defaultSalesProducts: SalesProduct[] = [
  {
    index: 1,
    type: '销售品',
    name: '畅享卡(29元)',
    valid: true,
    effectType: '立即生效',
    startTime: '2025-03-06',
    endTime: '2045-03-06',
    penalty: [
      {
        businessNumber: '17757440725',
        riskPackage: '畅享卡(29元)',
        penaltyType: '收回己使用的赠金X元',
        penaltyAmount: '120.0',
        remainingMonths: '12',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
      {
        businessNumber: '17757440725',
        riskPackage: '畅享卡(29元)',
        penaltyType: '退待解冻本金X元',
        penaltyAmount: '0',
        remainingMonths: '12',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
    ],
  },
  {
    index: 2,
    type: '单',
    name: '专定向30GB流量',
    valid: true,
    effectType: '业务指定时',
    startTime: '2025-03-06',
    endTime: '2045-03-01',
    penalty: [
      {
        businessNumber: '17757440725',
        riskPackage: '专定向30GB流量',
        penaltyType: '收回己使用的赠金减免X元(系统内部专用)',
        penaltyAmount: '-60.0',
        remainingMonths: '6',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
    ],
  },
  {
    index: 3,
    type: '单',
    name: '大单团购C网X元分Y月优惠减免',
    valid: true,
    effectType: '立即生效',
    startTime: '2025-03-06',
    endTime: '2027-03-06',
    penalty: [
      {
        businessNumber: '17757440725',
        riskPackage: '大单团购C网X元分Y月优惠减免',
        penaltyType: '收回己使用的赠金X元',
        penaltyAmount: '380.0',
        remainingMonths: '6',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
      {
        businessNumber: '17757440725',
        riskPackage: '大单团购C网X元分Y月优惠减免',
        penaltyType: '退待解冻本金X元',
        penaltyAmount: '0',
        remainingMonths: '6',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
      {
        businessNumber: '17757440725',
        riskPackage: '大单团购C网X元分Y月优惠减免',
        penaltyType: '收回己使用的赠金减免X元(系统内部专用)',
        penaltyAmount: '-380.0',
        remainingMonths: '6',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
    ],
  },
  {
    index: 4,
    type: '单',
    name: '宁波5G专网流量每月包含50G手机上网流量',
    valid: true,
    effectType: '立即生效',
    startTime: '2025-03-06',
    endTime: '2045-03-06',
    penalty: [
      {
        businessNumber: '17757440725',
        riskPackage: '宁波5G专网流量每月包含50G手机上网流量',
        penaltyType: '收回己使用的赠金X元',
        penaltyAmount: '150.0',
        remainingMonths: '6',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
      {
        businessNumber: '17757440725',
        riskPackage: '宁波5G专网流量每月包含50G手机上网流量',
        penaltyType: '退待解冻本金X元',
        penaltyAmount: '0',
        remainingMonths: '6',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
    ],
  },
  {
    index: 5,
    type: '单',
    name: '集团星级维系',
    valid: true,
    effectType: '立即生效',
    startTime: '2025-03-19',
    endTime: '2045-03-19',
    penalty: [
      {
        businessNumber: '17757440725',
        riskPackage: '集团星级维系',
        penaltyType: '收回己使用的赠金减免X元(系统内部专用)',
        penaltyAmount: '-30.0',
        remainingMonths: '3',
        penaltyAlgorithm: '计费系统计算',
        changeRestriction: '-',
      },
    ],
  },
  {
    index: 6,
    type: '单',
    name: '5G网络权益升级包(畅享版)',
    valid: false,
    effectType: '立即生效',
    startTime: '2025-07-03',
    endTime: '2045-07-03',
    penalty: [
      {
        businessNumber: '17757440725',
        riskPackage: '5G网络权益升级包(畅享版)',
        penaltyType: '无',
        penaltyAmount: '0.0',
        remainingMonths: '0',
        penaltyAlgorithm: '无需计算',
        changeRestriction: '无',
      },
    ],
  },
];

const defaultPaperlessDocuments: PaperlessDocument[] = [
  {
    key: 'register',
    label: '客户登记单',
    fileName: '客户登记单_陶成成_20260409.pdf',
    fileNo: 'REGISTER-2026-0409-004',
    fileUrl:
      'https://public.readdy.ai/ai/img_res/sandbox/0209ae85688104ed641f20b007e1f21e/4ab75924-90c1-4769-bcc0-2c0c55010b4a_doc4.pdf',
    fileSize: '182KB',
    updateTime: '2026-04-09 16:29:26',
    status: '已签署',
    keyPages: [
      {
        title: '客户基本信息页',
        url: 'https://readdy.ai/api/search-image?query=Scanned%20page%20of%20a%20Chinese%20telecom%20customer%20registration%20form%20showing%20the%20customer%20basic%20information%20section%2C%20printed%20form%20fields%20filled%20with%20neat%20typed%20Chinese%20characters%20and%20a%20few%20handwritten%20entries%2C%20clean%20tabular%20layout%20on%20white%20paper%2C%20soft%20even%20scan%20lighting%2C%20flat%20top-down%20document%20view%2C%20realistic%20administrative%20scan%2C%20neutral%20tones%2C%20high%20detail&width=600&height=800&seq=regform-page-01&orientation=portrait',
      },
      {
        title: '业务受理信息页',
        url: 'https://readdy.ai/api/search-image?query=Scanned%20page%20of%20a%20Chinese%20telecom%20customer%20registration%20form%20showing%20the%20service%20acceptance%20information%20section%2C%20grid%20of%20printed%20labels%20with%20typed%20Chinese%20text%20and%20ticked%20checkboxes%2C%20clean%20layout%20on%20white%20paper%2C%20soft%20flat%20scan%20lighting%2C%20top-down%20document%20photograph%2C%20realistic%20administrative%20scan%2C%20neutral%20color%20palette%2C%20high%20detail&width=600&height=800&seq=regform-page-02&orientation=portrait',
      },
      {
        title: '客户签名确认页',
        url: 'https://readdy.ai/api/search-image?query=Scanned%20page%20of%20a%20Chinese%20telecom%20customer%20registration%20form%20showing%20the%20customer%20signature%20and%20confirmation%20section%2C%20printed%20agreement%20text%20with%20a%20blue%20handwritten%20signature%20and%20date%20at%20the%20bottom%2C%20clean%20white%20paper%2C%20soft%20even%20flat%20scan%20lighting%2C%20top-down%20view%2C%20realistic%20administrative%20document%20scan%2C%20neutral%20tones%2C%20high%20detail&width=600&height=800&seq=regform-page-03&orientation=portrait',
      },
    ],
  },
];

const defaultCardReadRecords: CardReadRecord[] = [
  {
    customerName: '陶成成',
    docType: '身份证',
    docNumber: '3302********3456',
    operator: '王丽萍',
    operatorNo: '325446',
    authTime: '2026-04-09 16:29:18',
    authMethod: '读卡器读取',
    status: '认证成功',
  },
  {
    customerName: '陶成成',
    docType: '身份证',
    docNumber: '3302********3456',
    operator: '王丽萍',
    operatorNo: '325446',
    authTime: '2026-04-09 16:31:42',
    authMethod: 'OCR识别',
    status: '认证成功',
  },
];

const defaultPhotoRecords: PhotoRecord[] = [
  {
    customerName: '陶成成',
    docType: '身份证',
    docNumber: '3302********3456',
    businessNumber: '18989354069',
    hallName: '宁波鄞州线上营业厅',
    operator: '王丽萍',
    operatorNo: '325446',
    photoTime: '2026-04-09 16:29:21',
    source: '现场摄像头',
    scenePhotoUrl:
      'https://readdy.ai/api/search-image?query=Candid%20photo%20captured%20at%20a%20modern%20telecom%20service%20counter%20showing%20a%20customer%20seated%20and%20being%20served%20by%20a%20staff%20member%20from%20an%20over-the-shoulder%20angle%2C%20bright%20clean%20indoor%20lighting%2C%20softly%20blurred%20service%20hall%20background%20with%20wall%20signage%2C%20realistic%20documentary%20style%2C%20neutral%20warm%20tones%2C%20sharp%20high%20detail&width=800&height=560&seq=photo-scene-01&orientation=landscape',
    docPhotoUrl:
      'https://readdy.ai/api/search-image?query=Scanned%20front%20side%20of%20a%20Chinese%20resident%20identity%20card%20laid%20flat%20on%20a%20clean%20light%20gray%20surface%2C%20placeholder%20portrait%20box%20and%20printed%20field%20text%2C%20soft%20even%20lighting%2C%20flat%20top-down%20view%2C%20sharp%20professional%20administrative%20scan%2C%20no%20glare%2C%20neutral%20color%20palette%2C%20high%20detail&width=800&height=560&seq=photo-doc-01&orientation=landscape',
  },
  {
    customerName: '陶成成',
    docType: '身份证',
    docNumber: '3302********3456',
    businessNumber: '18989354069',
    hallName: '宁波鄞州线上营业厅',
    operator: '王丽萍',
    operatorNo: '325446',
    photoTime: '2026-04-09 16:31:45',
    source: '读卡器',
    scenePhotoUrl:
      'https://readdy.ai/api/search-image?query=Candid%20photo%20taken%20at%20a%20telecom%20business%20hall%20desk%20showing%20the%20customer%20profile%20seated%20facing%20a%20service%20terminal%20screen%2C%20warm%20indoor%20ambient%20lighting%2C%20blurred%20modern%20office%20background%20with%20soft%20bokeh%2C%20realistic%20documentary%20photography%2C%20natural%20skin%20tones%2C%20high%20detail&width=800&height=560&seq=photo-scene-02&orientation=landscape',
    docPhotoUrl:
      'https://readdy.ai/api/search-image?query=Scanned%20back%20side%20of%20a%20Chinese%20resident%20identity%20card%20lying%20flat%20on%20a%20smooth%20light%20gray%20backdrop%2C%20printed%20national%20emblem%20and%20abstract%20text%20lines%2C%20soft%20diffused%20lighting%2C%20flat%20overhead%20view%2C%20crisp%20administrative%20scan%20without%20reflections%2C%20neutral%20tones%2C%20high%20detail&width=800&height=560&seq=photo-doc-02&orientation=landscape',
  },
  {
    customerName: '陶成成',
    docType: '港澳居民居住证',
    docNumber: '8100********1234',
    businessNumber: '18989354069',
    hallName: '宁波鄞州线上营业厅',
    operator: '李强',
    operatorNo: '318207',
    photoTime: '2026-04-09 16:35:08',
    source: '手机客户端',
    scenePhotoUrl:
      'https://readdy.ai/api/search-image?query=Candid%20photo%20at%20a%20bright%20telecom%20service%20counter%20with%20the%20customer%20holding%20a%20smart%20device%20while%20a%20staff%20member%20assists%2C%20side%20angle%20view%2C%20clean%20modern%20hall%20interior%20softly%20out%20of%20focus%2C%20realistic%20documentary%20style%2C%20cool%20natural%20daylight%2C%20sharp%20high%20detail&width=800&height=560&seq=photo-scene-03&orientation=landscape',
    docPhotoUrl:
      'https://readdy.ai/api/search-image?query=Scanned%20close-up%20of%20a%20Hong%20Kong%20Macao%20residence%20permit%20card%20placed%20flat%20on%20a%20clean%20white%20surface%2C%20printed%20Chinese%20characters%20and%20small%20portrait%20box%2C%20even%20soft%20studio%20lighting%2C%20top-down%20flat%20lay%2C%20sharp%20administrative%20document%20scan%2C%20neutral%20background%2C%20high%20detail&width=800&height=560&seq=photo-doc-03&orientation=landscape',
  },
];

export const defaultWorkOrderInfo: WorkOrderInfoDetail = {
  complaintContent:
    '客户反映2026年4月账单存在不明扣费项目，多扣50元增值服务费，要求核实并退费；同时反映营业厅办理业务等待时间过长，影响办理体验。',
  closingContent:
    '经核查，4月账单增值服务费系客户于线上渠道自主订购的增值业务产生，已向客户说明并协助退订，费用已原路退回；营业厅等待时间问题已安排主管回访致歉，客户表示接受处理结果。',
  remark: '客户为高价值集团客户，需重点关注满意度维系，后续办理业务建议优先安排专人对接。',
  salesProducts: defaultSalesProducts,
  paperlessDocuments: defaultPaperlessDocuments,
  cardReadRecords: defaultCardReadRecords,
  photoRecords: defaultPhotoRecords,
  demandSummary: '',
  demandL1: '',
  demandL2: '',
};

// 可按业务号码覆盖不同工单，未匹配时回退 defaultWorkOrderInfo
export const workOrderInfoMap: Record<string, WorkOrderInfoDetail> = {
  '18989354069': defaultWorkOrderInfo,
};

// 诉求总结 —— 一级 / 二级分类
export const demandCategories: DemandCategory[] = [
  {
    value: '费用争议',
    label: '费用争议',
    children: [
      { value: '账单异议', label: '账单异议' },
      { value: '超套餐费用', label: '超套餐费用' },
      { value: '增值业务扣费', label: '增值业务扣费' },
      { value: '退款延迟', label: '退款延迟' },
    ],
  },
  {
    value: '服务投诉',
    label: '服务投诉',
    children: [
      { value: '服务态度', label: '服务态度' },
      { value: '办理时长', label: '办理时长' },
      { value: '处理不及时', label: '处理不及时' },
      { value: '承诺未兑现', label: '承诺未兑现' },
    ],
  },
  {
    value: '网络质量',
    label: '网络质量',
    children: [
      { value: '信号覆盖', label: '信号覆盖' },
      { value: '上网速度', label: '上网速度' },
      { value: '通话质量', label: '通话质量' },
      { value: '频繁断网', label: '频繁断网' },
    ],
  },
  {
    value: '业务办理',
    label: '业务办理',
    children: [
      { value: '套餐变更', label: '套餐变更' },
      { value: '停机复机', label: '停机复机' },
      { value: '过户销户', label: '过户销户' },
      { value: '业务开通', label: '业务开通' },
    ],
  },
  {
    value: '合约争议',
    label: '合约争议',
    children: [
      { value: '违约金争议', label: '违约金争议' },
      { value: '合约期限', label: '合约期限' },
      { value: '优惠减免', label: '优惠减免' },
    ],
  },
];