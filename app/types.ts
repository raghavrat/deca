export interface Datashape {
  area: string;
  indicator: string;
  text: string;
  category: (
    | "MANAGMENT"
    | "MARKETING"
    | "FINANCE"
    | "HOSPITIALITY"
    | "ENTREPRENEUR"
  )[];
}

export interface GroupedData {
  [key: string]: Datashape[];
}

