/** CLI metadata derived from the pinned Trello OpenAPI document. */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Parameter = {
  name: string;
  location: "path" | "query" | "file";
  required: boolean;
  type?: string;
  description?: string;
};

export type JsonBody = {
  required: boolean;
  requiredFields: string[];
  fields: string[];
};

export type Endpoint = {
  task: string;
  method: HttpMethod;
  path: string;
  summary: string;
  parameters: Parameter[];
  jsonBody?: JsonBody;
  download?: boolean;
};
