declare type Payloads = {
    id: string;
    type: string;
};
declare type DataIncluedItem = Payloads & {
    attributes: Record<string, any>;
    relationships?: Record<string, {
        data: Payloads | Payloads[];
    }>;
};
declare type NormalizedDataItem = Record<string, any>;
declare type JsonapiResponse = {
    data: DataIncluedItem | DataIncluedItem[];
    errors?: any;
    included?: DataIncluedItem[];
    meta?: Record<string, any>;
    links?: Record<string, any>;
};
declare type NormalizedResponse = {
    data: NormalizedDataItem | NormalizedDataItem[];
    meta?: Record<string, any>;
    links?: Record<string, any>;
};
declare class JsonapiNormalizer {
    static deserialize(response: JsonapiResponse): NormalizedResponse;
}

export { JsonapiNormalizer as default };
