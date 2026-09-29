import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { KeyInfoImage } from '@/mocks/workOrderInfoData';

interface ImageZoomViewerProps {
  images: KeyInfoImage[];
  index: number;
  onClose: () => void;
}

export default function ImageZoomViewer({ images, index, onClose }: ImageZoomViewerProps) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    setCurrent(index);
  }, [index]);

  if (!images[current]) return null;

  const step = (delta: number) => {
    setCurrent((c) => (c + delta + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 h-[85vh] flex flex-col border border-background-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-background-100 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <i className="ri-image-2-line text-accent-600 text-lg"></i>
            <h4 className="text-sm font-semibold text-foreground-900 truncate">{images[current].title}</h4>
            <span className="text-xs text-foreground-400 shrink-0">
              {current + 1} / {images.length}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={images[current].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-md text-xs font-medium text-foreground-600 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line"></i>
              新窗口打开
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-100 transition-colors text-foreground-500 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="relative flex-1 bg-background-100 flex items-center justify-center overflow-hidden">
          <img
            src={images[current].url}
            alt={images[current].title}
            title={images[current].title}
            className="max-w-full max-h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => step(-1)}
                className="absolute left-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-foreground-800 transition-colors cursor-pointer"
                title="上一张"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              <button
                onClick={() => step(1)}
                className="absolute right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-foreground-800 transition-colors cursor-pointer"
                title="下一张"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}