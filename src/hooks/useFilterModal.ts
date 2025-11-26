import { useState, useCallback } from 'react';

// Types
import type { ICategory } from '@app/interfaces/categories';

interface IUseFilterModalProps {
  initialCategoryId?: string | null;
  categories: readonly ICategory[] | ICategory[];
  onApply: (categoryId: string | null, categoryName: string) => void;
}

interface IUseFilterModalReturn {
  isVisible: boolean;
  selectedCategoryId: string | null;
  openModal: () => void;
  closeModal: () => void;
  selectCategory: (categoryId: string | null) => void;
  applyFilter: () => void;
  clearFilter: () => void;
}

export const useFilterModal = ({
  initialCategoryId,
  categories,
  onApply,
}: IUseFilterModalProps): IUseFilterModalReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId ?? null,
  );

  const openModal = useCallback(() => {
    setSelectedCategoryId(initialCategoryId ?? null);
    setIsVisible(true);
  }, [initialCategoryId]);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const selectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const applyFilter = useCallback(() => {
    if (selectedCategoryId) {
      const category = categories.find(cat => cat.id === selectedCategoryId);

      onApply(selectedCategoryId, category?.name || '');
    } else {
      onApply(null, 'All Categories');
    }

    setIsVisible(false);
  }, [selectedCategoryId, categories, onApply]);

  const clearFilter = useCallback(() => {
    setSelectedCategoryId(null);
  }, []);

  return {
    isVisible,
    selectedCategoryId,
    openModal,
    closeModal,
    selectCategory,
    applyFilter,
    clearFilter,
  };
};
