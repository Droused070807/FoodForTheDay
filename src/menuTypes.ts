export interface MenuItem {
    id: string;
    name: string;
    calories: number;
    ingredients: string;
    filters: {
      name: string;
      icon: boolean;
      remoteFileName?: string | null;
    }[];
    nutrients: {
      name: string;
      value: string;
      uom: string;
    }[];
  }
  
  export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
  }
  
  export interface PeriodMenu {
    period: {
      id: string;
      name: string;
    };
    categories: MenuCategory[];
  }
  