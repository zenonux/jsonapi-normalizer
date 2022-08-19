// src/index.ts
var JsonapiNormalizer = class {
  static deserialize(response) {
    let { data, included, meta, links, errors } = response;
    if (errors) {
      return response;
    }
    let normalizedData = {};
    let includedMap = included && included.length > 0 ? getIncludedMap(included) : null;
    if (Array.isArray(data)) {
      normalizedData = data.map((v) => jsonapiToNormItem(v, includedMap));
    } else {
      normalizedData = jsonapiToNormItem(data, includedMap);
    }
    return {
      data: normalizedData,
      meta,
      links
    };
  }
};
function jsonapiToNormItem(item, includedMap) {
  let newItem = {
    id: item.id,
    ...item.attributes
  };
  let relationships = item.relationships || {};
  if (relationships && includedMap) {
    let relatedKeys = Object.keys(relationships).map((key) => {
      return {
        property: key,
        data: relationships[key].data
      };
    }).filter((v) => !Array.isArray(v.data) || v.data.length > 0);
    let newProps = getRelatedItem(includedMap, relatedKeys);
    Object.keys(newProps).forEach((v) => {
      newItem[v] = newProps[v];
    });
  }
  return newItem;
}
function getRelatedItem(map, keys) {
  let props = {};
  Object.keys(keys).forEach((k) => {
    if (Array.isArray(keys[k].data)) {
      props[keys[k].property] = [];
      keys[k].data.forEach((v) => {
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
function setIncluedRelationships(mapKey, map) {
  let mapValue = map[mapKey];
  if (mapValue._relationships) {
    Object.keys(mapValue._relationships).forEach((k) => {
      if (Array.isArray(mapValue._relationships[k])) {
        mapValue[k] = [];
        mapValue._relationships[k].forEach((v) => {
          mapValue[k].push(map[v]);
        });
      } else {
        let cachedMapKey = mapValue._relationships[k];
        mapValue[k] = map[cachedMapKey];
      }
    });
    delete mapValue._relationships;
  }
}
function getIncludedMap(included) {
  let map = {};
  for (let i = 0; i < included.length; i++) {
    let item = included[i];
    let key = item.type + "_" + item.id;
    map[key] = {
      id: item.id,
      ...item.attributes
    };
    let relationships = item.relationships || {};
    if (relationships) {
      Object.keys(relationships).forEach((k) => {
        let v = relationships[k].data;
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
export {
  JsonapiNormalizer as default
};
