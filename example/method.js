  /**
   * {{docDescription}}
{{docParams}}   * {{docReturns}}
   */
  
  async {{methodName}}({{methodArgs}}callback){
    let promise = new Promise((resolve, reject) => {
{{checkArgs}}
    
      this.cxn.query("{{statement}}", [{{paramItems}}], (error, results, fields) => {
        
        if( error ) return reject(error);
        
        if( results.length === 0 ) resolve(false);
        else if( results.length === 1 ){
          if( results[0].result !== undefined ){
            resolve(results[0].result);
          }
          else return resolve(results[0]);
        }
        else resolve(results);
      });
    });

    return promise;
  }