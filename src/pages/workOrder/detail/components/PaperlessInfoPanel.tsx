import { useState } from 'react';
import ImageZoomViewer from './ImageZoomViewer';
import type { PaperlessDocument, KeyInfoImage } from '@/mocks/workOrderInfoData';

interface PaperlessInfoPanelProps {
  paperlessDocuments: PaperlessDocument[];
}

export default function PaperlessInfoPanel({ paperlessDocuments }: PaperlessInfoPanelProps) {
  const docs = paperlessDocuments || [];
  const active = docs[0];
  const keyPages: KeyInfoImage[] = active?.keyPages ?? [];
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  if (!active) {
    return <p className="text-sm text-foreground-400 py-2">暂无无纸化文件</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 右侧 PDF 预览（铺满） */}
        <div className="flex flex-col h-[560px] border border-background-200 rounded-lg overflow-hidden bg-background-50">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-background-100 shrink-0">
            <div className="flex items-start gap-2.5 min-w-0">
              <i className="ri-file-pdf-2-line text-primary-600 text-lg mt-0.5"></i>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground-900 truncate">{active.fileName}</h4>
                <p className="text-xs text-foreground-400 truncate mt-0.5">
                  {active.fileNo} · {active.fileSize} · 更新于 {active.updateTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={active.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 h-8 rounded-md text-xs font-medium text-foreground-600 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-external-link-line"></i>
                新窗口打开
              </a>
            </div>
          </div>
          <iframe
            src={active.fileUrl}
            title={active.fileName}
            className="w-full flex-1 border-0 bg-background-100"
          />
        </div>

        {/* 客户登记单重点页面缩略图 */}
        {keyPages.length > 0 && (
          <div className="border border-background-200 rounded-lg bg-background-50 p-4">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="w-6 h-6 flex items-center justify-center rounded-md bg-accent-100">
                <i className="ri-image-2-line text-sm text-accent-700"></i>
              </span>
              <h4 className="text-sm font-semibold text-foreground-900 whitespace-nowrap">
                客户登记单重点页面
              </h4>
              <span className="text-xs text-foreground-400">点击缩略图可查看大图</span>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {keyPages.map((img, idx) => (
                <button
                  key={img.title}
                  type="button"
                  onClick={() => setZoomIndex(idx)}
                  className="group flex flex-col gap-2 cursor-pointer text-left"
                  title={`${img.title}（点击放大）`}
                >
                  <span className="relative block w-28 h-40 md:w-32 md:h-44 rounded-lg overflow-hidden border border-background-200 bg-white">
                    <img
                      src={img.url}
                      alt={img.title}
                      title={img.title}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <i className="ri-zoom-in-line text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {zoomIndex !== null && keyPages.length > 0 && (
        <ImageZoomViewer images={keyPages} index={zoomIndex} onClose={() => setZoomIndex(null)} />
      )}
    </>
  );
}