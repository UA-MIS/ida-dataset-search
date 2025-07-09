export const useModal = (name: string) => {
  const modal = document.getElementById(name) as HTMLDialogElement;
  modal?.showModal();
};
