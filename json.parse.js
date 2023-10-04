function myJSONParse(jsonString) {
  // Regular expression patterns for different JSON elements
  const regexPatterns = {
    object: /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/,
    array: /\[(?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*\]/,
    string: /"(?:[^"\\]|\\.)*"/,
    number: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    boolean: /true|false/,
    null: /null/
  };
 
  function parseObject(jsonString) {
    // Extract the string representing the object
    const objectString = jsonString.match(regexPatterns.object)[0];
    // Remove the outer curly braces and trim whitespace
    const propertiesString = objectString.slice(1, -1).trim();
 
    if (propertiesString.length === 0) {
      return {};
    }
 
    // Split properties by comma
    const properties = propertiesString.split(',');
    const jsonObject = {};
 
    // Split each property into key and value
    properties.forEach(property => {
      const [key, value] = property.split(':');
      const parsedKey = parseValue(key.trim());
      const parsedValue = parseValue(value.trim());
      jsonObject[parsedKey] = parsedValue;
    });
 
    return jsonObject;
  }
 
  // Extract the string representing the array
  function parseArray(jsonString) {
    const arrayString = jsonString.match(regexPatterns.array)[0];
    // Remove the outer square brackets and trim whitespace
    const elementsString = arrayString.slice(1, -1).trim();
 
    if (elementsString.length === 0) {
      return [];
    }
 
    // Split elements by comma
    const elements = elementsString.split(',');
    const jsonArray = [];
 
    // Parse each element recursively
    elements.forEach(element => {
      const parsedElement = parseValue(element.trim());
      jsonArray.push(parsedElement);
    });
 
    return jsonArray;
  }
 
  function parseValue(valueString) {
    if (regexPatterns.object.test(valueString)) {
      return parseObject(valueString);
    } else if (regexPatterns.array.test(valueString)) {
      return parseArray(valueString);
    } else if (regexPatterns.string.test(valueString)) {
      return valueString.slice(1, -1).replace(/\\"/g, '"');
    } else if (regexPatterns.number.test(valueString)) {
      return parseFloat(valueString);
    } else if (regexPatterns.boolean.test(valueString)) {
      return valueString === 'true';
    } else if (regexPatterns.null.test(valueString)) {
      return null;
    } else {
      throw new Error('Invalid JSON value');
    }
  }
 
  // Remove leading/trailing whitespaces and check if the JSON string is empty
  jsonString = jsonString.trim();
  if (jsonString.length === 0) {
    throw new Error('Empty JSON string');
  }
 
  // Parse the JSON string
  return parseValue(jsonString);
}
  
const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
const jsonObject = myJSONParse(jsonString);
  
console.log(jsonObject); // Should output the parsed JavaScript object.


  