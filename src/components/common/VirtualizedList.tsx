import React from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { Box } from '@mantine/core';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
}: VirtualizedListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start || 0 : 0;
  // const paddingBottom = virtualItems.length > 0
  //   ? virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1].end || 0)
  //   : 0

  return (
    <Box
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${paddingTop}px)`,
          }}
        >
          {virtualItems.map((virtualItem: VirtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                height: `${virtualItem.size}px`,
                width: '100%',
              }}
            >
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}
