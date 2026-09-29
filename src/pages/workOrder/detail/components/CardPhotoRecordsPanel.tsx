import { useMemo, useState } from 'react';
import ImageZoomViewer from './ImageZoomViewer';
import type { CardReadRecord, PhotoRecord, KeyInfoImage } from '@/mocks/workOrderInfoData';

interface CardPhotoRecordsPanelProps {
  cardReadRecords: CardReadRecord[];
  photoRecords: PhotoRecord[];
}

const cardReadColumns = [
  { key: 'customerName', label: '客户姓名' },
  { key: 'docType', label: '证件类型' },
  { key: 'docNumber', label: '证件号码' },
  { key: 'operator', label: '操作人' },
  { key: 'operatorNo', label: '操作人工号' },
  { key: 'authTime', label: '认证使用时间' },
  { key: 'authMethod', label: '认证方式' },
  { key: 'status', label: '状态' },
] as const;

const photoTextColumns = [
  { key: 'customerName', label: '客户名称' },
  { key: 'docType', label: '证件类型' },
  { key: 'docNumber', label: '证件号码' },
  { key: 'businessNumber', label: '业务号码' },
  { key: 'hallName', label: '营业厅' },
  { key: 'operator', label: '操作人' },
  { key: 'operatorNo', label: '操作人工号' },
  { key: 'photoTime', label: '照片使用时间' },
  { key: 'source', label: '照片来源' },
] as const;

function SectionTitle({ color, title }: { color: string; title: string }) {
  return (
    <h4 className="text-sm font-semibold text-foreground-900 mb-3 flex items-center gap-2">
      <span className={`w-1 h-4 rounded-full ${color}`}></span>
      {title}
    </h4>
  );
}

function ThumbButton({ img, onZoom }: { img: KeyInfoImage; onZoom: () => void }) {
  return (
    <button
      type="button"
      onClick={onZoom}
      className="group relative w-16 h-11 rounded-md overflow-hidden border border-background-200 bg-background-50 cursor-pointer align-middle"
      title={`${img.title}（点击放大）`}
    >
      <img
        src={img.url}
        alt={img.title}
        title={img.title}
        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <i className="ri-zoom-in-line text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"></i>
      </span>
    </button>
  );
}

export default function CardPhotoRecordsPanel({
  cardReadRecords,
  photoRecords,
}: CardPhotoRecordsPanelProps) {
  const [sceneIndex, setSceneIndex] = useState<number | null>(null);
  const [docIndex, setDocIndex] = useState<number | null>(null);

  const sceneImages: KeyInfoImage[] = useMemo(
    () =>
      photoRecords.map((r) => ({
        title: `${r.customerName} · 现场照片`,
        url: r.scenePhotoUrl,
      })),
    [photoRecords]
  );

  const docImages: KeyInfoImage[] = useMemo(
    () =>
      photoRecords.map((r) => ({
        title: `${r.customerName} · 证件照片`,
        url: r.docPhotoUrl,
      })),
    [photoRecords]
  );

  return (
    <>
      <div className="space-y-6">
        {/* ── 读卡记录 ── */}
        <section>
          <SectionTitle color="bg-accent-500" title="读卡记录" />
          <div className="border border-background-100 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="bg-background-100 border-b border-background-100">
                    {cardReadColumns.map((col) => (
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
                  {cardReadRecords.length > 0 ? (
                    cardReadRecords.map((rec, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-background-50 last:border-0 hover:bg-background-50/50 transition-colors"
                      >
                        {cardReadColumns.map((col) => (
                          <td
                            key={col.key}
                            className="px-4 py-3 text-sm text-foreground-800 whitespace-nowrap"
                          >
                            {col.key === 'status' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                                <i className="ri-checkbox-circle-line"></i>
                                {rec.status}
                              </span>
                            ) : col.key === 'docNumber' || col.key === 'operatorNo' ? (
                              <span className="font-mono text-foreground-700">{rec[col.key]}</span>
                            ) : (
                              rec[col.key] || '\u2014'
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={cardReadColumns.length}
                        className="px-4 py-6 text-sm text-foreground-400 text-center"
                      >
                        暂无读卡记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 拍照记录 ── */}
        <section>
          <SectionTitle color="bg-secondary-500" title="拍照记录" />
          <div className="border border-background-100 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px]">
                <thead>
                  <tr className="bg-background-100 border-b border-background-100">
                    {photoTextColumns.map((col) => (
                      <th
                        key={col.key}
                        className="text-left text-xs font-medium text-foreground-500 px-4 py-3 whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="text-left text-xs font-medium text-foreground-500 px-4 py-3 whitespace-nowrap">
                      现场照片
                    </th>
                    <th className="text-left text-xs font-medium text-foreground-500 px-4 py-3 whitespace-nowrap">
                      证件照片
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {photoRecords.length > 0 ? (
                    photoRecords.map((rec, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-background-50 last:border-0 hover:bg-background-50/50 transition-colors"
                      >
                        {photoTextColumns.map((col) => (
                          <td
                            key={col.key}
                            className="px-4 py-3 text-sm text-foreground-800 whitespace-nowrap"
                          >
                            {col.key === 'docNumber' || col.key === 'operatorNo' || col.key === 'businessNumber' ? (
                              <span className="font-mono text-foreground-700">{rec[col.key]}</span>
                            ) : (
                              rec[col.key] || '\u2014'
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ThumbButton img={sceneImages[idx]} onZoom={() => setSceneIndex(idx)} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ThumbButton img={docImages[idx]} onZoom={() => setDocIndex(idx)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={photoTextColumns.length + 2}
                        className="px-4 py-6 text-sm text-foreground-400 text-center"
                      >
                        暂无拍照记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {sceneIndex !== null && (
        <ImageZoomViewer images={sceneImages} index={sceneIndex} onClose={() => setSceneIndex(null)} />
      )}
      {docIndex !== null && (
        <ImageZoomViewer images={docImages} index={docIndex} onClose={() => setDocIndex(null)} />
      )}
    </>
  );
}