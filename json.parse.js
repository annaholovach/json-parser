const {Stack} = require('../data-structures/stack')

function myJSONParse(jsonString) {
  if (typeof jsonString !== 'string') {
        throw Error('Invalid input parameter')
  }

  // Define a regular expression to match JSON elements
  const regex = /(\[)|(\])|(\{)|(\})|(\:)|(,)|(null)\b|(true)\b|(false)\b|(-?\d+(?:\.\d+)?)|(\"(?:\\\"|[^\"])*\")|([^\[\]{}:,\"\s]+)/g
  // Initialize a stack to keep track of nested objects and arrays
  let stack = new Stack()

  // Initialize variables to keep track of the current object, key, and final result
  let currentObj = null
  let key = null
  let result = null

  // Use matchAll to find and iterate through JSON elements in the input string
  Array.from(jsonString.matchAll(regex)).map((element) => {
    switch (element[0]) {
      case '{':
        // If a new object is encountered, create it and handle nesting
        if (currentObj === null) {
          currentObj = {}
          break
        }

        // Create a new object, add it as a field in the current object, and update currentObj
        const newObj = {}
        addField(currentObj, key, newObj)
        key = null
        stack.push(currentObj)
        currentObj = newObj
        break
      case '}':
        // When closing a nested object, pop the stack and set result if necessary
        currentObj = stack.pop() || currentObj
        result = currentObj
        break
      case ':':
        // Check if a key-value pair is being formed and handle errors
        if (key === null) {
          throw new SyntaxError(`Unexpected token : in JSON at position ${element.index}`)
        }
        break
      case ',':
        // Handle commas (no specific action needed)
        break
      case '[':
        // If a new array is encountered, create it and handle nesting
        const newArray = []
        addField(currentObj, key, newArray)
        key = null
        stack.push(currentObj)
        currentObj = newArray
        break
      case ']':
        // When closing a nested array, pop the stack
        currentObj = stack.pop() || currentObj
        break
      default:
        // Handle JSON primitive values (null, true, false, numbers, strings)
        let value = convertJSONPrimitive(element)

        if (Array.isArray(currentObj)) {
          // If inside an array, push the value to it
          currentObj.push(value)
        } else if (key === null) {
          // If a key is not set, set it as the current element
          key = element[0].slice(1, element[0].length - 1)
        } else {
          // Set the key-value pair in the current object
          currentObj[key] = value
          key = null
        }
    }
  })

  // Check for an incomplete JSON structure
  if (!stack.isEmpty()) {
    throw new SyntaxError('Unexpected end of JSON input')
  }

  // Return the parsed JSON object
  return result
}

function convertJSONPrimitive(element) {
  if (element[0] === 'true') {
    return true
  } else if (element[0] === 'false') {
    return false
  } else if (element[0] === 'null') {
    return null
  } else if (!Number.isNaN(parseInt(element[0]))) {
    return parseFloat(element[0])
  } else if (element[0] === '{') {
    return {}
  } else {
    return element[0].slice(1, element[0].length - 1)
  }
}

function addField(obj, key, value) {
  if (Array.isArray(obj)) {
    // If the 'obj' is an array, 'value' is pushed to the array
    obj.push(value)
  } else {
    // If 'obj' is an object, 'value' is added as a property with the specified 'key'
    obj[key] = value
  }
}

  
const jsonString = `{
  "id": "647ceaf3657eade56f8224eb",
  "index": 10,
  "negativeIndex": -10,
  "anEmptyArray": [],
  "notEmptyArray": [1, 2, 3,"string", true, null],
  "boolean": true,
  "nullValue": null,
  "nestedObject": {
      "nestedString": "Hello World",
      "nestedNumber": 42,
      "nestedArray": [true, false]
  },
  "complexArray": [
      {
          "name": "Alice Alice",
          "age": 28,
          "hobbies": ["Reading", "Painting"]
      },
      {
          "name": "Bob Bob",
          "age": 32,
          "hobbies": ["Gaming", "Cooking"]
      }
  ]
}`;

const jsonObject = myJSONParse(jsonString);
  
// Demonstration usage
console.log(jsonObject); // Should output the parsed JavaScript object
console.log(jsonObject.complexArray[1].hobbies); 


  