/** CLI metadata derived from the pinned Trello OpenAPI document. */
export type Parameter = {
  name: string;
  location: "path" | "query";
  required: boolean;
  type?: string;
  description?: string;
};

export type Endpoint = {
  task: string;
  path: string;
  summary: string;
  parameters: Parameter[];
  download?: boolean;
};
