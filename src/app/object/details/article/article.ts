export interface Article {
  id: string;
  body: string;
  title: string;
  author: string;
  created: string;
  targets: string[];
  updated: string;
  source_table: string;
  target_names: string[];
}
export const defaultArticle: string = `Articles will cover the uses of the object, as well as potential issues
    its decomposition (or lack thereof) can create. Below will be cards for
    the object's compostability, recyclability, reuseability, possible hazards,
    ecological role, and a showcase of examples of its creative reuse.`;