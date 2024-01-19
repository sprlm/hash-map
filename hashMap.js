class HashMap {
  #loadFactor = 0.75;

  constructor() {
    this.bucketsSize = 16;
    this.bucketsArray = new Array(this.bucketsSize).fill(null).map(() => new Array().fill(null));
    this.currentLoad = 0;
  }

  #hash(string) {
    let hashCode = 0;
  
    const primeNumber = 31;

    for (let i = 0; i < string.length; i++) {
      hashCode = primeNumber * hashCode + string.charCodeAt(i);
    }
  
    return hashCode;
  };

  set(key, value) {
    // if load factor is reached, expand bucket size and rehash all previous contents
    if (this.currentLoad / this.bucketsSize >= this.#loadFactor) {
      let arrayValues = this.bucketsArray.flat(1);
      this.bucketsSize *= 2;
      this.bucketsArray = new Array(this.bucketsSize).fill(null).map(() => new Array().fill(null));
      this.currentLoad = 0;

      arrayValues.forEach((pair) => {
        this.set(...pair);
      });
    }

    let bucketIndex = this.#hash(key) % this.bucketsSize;
    
    // normally javascript allows indexing arrays past their size, this throws an error instead
    if (bucketIndex < 0 || bucketIndex >= this.bucketsSize) {
      throw new Error("Trying to access index out of bound");
    }
    
    // overwrite value if key already exists
    if (this.bucketsArray[bucketIndex] !== null) {
      for (let i = 0; i < this.bucketsArray[bucketIndex].length; i++) {
        if (this.bucketsArray[bucketIndex][i][0] === key) {
          this.bucketsArray[bucketIndex][i][1] = value;
          return;
        }
      }
    }

    // if key doesn't exist yet, add it and increment currentLoad 
    this.bucketsArray[bucketIndex].push([key, value]);
    this.currentLoad++;
  }

  get(key) {
    let bucket = this.bucketsArray[this.#hash(key) % this.bucketsSize];
    
    if (bucket !== null) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] == key) {
          return bucket[i][1];
        }
      }
    }

    return null;
  }

  has(key) {
    let bucket = this.bucketsArray[this.#hash(key) % this.bucketsSize];
    
    if (bucket !== null) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] == key) {
          return true;
        }
      }
    }

    return false;
  }

  remove(key) {
    let bucket = this.bucketsArray[this.#hash(key) % this.bucketsSize];
    
    if (bucket !== null) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] == key) {
          this.bucketsArray[this.#hash(key) % this.bucketsSize].splice(i, 1);
          this.currentLoad--;
          return true;
        }
      }
    }

    return false;
  }
}

let hm = new HashMap();

hm.set('a', 1);
hm.set('b', 2);
hm.set('c', 3);
hm.set('d', 4);
hm.set('e', 5);
