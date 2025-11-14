export interface ApiProject {
  _id: string;
  key: string;
  name: string;
  environments: ApiEnvironment[];
}

export interface ApiEnvironment {
  _id: string;
  key: string;
  name: string;
}

export interface ApiFlag {
  archived: boolean;
  clientSideAvailability: {
    usingEnvironmentId: boolean;
    usingMobileKey: boolean;
  };
  customProperties: Record<string, any>;
  description: string;
  key: string;
  kind: "boolean" | "string" | "number" | "object" | "multivariate";
  name: string;
  variations: ApiVariation[];
}

export interface ApiVariation {
  _id: string;
  name: string;
  value: any;
}
