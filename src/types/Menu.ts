export interface MenuResponse {
    id: string;
    locationId: string;
    date: string;
    period: Period;
  }
  
  export interface Period {
    id: string;
    name: string;
    slug: string | null;
    categories: Category[];
  }
  
  export interface Category {
    id: string;
    name: string;
    sortOrder: number;
    items: MenuItem[];
  }
  
  export interface MenuItem {
    id: string;
    name: string;
    mrn: number;
    rev: string | null;
    mrnFull: string;
    desc: string;
    webtritionId: string | null;
    sortOrder: number;
    portion: string | null;
    qty: number | null;
    ingredients: string | null;
    calories: number;
    customAllergens: unknown[];
    nutrients: Nutrient[];
    filters: Filter[];
  }
  
  export interface Nutrient {
    id: string | null;
    name: string;
    value: string;
    uom: string;
    valueNumeric: string;
  }
  
  export interface Filter {
    id: string;
    name: string;
    icon: boolean;
    remoteFileName: string | null;
    sectorIconId: string | null;
    customIcons: string[];
  }
  