function shallowTypeChecker(obj1: Record<string, any>, obj2: Record<string, any>):boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (!(key in obj2) || typeof obj1[key] !== typeof obj2[key]) {
        return false;
      }
    }
  
    return true;
  }