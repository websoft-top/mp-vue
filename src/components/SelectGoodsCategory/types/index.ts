/**
 * 行业类型
 */
export interface IndustryData {
  label: string;
  value: string;
  children?: {
    value: string;
    label: string;
    children?: {
      value: string;
      label: string;
    }[];
  }[];
}
