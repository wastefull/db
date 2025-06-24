import {
  ButtonInterface,
  defaultButtons,
  noCloseButtons,
} from './status-bar/window-buttons/button';

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  buttons: ButtonInterface[];
  activeButton?: string;
  content?: any; // This can be a component or any other content type
}

export const defaultWindow: AppWindow = {
  id: '0',
  title: 'Search',
  icon: '',
  isActive: true,
  isMinimized: false,
  isMaximized: false,
  buttons: noCloseButtons,
  activeButton: '',
  content: 'This is the default content of the window.',
};

export function generateWindow(title: string): AppWindow {
  return {
    ...defaultWindow,
    id: `window-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
    title: title,
    icon: 'default-icon', // Placeholder for an icon
    content: 'Loading ' + title + ' content...',
    isActive: false,
    buttons: defaultButtons,
  };
}
export function sampleWindows(): AppWindow[] {
  return [
    generateWindow('Window 1'),
    generateWindow('Window 2'),
    generateWindow('Window 3'),
    generateWindow('Window 4'),
  ];
}
