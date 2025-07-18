import { useCallback, useState } from 'react';

export const useImageViewer = () => {
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const openImageViewer = useCallback((index: number) => {
    setImageIndex(index);
    setViewerVisible(true);
  }, []);

  const closeImageViewer = useCallback(() => {
    setViewerVisible(false);
  }, []);

  return {
    isViewerVisible,
    imageIndex,
    openImageViewer,
    closeImageViewer,
    setImageIndex,
  };
};
