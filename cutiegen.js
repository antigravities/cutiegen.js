const fs = require("fs");

console.log("Generating...");

function easyReplace(needle, replace, haystack){
  return haystack.split(needle).join(replace);
}

var file = fs.readFileSync(process.argv[2]).toString().split("\r\n--\r\n");
var template = fs.readFileSync("method.js");

var methods = [];

file.forEach((v) => {
  v = v.split("\n");
  
  let methodName = v[0].trim();
  let docDescription = v[1].trim();
  
  let params;
  if( v[2].trim() == "" ) params = [];
  else params = v[2].trim().split("||");
  
  let docReturns = "@return {Promise} " + v[3].trim();
  let statement = v[4].trim();
  
  let paramNames = [];
  let paramTypes = [];
  let paramDescriptions = [];
  
  params.forEach((w) => {
    w = w.split("~");
    
    let name = w[0].split(" ")[0];
    let type = w[0].split(" ")[1];
    let description = w[1];
    
    paramNames.push(name);
    paramTypes.push((type == "int") ? "number" : type);
    paramDescriptions.push(description);
  });
  
  let docParams = [];
  paramNames.forEach((w,k) => {
    docParams.push("   * @param " + w + " {" + paramTypes[k] + "} - " + paramDescriptions[k]);
  });
  if( docParams.length > 0 ) docParams = docParams.join("\n") + "\n";
  else docParams = "";
  
  let methodArgs;
  let paramItems;
  if( paramNames.length > 0 ){
    methodArgs = paramNames.join(", ") + ", ";
    paramItems = paramNames.join(", ");
  } else {
    methodArgs = "";
    paramItems = "";
  }
  
  let checkArgs = "";
  
  paramNames.forEach((w,k) => {
    checkArgs = "      if( typeof " + w + " != \"" + paramTypes[k] + "\" ) reject(\"" + w + " is not a " + paramTypes[k] + " [" + methodName + "]\");";
  });
  
  var method = (" " + template).slice(1);
  method = easyReplace("{{methodName}}", methodName, method);
  method = easyReplace("{{docDescription}}", docDescription, method);
  method = easyReplace("{{docReturns}}", docReturns, method);
  method = easyReplace("{{statement}}", statement, method);
  method = easyReplace("{{docParams}}", docParams, method);
  method = easyReplace("{{methodArgs}}", methodArgs, method);
  method = easyReplace("{{paramItems}}", paramItems, method);
  method = easyReplace("{{checkArgs}}", checkArgs, method);
  
  methods.push(method);
});

var header = fs.readFileSync("header.js");
var footer = fs.readFileSync("footer.js");

fs.writeFileSync(process.argv[3], header + methods.join("\n\n") + footer);

console.log("Done, generated " + methods.length + " methods");
