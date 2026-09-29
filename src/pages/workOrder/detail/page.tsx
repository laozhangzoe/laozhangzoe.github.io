import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Globe } from 'lucide-react';
import AccountInfo from '../../query/components/AccountInfo';
import OverdueInfo from '../../query/components/OverdueInfo';
import ComplaintInfo from '../../query/components/ComplaintInfo';
import WorkOrderInfoTab from '@/pages/workOrder/detail/components/WorkOrderInfoTab';
import { userProfiles } from '@/mocks/queryData';
import { userProfilesExtra } from '@/mocks/queryDataExtra';

const allUserProfiles = { ...userProfilesExtra, ...userProfiles };

const tabs = [
  { key: 'workorder', label: '工单信息' },
  { key: 'account', label: '账户信息' },
  { key: 'overdue', label: '欠费信息' },
  { key: 'complaint', label: '历史投诉单' },
];

export default function WorkOrderDetailPage() {
  const { businessNumber } = useParams<{ businessNumber: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workorder');

  const userData = businessNumber ? allUserProfiles[businessNumber as keyof typeof allUserProfiles] : null;

  const renderTabContent = () => {
    if (activeTab === 'workorder') {
      return <WorkOrderInfoTab businessNumber={businessNumber || ''} />;
    }
    if (!userData) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-foreground-400">未找到该业务号码的用户数据</p>
            <p className="text-sm text-foreground-400 mt-1">业务号码: {businessNumber}</p>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case 'account':
        return (
          <AccountInfo
            accountInfo={userData.accountInfo}
            overdueInfo={userData.overdueInfo}
            orderInfo={userData.orderInfo}
            complaintInfo={userData.complaintInfo}
          />
        );
      case 'overdue':
        return <OverdueInfo data={userData.overdueInfo} />;
      case 'complaint':
        return <ComplaintInfo data={userData.complaintInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-background-200 px-4 py-3 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-foreground-600">
            <Menu size={20} />
          </div>
          <span className="text-sm text-foreground-700">客服工单</span>
        </div>
      </header>

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
          {/* Back Header */}
          <div className="bg-white rounded-lg border border-background-200 px-4 py-3 mb-4 flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>返回列表</span>
            </button>
            <div className="w-px h-4 bg-background-200"></div>
            <span className="text-sm text-foreground-500">业务号码</span>
            <span className="text-sm font-semibold text-foreground-900">{businessNumber}</span>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-background-200 rounded-lg px-4 mb-4">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.key ? 'text-primary-600' : 'text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto bg-white rounded-lg border border-background-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}