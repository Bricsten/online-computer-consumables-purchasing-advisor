import { create } from 'zustand';

interface ReviewModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useReviewModalStore = create<ReviewModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useReviewModalStore; 