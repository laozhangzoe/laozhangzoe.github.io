import { useState, useCallback } from 'react';
import { Search, History, Phone, X, ChevronRight } from 'lucide-react';
import AccountInfo from './components/AccountInfo';
import OverdueInfo from './components/OverdueInfo';
import OrderInfo from './components/OrderInfo';
import ComplaintInfo from './components/ComplaintInfo';
import { userProfiles, defaultUser } from '@/mocks/queryData';

const tabs = [
  { key: 'account', label: '账户信息' },
  { key: 'overdue', label: '欠费信息' },
  { key: 'order', label: '订单信息' },
  { key: 'complaint', label: '历史投诉单' },
];

const recentSearches = ['13800138000', '13900139000', '13700137000'];

export default function QueryPage() {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState<typeof defaultUser | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(recentSearches);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(() => {
    if (!inputValue.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const data = userProfiles[inputValue.trim() as keyof typeof userProfiles];
      setUserData(data || null);
      setHasSearched(true);
      setIsSearching(false);
      if (data && !searchHistory.includes(inputValue.trim())) {
        setSearchHistory((prev) => [inputValue.trim(), ...prev].slice(0, 5));
      }
    }, 400);
  }, [inputValue, searchHistory]);

  const handleQuickSearch = useCallback((num: string) => {
    setInputValue(num);
    setIsSearching(true);
    setTimeout(() => {
      const data = userProfiles[num as keyof typeof userProfiles];
      setUserData(data || null);
      setHasSearched(true);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearInput = () => {
    setInputValue('');
    setUserData(null);
    setHasSearched(false);
  };

  const renderTabContent = () => {
    if (!userData) return null;
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
      case 'order':
        return <OrderInfo data={userData.orderInfo} />;
      case 'complaint':
        return <ComplaintInfo data={userData.complaintInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-background-200 px-6 py-3 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-primary-500 rounded-lg">
          <Search size={18} className="text-white" />
        </div>
        <h1 className="text-lg font-semibold text-foreground-900">用户画像查询系统</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full md:w-[260px] lg:w-[280px] bg-white border-r border-background-200 flex flex-col shrink-0">
          <div className="p-5 border-b border-background-100">
            <label className="block text-sm font-medium text-foreground-700 mb-2">业务号码</label>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入业务号码查询"
                className="w-full pl-10 pr-9 py-2.5 text-sm border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400">
                <Phone size={16} />
              </div>
              {inputValue && (
                <button
                  onClick={clearInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !inputValue.trim()}
              className="w-full mt-3 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-background-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  查询中...
                </>
              ) : (
                <>
                  <Search size={16} />
                  查询用户画像
                </>
              )}
            </button>
          </div>

          {/* Quick Search History */}
          <div className="p-5 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <History size={16} className="text-foreground-400" />
              <span className="text-sm font-medium text-foreground-700">快速查询</span>
            </div>
            <div className="space-y-2">
              {searchHistory.map((num) => (
                <button
                  key={num}
                  onClick={() => handleQuickSearch(num)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground-700 hover:bg-background-50 transition-colors group"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-background-100 rounded-lg text-foreground-500 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors">
                    <Phone size={14} />
                  </div>
                  <span className="flex-1 text-left">{num}</span>
                  <ChevronRight size={14} className="text-foreground-300 group-hover:text-foreground-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {hasSearched && userData ? (
            <>
              {/* Tab Navigation */}
              <div className="bg-white border-b border-background-200 px-6">
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
              <div className="flex-1 overflow-auto p-6">
                {renderTabContent()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 flex items-center justify-center bg-background-100 rounded-2xl mx-auto mb-4">
                  <Search size={32} className="text-foreground-300" />
                </div>
                {hasSearched && !userData ? (
                  <>
                    <h3 className="text-lg font-medium text-foreground-900 mb-1">未找到用户</h3>
                    <p className="text-sm text-foreground-400">输入的业务号码 "{inputValue}" 未匹配到任何用户</p>
                    <p className="text-sm text-foreground-400 mt-1">您可以尝试以下号码：13800138000、13900139000、13700137000</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-foreground-900 mb-1">请输入业务号码</h3>
                    <p className="text-sm text-foreground-400">在左侧输入框中输入业务号码，点击查询即可查看用户画像</p>
                    <p className="text-sm text-foreground-400 mt-1">演示号码：13800138000、13900139000、13700137000</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}