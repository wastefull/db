export interface ButtonInterface {
  icon: string;
  label: string;
  disabled?: boolean;
  active?: boolean;
}
export enum IconClass {
  CLOSE = 'fa-solid fa-xmark',
  MINIMIZE = 'fa-solid fa-window-minimize',
  MAXIMIZE = 'fa-solid fa-up-right-and-down-left-from-center',
}
export enum ButtonClass {
  CLOSE = 'red-button',
  MINIMIZE = 'yellow-button',
  MAXIMIZE = 'green-button',
}
export const defaultButtons: ButtonInterface[] = [
  { icon: IconClass.CLOSE, label: 'Close', active: true, disabled: false },
  {
    icon: IconClass.MINIMIZE,
    label: 'Minimize',
    active: true,
    disabled: false,
  },
  {
    icon: IconClass.MAXIMIZE,
    label: 'Maximize',
    active: true,
    disabled: false,
  },
];

export const noCloseButtons: ButtonInterface[] = [
  { icon: IconClass.CLOSE, label: 'Close', active: true, disabled: true },
  {
    icon: IconClass.MINIMIZE,
    label: 'Minimize',
    active: true,
    disabled: false,
  },
  {
    icon: IconClass.MAXIMIZE,
    label: 'Maximize',
    active: true,
    disabled: false,
  },
];
