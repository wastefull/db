import { Type } from '@angular/core';
import { SearchComponent } from '../../search/search.component';
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
  content?: any;
  outlet?: string;
  component?: Type<any>; // any Angular component
  componentData?: any; // data —> component
}

export const defaultWindow: AppWindow = {
  id: 'search',
  title: 'Search',
  icon: 'fa-search',
  isActive: true,
  isMinimized: false,
  isMaximized: false,
  buttons: noCloseButtons,
  component: SearchComponent,
};

export function generateWindow(title: string): AppWindow {
  return {
    ...defaultWindow,
    id: `window-${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    icon: 'default-icon', // Placeholder for an icon
    content: 'Loading ' + title + ' content...',
    isActive: false,
    buttons: defaultButtons,
  };
}
