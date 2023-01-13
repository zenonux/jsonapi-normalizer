type Payloads = {
  id: string;
  type: string;
};
type DataIncluedItem = Payloads & {
  attributes: Record<string, any>;
  relationships?: Record<
    string,
    {
      data: Payloads | Payloads[];
    }
  >;
};
type NormalizedDataItem = Record<string, any>;

type JsonapiResponse = {
  data: DataIncluedItem | DataIncluedItem[];
  errors?: any;
  included?: DataIncluedItem[];
  meta?: Record<string, any>;
  links?: Record<string, any>;
};

type NormalizedResponse = {
  data: NormalizedDataItem | NormalizedDataItem[];
  meta?: Record<string, any>;
  links?: Record<string, any>;
};

function isJsonApiResponse(response: any) {
  if (!response.data || response.errors) {
    return false;
  }
  if (response.data instanceof Array && response.data[0] && response.data[0].attributes) {
    return true;
  }
  if (response.data instanceof Object && response.data.attributes) {
    return true
  }
  return false
}

export default class JsonapiNormalizer {
  static deserialize(response: JsonapiResponse): NormalizedResponse {
    let { data, included, meta, links } = response;
    if (!isJsonApiResponse(response)) {
      return response;
    }
    let normalizedData = {};
    let includedMap =
      included && included.length > 0 ? getIncludedMap(included) : null;
    if (Array.isArray(data)) {
      normalizedData = data.map((v) => jsonapiToNormItem(v, includedMap));
    } else {
      normalizedData = jsonapiToNormItem(data, includedMap);
    }
    return {
      data: normalizedData,
      meta,
      links,
    };
  }
}

function jsonapiToNormItem(
  item: DataIncluedItem,
  includedMap: Record<string, any> | null
): NormalizedDataItem {
  let newItem: Record<string, any> = {
    // 注意不要有id冲突的问题
    id: item.id,
    //移除非必要的type属性
    ...item.attributes,
  };
  let relationships = item.relationships || {};
  if (relationships && includedMap) {
    let relatedKeys = Object.keys(relationships)
      .map((key) => {
        return {
          property: key,
          data: relationships[key].data,
        };
      })
      .filter((v) => !Array.isArray(v.data) || v.data.length > 0);
    let newProps = getRelatedItem(includedMap, relatedKeys);
    Object.keys(newProps).forEach((v) => {
      newItem[v] = newProps[v];
    });
  }
  return newItem;
}

type RelatedKey = {
  property: string;
  data: Payloads | Payloads[];
};

// 仅实现included下一层relationships,data下一层relationships
function getRelatedItem(map: Record<string, any>, keys: RelatedKey[]) {
  let props: Record<string, any> = {};
  Object.keys(keys).forEach((k) => {
    if (Array.isArray(keys[k].data)) {
      props[keys[k].property] = [];
      keys[k].data.forEach((v: Payloads) => {
        let mapKey = v.type + "_" + v.id;
        props[keys[k].property].push(map[mapKey]);
        setIncluedRelationships(mapKey, map);
      });
    } else {
      let mapKey = keys[k].data.type + "_" + keys[k].data.id;
      props[keys[k].property] = map[mapKey];
      setIncluedRelationships(mapKey, map);
    }
  });
  return props;
}

function setIncluedRelationships(mapKey: string, map: Record<string, any>) {
  let mapValue = map[mapKey];
  if (mapValue._relationships) {
    Object.keys(mapValue._relationships).forEach((k) => {
      if (Array.isArray(mapValue._relationships[k])) {
        mapValue[k] = [];
        mapValue._relationships[k].forEach((v: any) => {
          mapValue[k].push(map[v]);
        });
      } else {
        let cachedMapKey = mapValue._relationships[k];
        mapValue[k] = map[cachedMapKey];
      }
    });
    // 移除用于缓存的_relationships属性
    delete mapValue._relationships;
  }
}

function getIncludedMap(included: DataIncluedItem[]) {
  let map = {};
  for (let i = 0; i < included.length; i++) {
    let item = included[i];
    let key = item.type + "_" + item.id;
    map[key] = {
      // 注意不要有id冲突的问题
      id: item.id,
      //移除非必要的type属性
      ...item.attributes,
    };
    let relationships = item.relationships || {};
    if (relationships) {
      Object.keys(relationships).forEach((k) => {
        let v = relationships[k].data;
        // 缓存relationships的mapKey
        map[key]._relationships = map[key]._relationships || {};
        if (Array.isArray(v)) {
          map[key]._relationships[k] = [];
          v.forEach((pv) => {
            map[key]._relationships[k].push(pv.type + "_" + pv.id);
          });
        } else {
          map[key]._relationships[k] = v.type + "_" + v.id;
        }
      });
    }
  }
  return map;
}
