export type AreaItem = {
  id: string;
  label: string;
};

export type AreaGroup = {
  id: string;
  label: string;
  items: AreaItem[];
};

// パターンA: { groups: AreaGroup[] }
// パターンB: AreaItem[]
export type AreasMaster = { groups: AreaGroup[] } | AreaItem[];
