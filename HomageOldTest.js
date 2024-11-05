//const hash = 'a43754a07900e03d83d2227a96b3f9d5570ef42e0fae86c84b3efb05c9cf46be'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charLength = chars.length;

function makeHashSeed(length) {
  let hashSeed = '';
  let counter = 0;
  while (counter < length) {
    hashSeed += chars.charAt(Math.floor(Math.random() * charLength));
    counter += 1;
  }
  return hashSeed;
}

function makeHash(string) {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
}

function sha256(ascii) {
  function rightRotate(value, amount) {
      return (value>>>amount) | (value<<(32 - amount));
  };
  
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length'
  var i, j; // Used as a counter across the whole file
  var result = ''

  var words = [];
  var asciiBitLength = ascii[lengthProperty]*8;
  
  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  var hash = sha256.h = sha256.h || [];
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  var k = sha256.k = sha256.k || [];
  var primeCounter = k[lengthProperty];
  /*/
  var hash = [], k = [];
  var primeCounter = 0;
  //*/

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
          for (i = 0; i < 313; i += candidate) {
              isComposite[i] = candidate;
          }
          hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
          k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
      }
  }
  
  ascii += '\x80' // Append Ƈ' bit (plus zero padding)
  while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j>>8) return; // ASCII check: only accept characters in range 0-255
      words[i>>2] |= j << ((3 - i)%4)*8;
  }
  words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
  words[words[lengthProperty]] = (asciiBitLength)
  
  // process each chunk
  for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
      var oldHash = hash;
      // This is now the undefinedworking hash", often labelled as variables a...g
      // (we have to truncate as well, otherwise extra entries at the end accumulate
      hash = hash.slice(0, 8);
      
      for (i = 0; i < 64; i++) {
          var i2 = i + j;
          // Expand the message into 64 words
          // Used below if 
          var w15 = w[i - 15], w2 = w[i - 2];

          // Iterate
          var a = hash[0], e = hash[4];
          var temp1 = hash[7]
              + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
              + ((e&hash[5])^((~e)&hash[6])) // ch
              + k[i]
              // Expand the message schedule if needed
              + (w[i] = (i < 16) ? w[i] : (
                      w[i - 16]
                      + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                      + w[i - 7]
                      + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                  )|0
              );
          // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
          var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
              + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
          
          hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
          hash[4] = (hash[4] + temp1)|0;
      }
      
      for (i = 0; i < 8; i++) {
          hash[i] = (hash[i] + oldHash[i])|0;
      }
  }
  
  for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
          var b = (hash[i]>>(j*8))&255;
          result += ((b < 16) ? 0 : '') + b.toString(16);
      }
  }
  console.log(result)
  return result;
};

const hashSeed = makeHashSeed(64)
var hash = sha256(hashSeed)

console.log(hashSeed)
console.log(hash)

const hashPairs = [];
for (let j = 0; j < 32; j++) {
  hashPairs.push(hash.slice(2 + (j * 2), 4 + (j * 2)));
}
const decPairs = hashPairs.map(x => {
  return parseInt(x, 16);
});

S=Uint32Array.from([0,1,s=t=2,3].map(i=>parseInt(hash.substr(i*8+2,8),16)));R=_=>(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=s=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(s>>>19),S[0]/2**32);

const seed = parseInt(hash.slice(2,16), 16);

let rnd_callCount = 0

function rnd(min, max) {
  const rand = R();
  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }
    rnd_callCount += 1;
    return rand * (max - min) + min;
  }
}

function w(val) {if (val == null) return width;return width * val;}
function h(val) {if (val == null) return height;return height * val;}

/// fake tD object to test ipfs connection
const depData = {
	externalAssetDependencies: [
	  {
    cid: "QmXZAMSbkVg2mBLaFBSz7JU8KVbdP61kiBJuBczFuhWjES",
    // new filebase CiD
    // cid: "QmcLyeGKHwTESLeHK8PtynsiMK4ySbovXF67vHwtd4XAXa",
    // updated filebase cid:
    // cid: "QmW6iLdCHEeJcidjjfKyfo6KYaMiHYK2TxBQAj5TBs3NxA",
    // updated filebase cid 9/12/2024:
    // cid: "bafybeiesua62ncqyb65gjm2kgna4xcrrr7sdufcdejyentytdky2k2q4q4",
	
		dependency_type: "ipfs"
	  },
	],
  preferredIPFSGateway:"https://black-indirect-dragon-602.mypinata.cloud"
  // preferredIPFSGateway:"https://homage2024.myfilebase.com"
  // preferredIPFSGateway:"https://ipfs.filebase.io/ipfs/"
}


///// mimicking tD object for ipfs test
const gateway = depData.preferredIPFSGateway;
const content = depData.externalAssetDependencies[0].cid;
const hostType  = depData.externalAssetDependencies[0].dependency_type;


// //********************** *****************************************************************+
// const gateway = tokenData.preferredIPFSGateway;
// const hostType = tokenData.externalAssetDependencies[0].dependency_type;
// const content = tokenData.externalAssetDependencies[0].cid;

const directory = gateway + '/' + hostType + '/' + content;


const themes = {
  rococo: {
    name: 'rococo',
    bgColors: {
      bgCol1: [200,222,252],
      bgCol2: [252,195,203],
      bgCol2: [255,255,212],
      bgCol4: [245,227,130]
    },
    flowers_B: {
      fileLocation: directory + '/_rococo/flowers_B',
      num: 9,
      maxNum: 32
    },
    flowers_F: {
      fileLocation: directory + '/_rococo/flowers_F',
      num: 20,
      maxNum: 60
    },
    flowers: {
      fileLocation: directory + '/_rococo/flowers',
      num: 10,
      maxNum: 12
    },
    bigFlowers: {
      fileLocation: directory + '/_rococo/bigFlowers',
      num: 1,
      maxNum: 9
    },
    paint: {
      fileLocation: directory + '/_rococo/paint',
      num: 6,
      maxNum: 14
    },
    paintLG: {
      fileLocation: directory + '/_rococo/paintLG',
      num: 4,
      maxNum: 9
    },
    texture: {
      fileLocation: directory + '/_rococo/textures',
      num: 4,
      maxNum: 14
    },
    fullTexture: {
      fileLocation: directory + '/_rococo/fullTextures',
      maxNum: 36
    },
    floor: {
      fileLocation: directory + '/_rococo/floors',
      num: 1,
      maxNum: 12
    },
    vase: {
      fileLocation: directory + '/_rococo/vases',
      num: 1,
      maxNum: 13
    },
    // vaseFlowers: {
    //   fileLocation: '/_rococo/vaseFlowers',
    //   num: 4,
    //   maxNum: 5
    // },
    vaseFlowersB: {
      fileLocation: directory + '/_rococo/vaseFlowers/_B',
      num: 1,
      maxNum: 10
    },
    vaseFlowersF: {
      fileLocation: directory + '/_rococo/vaseFlowers/_F',
      num: 2,
      maxNum: 14
    },
    colors: {
      a: [200,222,252],
      b: [251,234,236],
      c: [254,255,235],
      d: [245,227,130]
    }
  },

  countryGarden: {
    name: 'countryGarden',
    bgColors: {
      bgCol1: [242,231,227],
      bgCol2: [224,203,166],
      bgCol2: [138,133,105],
      bgCol4: [187,180,193]
    },
    flowers_B: {
      fileLocation: directory + '/_countryGarden/flowers_B',
      num: 9,
      maxNum: 50
    },
    flowers_F: {
      fileLocation: directory + '/_countryGarden/flowers_F',
      num: 20,
      maxNum: 48
    },
    bigFlowers: {
      fileLocation: directory + '/_countryGarden/bigFlowers',
      num: 1,
      maxNum: 4
    },
    paint: {
      fileLocation: directory + '/_countryGarden/paint',
      num: 10,
      maxNum: 34
    },
    paintLG: {
      fileLocation: directory + '/_countryGarden/paintLG',
      num: 5,
      maxNum: 12
    },
    texture: {
      fileLocation: directory + '/_countryGarden/textures',
      num: 6,
      maxNum: 15
    },
    fullTexture: {
      fileLocation: directory + '/_countryGarden/fullTextures',
      maxNum: 12
    },
    floor: {
      fileLocation: directory + '/_countryGarden/floors',
      num: 1,
      maxNum: 5
    },
    vase: {
      fileLocation: directory + '/_countryGarden/vases',
      num: 1,
      maxNum: 13
    },
    // vaseFlowers: {
    //   fileLocation: '/_countryGarden/vaseFlowers',
    //   num: 4,
    //   maxNum: 6
    // },
    vaseFlowersB: {
      fileLocation: directory + '/_countryGarden/vaseFlowers/_B',
      num: 1,
      maxNum: 7
    },
    vaseFlowersF: {
      fileLocation: directory + '/_countryGarden/vaseFlowers/_F',
      num: 2,
      maxNum: 7
    },
    colors: {
      a: [85,113,131],
      b: [164,205,163],
      c: [216,180,227],
      d: [225,227,180]
    }
  },

  digital: {
    name: 'digital',
    bgColors: {
      bgCol1: [227,48,35],
      bgCol2: [0,32,237],
      bgCol2: [113,241,74],
      bgCol4: [0,0,0],
      bgCol5: [255,255,0]
    },
    flowers: {
      fileLocation: directory + '/_digital/flowers',
      num: 8,
      maxNum: 42
    },
    bigFlowers: {
      fileLocation: directory + '/_digital/bigFlowers',
      num: 1,
      maxNum: 7
    },
    paint: {
      fileLocation: directory + '/_digital/paint',
      num: 12,
      maxNum: 18
    },
    paintLG: {
      fileLocation: directory + '/_digital/paintLG',
      num: 6,
      maxNum: 17
    },
    texture: {
      fileLocation: directory + '/_digital/textures',
      num: 4,
      maxNum: 17
    },
    fullTexture: {
      fileLocation: directory + '/_digital/fullTextures',
      maxNum: 21
    },
    ovTexture: {
      fileLocation: directory + '/_digital/overlayTextures',
      maxNum: 3
    },
    floor: {
      fileLocation: directory + '/_digital/floors',
      num: 1,
      maxNum: 6
    },
    vase: {
      fileLocation: directory + '/_digital/vases',
      num: 1,
      maxNum: 6
    },
    // vaseFlowers: {
    //   fileLocation: '/_digital/vaseFlowers',
    //   num: 1,
    //   maxNum: 2
    // },
    vaseFlowersB: {
      fileLocation: directory + '/_digital/vaseFlowers/_B',
      num: 1,
      maxNum: 5
    },
    vaseFlowersF: {
      fileLocation: directory + '/_digital/vaseFlowers/_F',
      num: 2,
      maxNum: 7
    },
    colors: {
      a: [80,59,128],
      b: [149,63,110],
      c: [219,80,119],
      d: [242,167,107]
    }
  },

  cmyk: {
    name: 'cmyk',
    bgColors: {
      bgCol1: [153,153,152],
      bgCol2: [237,237,237],
      bgCol2: [203,244,241],
      bgCol4: [12,68,62]
    },
    flowers: {
      fileLocation: directory + '/_cmyk/flowers',
      num: 10,
      maxNum: 36
    },
    bigFlowers: {
      fileLocation: directory + '/_cmyk/bigFlowers',
      num: 1,
      maxNum: 7
    },
    paint: {
      fileLocation: directory + '/_cmyk/paint',
      num: 12,
      maxNum: 51
    },
    paint2: {
      fileLocation: directory + '/_cmyk/paint',
      num: 12,
      maxNum: 44
    },
    paintLG: {
      fileLocation: directory + '/_cmyk/paintLG',
      num: 6,
      maxNum: 32
    },
    texture: {
      fileLocation: directory + '/_cmyk/textures',
      num: 4,
      maxNum: 17
    },
    fullTexture: {
      fileLocation: directory + '/_cmyk/fullTextures',
      maxNum: 22
    },
    floor: {
      fileLocation: directory + '/_cmyk/floors',
      num: 1,
      maxNum: 3
    },
    vase: {
      fileLocation: directory + '/_cmyk/vases',
      num: 1,
      maxNum: 5
    },
    // vaseFlowers: {
    //   fileLocation: '/_cmyk/vaseFlowers',
    //   num: 1,
    //   maxNum: 2
    // },
    vaseFlowersB: {
      fileLocation: directory + '/_cmyk/vaseFlowers/_B',
      num: 1,
      maxNum: 7
    },
    vaseFlowersF: {
      fileLocation: directory + '/_cmyk/vaseFlowers/_F',
      num: 2,
      maxNum: 9
    },
    colors: {
      a: [62,146,205],
      b: [187,41,106],
      c: [254,239,82],
      d: [0,0,0]
    }
  },

  allWhite: {
    name: 'allWhite',
    bgColors: {
      bgCol1: [255,255,255]
    },
    flowers: {
      fileLocation: directory + '/_allWhite/flowers',
      num: 20,
      maxNum: 38
    },
    bigFlowers: {
      fileLocation: directory + '/_allWhite/bigFlowers',
      num: 1,
      maxNum: 10
    },
    paint: {
      fileLocation: directory + '/_allWhite/paint',
      num: 11,
      maxNum: 14
    },
    paintLG: {
      fileLocation: directory + '/_allWhite/paintLG',
      num: 6,
      maxNum: 19
    },
    texture: {
      fileLocation: directory + '/_allWhite/textures',
      num: 4,
      maxNum: 10
    },
    fullTexture: {
      fileLocation: directory + '/_allWhite/fullTextures',
      maxNum: 13
    },
    floor: {
      fileLocation: directory + '/_allWhite/floors',
      num: 1,
      maxNum: 5
    },
    vase: {
      fileLocation: directory + '/_allWhite/vases',
      num: 1,
      maxNum: 8
    },
    // vaseFlowers: {
    //   fileLocation: '/_allWhite/vaseFlowers',
    //   num: 1,
    //   maxNum: 2
    // },
    vaseFlowersB: {
      fileLocation: directory + '/_allWhite/vaseFlowers/_B',
      num: 1,
      maxNum: 4
    },
    vaseFlowersF: {
      fileLocation: directory + '/_allWhite/vaseFlowers/_F',
      num: 2,
      maxNum: 10
    },
    colors: {
      a: [255,255,255],
      b: [235,215,215],
      c: [215,215,235]
    }
  },

  graphic: {
    name: 'graphic',
    bgColors: {
      bgCol1: [255,255,255]
    },
    flowers: {
      fileLocation: directory + '/_graphic/flowers',
      num: 10,
      maxNum: 31
    },
    bigFlowers: {
      fileLocation: directory + '/_graphic/bigFlowers',
      num: 1,
      maxNum: 6
    },
    paint: {
      fileLocation: directory + '/_graphic/paint',
      num: 9,
      maxNum: 60
    },
    paintLG: {
      fileLocation: directory + '/_graphic/paintLG',
      num: 3,
      maxNum: 33
    },
    texture: {
      fileLocation: directory + '/_graphic/textures',
      num: 2,
      maxNum: 14
    },
    fullTexture: {
      fileLocation: directory + '/_graphic/fullTextures',
      maxNum: 19
    },
    floor: {
      fileLocation: directory + '/_graphic/floors',
      num: 1,
      maxNum: 5
    },
    vase: {
      fileLocation: directory + '/_graphic/vases',
      num: 1,
      maxNum: 12
    },
    // vaseFlowers: {
    //   fileLocation: '/_graphic/vaseFlowers',
    //   num: 1,
    //   maxNum: 4
    // },
    vaseFlowersB: {
      fileLocation: directory + '/_graphic/vaseFlowers/_B',
      num: 1,
      maxNum: 9
    },
    vaseFlowersF: {
      fileLocation: directory + '/_graphic/vaseFlowers/_F',
      num: 2,
      maxNum: 8
    },
    colors: {
      a: [114,168,177],
      b: [233,214,192],
      c: [236,151,122],
      d: [86,84,81]
    }
  }
}

const comps = {
  // hangingGarden: {
  //   name: 'hangingGarden',
  //   minD: 7,
  //   maxD: 10,
  //   texture: {
  //     minY: -.45,
  //     maxY: .2
  //   },
  //   paintLG: {
  //     minY: -.45,
  //     maxY: .2
  //   },
  //   paint: {
  //     minY: -.48,
  //     maxY: -.1
  //   },
  //   flowers: {
  //     minY: -.48,
  //     maxY: -.1
  //   },
  //   flowers_B: {
  //     minY: -.48,
  //     maxY: 0
  //   },
  //   flowers_F: {
  //     minY: -.48,
  //     maxY: -.1
  //   }
  // },
  standard: {
    name: 'standard',
    minD: 4.4,
    maxD: 6.2,
    texture: {
      minY: -.35,
      maxY: .45
    },
    paintLG: {
      minY: -.45,
      maxY: .45
    },
    paint: {
      minY: -.4,
      maxY: .48
    },
    flowers: {
      minY: -.1,
      maxY: .53
    },
    flowers_B: {
      minY: -.1,
      maxY: .53
    },
    flowers_F: {
      minY: .1,
      maxY: .53
    }
  },
  stillLife: {
    name: 'stillLife',
    minD: 4,
    maxD: 6,
    texture: {
      minY: -.2,
      maxY: .32
    },
    paintLG: {
      minY: -.4,
      maxY: .3
    },
    paint: {
      minY: -.45,
      maxY: .3
    },
    flowers: {
      minY: .2,
      maxY: .48
    },
    flowers_B: {
      minY: .1,
      maxY: .48
    },
    flowers_F: {
      minY: .2,
      maxY: .48
    },
    vase: {

    }
  },
  highVolume: {
    name: 'highVolume',
    minD: 2.7,
    maxD: 4.7,
    texture: {
      minY: -.45,
      maxY: .45
    },
    paintLG: {
      minY: -.45,
      maxY: .45
    },
    paint: {
      minY: -.48,
      maxY: .48
    },
    flowers: {
      minY: -.48,
      maxY: .48
    },
    flowers_B: {
      minY: -.48,
      maxY: .48
    },
    flowers_F: {
      minY: -.48,
      maxY: .48
    },
  },
  dominant: {
    name: 'dominant',
    minD: 3,
    maxD: 5,
    texture: {
      minY: -.5,
      maxY: .5
    },
    paintLG: {
      minY: -.5,
      maxY: .5
    },
    paint: {
      minY: -.5,
      maxY: .5
    },
    flowers: {
      minY: -.5,
      maxY: .5
    },
    flowers_B: {
      minY: -.5,
      maxY: .5
    },
    flowers_F: {
      minY: -.5,
      maxY: .5
    },
    bigFlowerPosOptions: {
      // pos1: [-.4,-.2],
      // pos2: [.4,-.2],
      pos3: [.35,.3],
      pos4: [-.35,.3]
    }
  },
  lowDensity: {
    name: 'lowDensity',
    minD: 5,
    maxD: 7,
    texture: {
      minY: -.5,
      maxY: .45
    },
    paintLG: {
      minY: -.5,
      maxY: .45
    },
    paint: {
      minY: -.5,
      maxY: .47
    },
    flowers: {
      minY: -.5,
      maxY: .5
    },
    flowers_B: {
      minY: -.5,
      maxY: .5
    },
    flowers_F: {
      minY: -.5,
      maxY: .5
    },
    bigFlowerPosOptions: {
      pos1: [-.35,-.3],
      pos2: [.35,-.3],
      // pos3: [.4,.2],
      // pos4: [-.4,.2]
    }
  }
}


let smD;
let aspRatio;
let comp;
let theme;
let socials;
let butterflies;
let overTops;
let hasBlackRose;
let overlay;
let ovTex;

let graphics;

let orderedDraw = [];
let drawNum = 0;


// let bgElements = [];
// let bgElementIds = [];
// let paintElements = [];
// let paintElementIds = [];
// let flowerElements = [];
// let flowerElementIds = [];
// let butterflyElements = [];
// let butterflyElementIds = [];
// let largeElements = [];
// let largeElementIds = [];
// let symbolElements = [];
// let symbolElementIds = [];
// let textureElements = [];
// let textureElementIds = [];
// let elementScale;

let fullTextureAssets = [];
let fullTextureAssetIds = [];

let flowerAssets = [];
let flowerAssets2 = [];
let flowerAssetIds = [];

let flower_B_Assets = [];
let flower_B_Assets2 = [];
let flower_B_AssetIds = [];

let flower_F_Assets = [];
let flower_F_Assets2 = [];
let flower_F_AssetIds = [];

let paintAssets = [];
let paintAssets2 = [];
let paintAssetIds = [];

let paintLGAssets = [];
let paintLGAssets2 = [];
let paintLGAssetIds = [];

let textureAssets = [];
let textureAssets2 = [];
let textureAssetIds = [];

let vaseAssets = [];
let vaseAssets2 = [];
let vaseAssetIds = [];

let vaseFlowerAssets = [];
let vaseFlowerAssetIds = [];

let vaseFlowerAssetsB = [];
let vaseFlowerAssetsB2 = [];
let vaseFlowerAssetBIds = [];

let vaseFlowerAssetsF = [];
let vaseFlowerAssetsF2 = [];
let vaseFlowerAssetFIds = [];

let socialAssets = [];
let socialAssets2 = [];
let socialAssetIds = [];

let butterflyAssets = [];
let butterflyAssets2 = [];
let butterflyAssetIds = [];

let overTopAssets = [];
let overTopAssets2 = [];
let overTopAssetIds = [];

let floorAssets = [];
let floorAssets2 = [];
let floorAssetIds = [];

let ovTextureAssets = [];
let ovTextureAssets2 = [];
let ovTextureAssetIds = [];

let bigFlowerAssets = [];
let bigFlowerAssets2 = [];
let bigFlowerAssetIds = [];

// let overlayAssets = [];
// let overlayAssetIds = [];

let blackRoseAssets = [];
let blackRoseAssets2 = [];
let blackRoseAssetIds = [];

let petalAssets = [];
let petalAssets2 = [];
let petalAssetIds = [];

let frameAssets = [];
let frameAssets2 = [];
let frameAssetIds = [];

let domX, domY;

let dynamic;

let particlesWater = [];
let bgNumRows;

let dotsAngle = 0;

let irregCircs = [];
let zoff = 0;

const slices = 75;
let blobSize;
let randomWeights = [];

let blobCol1, blobCol2;
let blobCols = [];

function preload() {

  // const hashSeed = makeHashSeed(64)
  // const hash = '0x' + getHash(hashSeed).then(hex)

  console.log(hash)

  comp = chooseComp()
  //comp = comps.stillLife;
  theme = chooseTheme()
  console.log(theme.name)
  //theme = themes.countryGarden;

  overlay = rnd()

  if (comp.name === 'stillLife') {
    stillLifeLoad(theme,ovTex)
  }else{
    if (theme.name === 'digital') {
      ovTex = rnd()
    }else{
      ovTex = 1
    }
    standardLoad(comp,theme,ovTex,overlay)
  }
  // socials = rnd()
  socials = map(decPairs[3],0,255,0,1);
  if (socials < .5) {
    numSocials = 0
  }else if (socials < .85) {
    numSocials = 5
  }else{
    numSocials = 12
  }
  socialsLoad(numSocials)

  //butterflies = rnd()
  butterflies = map(decPairs[4],0,255,0,1);
  if (butterflies < .7) {
    numButts = 0
  }else if (socials < .94) {
    numButts = 5
  }else{
    numButts = 12
  }
  butterfliesLoad(numButts)

  //overTops = rnd()
  overTops = map(decPairs[5],0,255,0,1);
  if (overTops < .5) {
    numOverTop = 0
  }else if (overTops < .85) {
    numOverTop = 3
  }else{
    numOverTop = 6
  }
  overTopLoad(numOverTop)

  hasBlackRose = map(decPairs[6],0,255,0,1);
  if (hasBlackRose < .03) {
    blackRoseLoad()
  }

  // console.log(comp.name + '  ////  ' + theme.name + '  ////  ' + numSocials + '  ////  ' + numOverTop + '  ////  ' + numButts)
}

function setup() {
  noiseSeed(seed)
  pixelDensity(4)
  // smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  // console.log('window width: ' + windowWidth,'window height: ' + windowHeight,'smD: ' + smD)
  // aspRatio = 16/9;
  // createCanvas(smD/2, smD*aspRatio/2);
  // console.log(smD, width)

  aspRatio = 16/9;
	smD = (windowWidth * aspRatio) < windowHeight ? windowWidth : windowHeight / aspRatio ; 

	createCanvas(smD, smD*aspRatio);

  translate(width/2,height/2)
  let bgCol = chooseObjKey(theme.bgColors)
  background(bgCol)

  imageMode(CENTER);

  if (comp.name === 'stillLife') {
    stillLife(comp,theme,hasBlackRose)
  }else{
    standard(comp,theme,ovTex,hasBlackRose)
  }

  if (comp.name !== 'stillLife'){
    standardLayer1()
    standardLayer2()
  }else{
    stillLifeLayer1()
    stillLifeLayer2()
  }
}

function draw() {

}

function loadRandomAssets(num,maxNum,baseArray,fileLoc,fileNameConvention,type,idArray) {
  let array = Array.from(new Array(maxNum-1), (x,i) => i)
  for (let i = 0; i < num; i++) {
    let index = floor(rnd(array.length))
    let assetId = array[index]
    array.splice(index,1)
    baseArray.push(new LoadAsset(fileLoc,fileNameConvention,assetId+1,type,idArray))
    baseArray[i].load()
  }
}

function standardLoad(comp,theme,ovTex) {
  if (comp.name === 'lowDensity') {
    fullTextureAssets.push(new LoadAsset(directory + '/_' + theme.name + '/' + 'lowD_fT','lowD_fT_',1,'none',fullTextureAssetIds))
    fullTextureAssets[0].load()
  }else{
    let maxFullTextureId = theme.fullTexture.maxNum;
    let fullTextureId = floor(map(decPairs[21],0,255,1,maxFullTextureId-.1));
    fullTextureAssets.push(new LoadAsset(theme.fullTexture.fileLocation,'fT_',fullTextureId,'none',fullTextureAssetIds))
    fullTextureAssets[0].load()
  }


  // textures
  let numTextures = theme.texture.num
  if (theme.name === 'graphic' && (comp.name === 'standard' || comp.name === 'highVolume')) {
    numTextures = theme.texture.num + 1
  }
  loadRandomAssets(numTextures, theme.texture.maxNum, textureAssets, theme.texture.fileLocation, 'texture_', 'none', textureAssetIds)

  // paint LG
  let numPaintLG = theme.paintLG.num
  if (theme.name === 'graphic' && (comp.name === 'standard' || comp.name === 'highVolume')) {
    numPaintLG = theme.paintLG.num + 1
  }
  loadRandomAssets(numPaintLG, theme.paintLG.maxNum, paintLGAssets, theme.paintLG.fileLocation, 'paintLG_', 'none', paintLGAssetIds)

  // paint
  let numPaint = theme.paint.num
  if (theme.name === 'graphic' && (comp.name === 'standard' || comp.name === 'highVolume')) {
    numPaint = theme.paint.num + 2
  }
  loadRandomAssets(numPaint, theme.paint.maxNum, paintAssets, theme.paint.fileLocation, 'paint_', 'none', paintAssetIds)

  if (comp.name === 'lowDensity') {
    let maxFloorId = theme.floor.maxNum;
    let floorId = floor(rnd(1,maxFloorId))
    floorAssets.push(new LoadAsset(theme.floor.fileLocation+'/','floor_',floorId,'none',floorAssetIds))
    floorAssets[0].load()
  }

  if (theme.name === 'countryGarden' || theme.name === 'rococo') {
    // COUNTRY GARDEN / ROCOCO FLOWERS
    loadRandomAssets(theme.flowers_B.num, theme.flowers_B.maxNum, flower_B_Assets, theme.flowers_B.fileLocation, 'flower_', 'none', flower_B_AssetIds)
    loadRandomAssets(theme.flowers_F.num, theme.flowers_F.maxNum, flower_F_Assets, theme.flowers_F.fileLocation, 'flower_', 'none', flower_F_AssetIds)
  }else{
    let numFlowers = theme.flowers.num
    if (theme.name === 'graphic' && comp.name === 'standard') {
      numFlowers = theme.flowers.num + 3
    }
    loadRandomAssets(numFlowers, theme.flowers.maxNum, flowerAssets, theme.flowers.fileLocation, 'flower_', 'none', flowerAssetIds)
  }

  if (ovTex < .3) {
    let maxOvTextureId = theme.ovTexture.maxNum;
    let ovTextureId = floor(rnd(1,maxOvTextureId));
    ovTextureAssets.push(new LoadAsset(theme.ovTexture.fileLocation,'ovTex_',ovTextureId,'none',ovTextureAssetIds))
    ovTextureAssets[0].load();
  }

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    let maxBigFlowerId = theme.bigFlowers.maxNum
    let bigFlowerId = floor(rnd(1,maxBigFlowerId))
    bigFlowerAssets.push(new LoadAsset(theme.bigFlowers.fileLocation,'bF_',bigFlowerId,'none',bigFlowerAssetIds))
    bigFlowerAssets[0].load()
  }

  // if (overlay < .5) {
  //   let maxOverlayId = 2
  //   let overlayId = floor(rnd(1,maxOverlayId))
  //   overlayAssets.push(new LoadAsset('/_overlays'+'/','overlay_',overlayId,'none',overlayAssetIds))
  //   overlayAssets[0].load()
  // }
}

function stillLifeLoad(theme,ovTex) {
  let maxFullTextureId = theme.fullTexture.maxNum;
  let fullTextureId = floor(map(decPairs[21],0,255,1,maxFullTextureId-.1));
  fullTextureAssets.push(new LoadAsset(theme.fullTexture.fileLocation,'fT_',fullTextureId,'none',fullTextureAssetIds))
  fullTextureAssets[0].load()

  if (ovTex < .3) {
    let maxOvTextureId = theme.ovTexture.maxNum;
    let ovTextureId = floor(rnd(1,maxOvTextureId));
    ovTextureAssets.push(new LoadAsset(theme.ovTexture.fileLocation,'ovTex_',ovTextureId,'none',ovTextureAssetIds))
    ovTextureAssets[0].load();
  }

  // textures
  loadRandomAssets(theme.texture.num, theme.texture.maxNum, textureAssets, theme.texture.fileLocation, 'texture_', 'none', textureAssetIds)

  // paint LG
  loadRandomAssets(theme.paintLG.num, theme.paintLG.maxNum, paintLGAssets, theme.paintLG.fileLocation, 'paintLG_', 'none', paintLGAssetIds)

  // paint
  loadRandomAssets(theme.paint.num, theme.paint.maxNum, paintAssets, theme.paint.fileLocation, 'paint_', 'none', paintAssetIds)

  // frames
  // if (comp.name === 'stillLife' && theme.name === 'rococo') {
  //   let hasFrame = rnd()
  //   if (hasFrame < 1) {
  //     loadRandomAssets(1,4,frameAssets,'/frames','frame_','none',frameAssetIds)
  //   }
  // }

  // vase flowers back
  loadRandomAssets(2, theme.vaseFlowersB.maxNum, vaseFlowerAssetsB, theme.vaseFlowersB.fileLocation, 'vF_B_', 'none', vaseFlowerAssetBIds)

  let maxFloorId = theme.floor.maxNum;
  let floorId = floor(rnd(1,maxFloorId))
  floorAssets.push(new LoadAsset(theme.floor.fileLocation+'/','floor_',floorId,'none',floorAssetIds))
  floorAssets[0].load()

  let maxVaseId = theme.vase.maxNum;
  let vaseId = floor(rnd(1,maxVaseId))
  vaseAssets.push(new LoadAsset(theme.vase.fileLocation+'/','vase_',vaseId,'none',vaseAssetIds))
  vaseAssets[0].load()

  // vase flowers front
  loadRandomAssets(2, theme.vaseFlowersF.maxNum, vaseFlowerAssetsF, theme.vaseFlowersF.fileLocation, 'vF_F_', 'none', vaseFlowerAssetFIds)

  let numFlowersOverVase = 3;

  if (theme.name === 'countryGarden' || theme.name === 'rococo') {
    // COUNTRY GARDEN / ROCOCO FLOWERS
    loadRandomAssets(numFlowersOverVase, theme.flowers_F.maxNum, flower_F_Assets, theme.flowers_F.fileLocation, 'flower_', 'none', flower_F_AssetIds)
  }else{
    // REGULAR FLOWERS
    loadRandomAssets(numFlowersOverVase, theme.flowers.maxNum, flowerAssets, theme.flowers.fileLocation, 'flower_', 'none', flowerAssetIds)
  } 
}

function socialsLoad(numSocials) {
  maxNumSocials = 24
  loadRandomAssets(numSocials, maxNumSocials, socialAssets, directory + '/socials', 'social_', 'none', socialAssetIds)
}

function butterfliesLoad(numButts) {
  maxNumButts = 21
  loadRandomAssets(numButts, maxNumButts, butterflyAssets, directory + '/butterflies', 'butterfly_', 'none', butterflyAssetIds)
}

function overTopLoad(numOverTop) {
  maxNumOverTop = 18
  loadRandomAssets(numOverTop, maxNumOverTop, overTopAssets, directory + '/_overTop', 'overTop_', 'none', overTopAssetIds)
}

function blackRoseLoad() {
  maxId = 2
  loadRandomAssets(1, maxId, blackRoseAssets, directory + '/_blackRose', 'blackRose_', 'none', blackRoseAssetIds)
}


/////////////////   COMPOSITIONS   ////////////////////////
///////////////////////////////////////////////////////////

function standard(comp,theme,ovTex,hasBlackRose) {
  minD = comp.minD, maxD = comp.maxD;

  // bMode = HARD_LIGHT;
  // if (theme.name === 'rococo') {
  //   bMode = MULTIPLY
  // }else if (theme.name === 'countryGarden') {
  //   bMode = BLEND
  // }else if (theme.name === 'cmyk') {
  //   bMode = BLEND
  // }else if (theme.name === 'allWhite') {
  //   bMode = BLEND
  // }else if (theme.name === 'graphic') {
  //   bMode = BLEND
  // }

  blendMode(BLEND)
  let fT = fullTextureAssetIds[0]
  image(fT,0,0,width,height)

  if (comp.name === 'standard' || comp.name === 'lowDensity') {
    verticalGradient()
  }

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    let pos = chooseObjKey(comp.bigFlowerPosOptions);
    domX = w(pos[0]);
    domY = h(pos[1]);
    domPos = createVector(domX,domY)
  }

  for (let i = 0; i < textureAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.35),w(.35)),rnd(h(comp.texture.minY),h(comp.texture.maxY)))
    let imgId = textureAssetIds[i]
    let imgDiv = rnd(minD,maxD)/3

    if (comp.name === 'standard') {
      stSizeAdjust = map(pElPos.y,h(comp.texture.minY),h(comp.texture.maxY),1,1.7);
    }else if(comp.name === 'dominant'){
      stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.8,.6);
    }else if(comp.name === 'lowDensity'){
      stSizeAdjust = map(pElPos.y,h(comp.texture.minY),h(comp.texture.maxY),1,1.5);
    }else{
      stSizeAdjust = 1;
    }

    if (theme.name === 'allWhite') {
      bMode = BLEND
    }else if (theme.name === 'rococo') {
      bMode = BLEND
    }else{
      bMode = HARD_LIGHT
    }

    blendMode(bMode)
    push()
    rotate(90*floor(rnd(4)))
    textureAssets2.push(new PlaceAsset(imgId,pElPos,(width/imgDiv)*stSizeAdjust,(height/imgDiv/aspRatio)*stSizeAdjust))
    textureAssets2[i].setItem()
    pop()
  }

  for (let i = 0; i < paintLGAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.paintLG.minY),h(comp.paintLG.maxY)))
    let imgId = paintLGAssetIds[i]
    let imgDiv = rnd(minD,maxD)/4

    if (comp.name === 'standard') {
      stSizeAdjust = map(pElPos.y,h(comp.paintLG.minY),h(comp.paintLG.maxY),1,1.7);
    }else if(comp.name === 'dominant'){
      stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.2,.8);
    }else if(comp.name === 'lowDensity'){
      stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.15,.85);
    }else{
      stSizeAdjust = 1;
    }

    let bMode = BLEND
    blendMode(bMode)
    paintLGAssets2.push(new PlaceAsset(imgId,pElPos,(width/imgDiv)*stSizeAdjust,(height/imgDiv/aspRatio)*stSizeAdjust))
    paintLGAssets2[i].setItem()
  }

  if (comp.name === 'lowDensity') {
    blendMode(BLEND)
    let thisFloor = floorAssetIds[0]
    image(thisFloor,0,0,width,height)
  }

  let paintArraysplit = paintAssets.length - 6
  //console.log(paintAssets.length, paintArraysplit)

  for (let i = 0; i < paintAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.paint.minY),h(comp.paint.maxY)))
    let imgId = paintAssetIds[i]
    let imgDiv = rnd(minD,maxD)/2//*2

    if (comp.name === 'standard') {
      stSizeAdjust = map(pElPos.y,h(comp.paint.minY),h(comp.paint.maxY),1,1.7);
    }else if(comp.name === 'dominant'){
      if (i >= paintArraysplit) {
        let chooseSide = rnd() ////////////////// SETUP FOR PLACING TOP-LAYER ASSETS WITHOUT GOING OVER MIDDLE OF DOM FLOWER
        if (chooseSide < .5) {
          if (domPos.x < 0) {
            pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.paintLG.minY),h(.125)))
          }else{
            pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.paintLG.minY),h(comp.paintLG.maxY)))
          }
        }else{
          if (domPos.x > 0) {
            pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.paintLG.minY),h(.125)))
          }else{
            pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.paintLG.minY),h(comp.paintLG.maxY)))
          }
        } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),.65,1);
      }else{
        stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.4,.7);
      }
    }else if(comp.name === 'lowDensity'){
      if (i >= paintArraysplit) {
        let chooseSide = rnd() ////////////////// SETUP FOR PLACING TOP-LAYER ASSETS WITHOUT GOING OVER MIDDLE OF DOM FLOWER
        if (chooseSide < .5) {
          if (domPos.x < 0) {
            pElPos = createVector(rnd(-w(.48),0),rnd(-h(.125),h(comp.paintLG.maxY)))
          }else{
            pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.paintLG.minY),h(comp.paintLG.maxY)))
          }
        }else{
          if (domPos.x > 0) {
            pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.paintLG.minY),h(comp.paintLG.maxY)))
          }else{
            pElPos = createVector(rnd(0,w(.48)),rnd(-h(.125),h(comp.paintLG.maxY)))
          }
        } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),.55,1);
      }else{
        stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.15,.65);
      }
    }else{
      stSizeAdjust = 1;
    }

    let bMode  = BLEND // OVERLAY;
    if (theme.name === 'digital') {
      bMode = BLEND
    }else if (theme.name === 'cmyk') {
      // if (i % 3) {
      //   bMode = OVERLAY
      // }else{
        bMode = BLEND
      //}
    }else{
      bMode = BLEND
    }
    blendMode(bMode)
    paintAssets2.push(new PlaceAsset(imgId,pElPos,(width/imgDiv)*stSizeAdjust,(height/imgDiv/aspRatio)*stSizeAdjust))
    paintAssets2[i].setItem()
  }

  placeSocials(comp)

  let flower_F_Arraysplit = flower_F_Assets.length > 6 ? flower_F_Assets.length-4 : flower_F_Assets.length;
  let flowerArraysplit = flowerAssets.length > 6 ? flowerAssets.length-4 : flowerAssets.length;

  if (theme.name === 'countryGarden' || theme.name === 'rococo') {
    for (let i = 0; i < flower_B_Assets.length; i++) {
      let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.flowers_B.minY),h(comp.flowers_B.maxY)))
      let imgId = flower_B_AssetIds[i]
      let imgDiv = rnd(minD,maxD)

      if (comp.name === 'standard') {
        stSizeAdjust = map(pElPos.y,h(comp.flowers_B.minY),h(comp.flowers_B.maxY),1.3,1.8);
      }else if(comp.name === 'dominant'){
        stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.8,.75);
      }else if(comp.name === 'lowDensity'){
        stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.15,.75);
      }else{
        stSizeAdjust = 1;
      }

      let bMode = BLEND
      if (i % 2) {imgDiv = imgDiv*.8}
      if (i % 3) {imgDiv = imgDiv*.6}
      blendMode(bMode)
      flower_B_Assets2.push(new PlaceAsset(imgId,pElPos,(width/imgDiv)*stSizeAdjust,(height/imgDiv/aspRatio)*stSizeAdjust))
      flower_B_Assets2[i].setItem()
    }
    for (let i = 0; i < flower_F_Assets.length; i++) {
      let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.flowers_F.minY),h(comp.flowers_F.maxY)))
      let imgId = flower_F_AssetIds[i]
      let imgDiv = rnd(minD,maxD)*1.2

      if (comp.name === 'standard') {
        stSizeAdjust = map(pElPos.y,h(comp.flowers_F.minY),h(comp.flowers_F.maxY),1,1.7);
      }else if(comp.name === 'dominant'){
        if (i >= flower_F_Arraysplit) {
          let chooseSide = rnd() ////////////////// SETUP FOR PLACING TOP-LAYER ASSETS WITHOUT GOING OVER MIDDLE OF DOM FLOWER
          if (chooseSide < .5) {
            if (domPos.x < 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers_F.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers_F.minY),h(comp.flowers_F.maxY)))
            }
          }else{
            if (domPos.x > 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers_F.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers_F.minY),h(comp.flowers_F.maxY)))
            }
          } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),.75,1);
        }else{
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.8,.75);
        }
      }else if(comp.name === 'lowDensity'){
        if (i >= flower_F_Arraysplit) {
          let chooseSide = rnd() ////////////////// SETUP FOR PLACING TOP-LAYER ASSETS WITHOUT GOING OVER MIDDLE OF DOM FLOWER
          if (chooseSide < .5) {
            if (domPos.x < 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers_F.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers_F.minY),h(comp.flowers_F.maxY)))
            }
          }else{
            if (domPos.x > 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers_F.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers_F.minY),h(comp.flowers_F.maxY)))
            }
          } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),.75,1);
        }else{
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.15,.75);
        }
      }else{
        stSizeAdjust = 1;
      }

      let bMode = BLEND
      if (i % 2) {imgDiv = imgDiv*.8}
      if (i % 3) {imgDiv = imgDiv*.6}
      blendMode(bMode)
      flower_F_Assets2.push(new PlaceAsset(imgId,pElPos,(width/imgDiv)*stSizeAdjust,(height/imgDiv/aspRatio)*stSizeAdjust))
      flower_F_Assets2[i].setItem()
    }
  }else{
    for (let i = 0; i < flowerAssets.length; i++) {
      let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.flowers.minY),h(comp.flowers.maxY)))
      let imgId = flowerAssetIds[i]
      let imgDiv = rnd(minD,maxD)

      if (comp.name === 'standard') {
        stSizeAdjust = map(pElPos.y,h(comp.flowers.minY),h(comp.flowers.maxY),1,1.7);
      }else if(comp.name === 'dominant'){
        if (i >= flowerArraysplit) {
          let chooseSide = rnd() ////////////////// SETUP FOR PLACING TOP-LAYER ASSETS WITHOUT GOING OVER MIDDLE OF DOM FLOWER
          if (chooseSide < .5) {
            if (domPos.x < 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers.minY),h(comp.flowers.maxY)))
            }
          }else{
            if (domPos.x > 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers.minY),h(comp.flowers.maxY)))
            }
          } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),.75,1);
        }else{
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.5,.75);
        }
      }else if(comp.name === 'lowDensity'){
        if (i >= flowerArraysplit) {
          let chooseSide = rnd() ////////////////// SETUP FOR PLACING TOP-LAYER ASSETS WITHOUT GOING OVER MIDDLE OF DOM FLOWER
          if (chooseSide < .5) {
            if (domPos.x < 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers.minY),h(comp.flowers.maxY)))
            }
          }else{
            if (domPos.x > 0) {
              pElPos = createVector(rnd(-w(.48),0),rnd(h(comp.flowers.minY),h(.125)))
            }else{
              pElPos = createVector(rnd(0,w(.48)),rnd(h(comp.flowers.minY),h(comp.flowers.maxY)))
            }
          } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),.75,1);
        }else{
          stSizeAdjust = map(dist(pElPos.x,pElPos.y,domPos.x,domPos.y),0,w(1.2),1.15,.75);
        }
      }else{
        stSizeAdjust = 1;
      }

      let bMode = BLEND
      if (i % 2) {imgDiv = imgDiv*.8}
      if (i % 3) {imgDiv = imgDiv*.6}
      blendMode(bMode)
      flowerAssets2.push(new PlaceAsset(imgId,pElPos,(width/imgDiv)*stSizeAdjust,(height/imgDiv/aspRatio)*stSizeAdjust))
      flowerAssets2[i].setItem()
    }
  }

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    push()
    translate(domPos.x,domPos.y)
    if (domPos.x > 0 && domPos.y < 0) {
      rotate(radians(90))
    }else if (domPos.x > 0 && domPos.y > 0) {
      rotate(radians(180))
    }else if (domPos.x < 0 && domPos.y > 0) {
      rotate(radians(270))
    }
    for (let i = 0; i < bigFlowerAssets2.length; i++) {
      bigFlowerAssets2[i].setItem()
    }
    pop()
  }

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    let bigFlower = bigFlowerAssetIds[0]
    //image(bigFlower,domX,domY,width*1.35,height*1.35/aspRatio)
    if (comp.name === 'dominant') {
      mult = 1.3
    }else if (comp.name === 'lowDensity') {
      mult = .9
    }
    push()
    let defaultPos = createVector(0,0)
    translate(domPos.x,domPos.y)
    if (domPos.x > 0 && domPos.y < 0) {
      rotate(radians(90))
    }else if (domPos.x > 0 && domPos.y > 0) {
      rotate(radians(180))
    }else if (domPos.x < 0 && domPos.y > 0) {
      rotate(radians(270))
    }
    bigFlowerAssets2.push(new PlaceAsset(bigFlower,defaultPos,width*mult,height*mult/aspRatio))
    bigFlowerAssets2[0].setItem()
    pop()
  }

  if (hasBlackRose < .03) {  /// NEEDS TO BE UPDATED SO hasBlackRose is loaded/defined globally
    blendMode(BLEND)
    let blackRose = blackRoseAssetIds[0]
    if (comp.name === 'dominant') {
      let brPos = createVector((domPos.x*-1)*.7,(domPos.y*-1)*1.5)
      //image(blackRose,brPos.x,brPos.y,w(.4),h(.4)/aspRatio)
      blackRoseAssets2.push(new PlaceAsset(blackRose,brPos,w(.4),h(.4)/aspRatio))
      blackRoseAssets2[0].setItem()
    }else{
      let brPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.flowers.minY),h(comp.flowers.maxY)))
      //image(blackRose,brPos.x,brPos.y,w(.35),h(.35)/aspRatio)
      blackRoseAssets2.push(new PlaceAsset(blackRose,brPos,w(.35),h(.35)/aspRatio))
      blackRoseAssets2[0].setItem()
    }
  }

  if (ovTex < .3) {
    blendMode(BLEND)
    let overlay = ovTextureAssetIds[0]
    //overlay.resize(width,height)
    image(overlay,0,0,width,height)
  }

  placeButterflies(comp)

  placeOverTop(comp)

  // blendMode(OVERLAY)
  // let overlayImage = overlayAssetIds[0]
  // //fT.resize(width,height)
  // image(overlayImage,0,0,width,height)


  // for (let i = 0; i < numFlowerEls*numMult; i++) {
  //   let flowerElementId = floor(rnd(1,10))
  //   flowerElements.push(new LoadFlowerElement(flowerElementId))
  //   flowerElements[i].load();
  // }

  // let numPaintEls;
  // let numFlowerEls;
  // let numTextureEls;
  // let numSymbolEls;
  // let numButterflyEls;
  // let numLargeEls; 
}

function standardLayer1() {
  blendMode(BLEND)
  let fT = fullTextureAssetIds[0]
  image(fT,0,0,width,height)

  for (let i = 0; i < textureAssets2.length; i++) {
    //push()
    // let bMode = BLEND
    // if (theme.name === 'digital') {
    //   bMode = HARD_LIGHT
    // }
    // blendMode(bMode)
    textureAssets2[i].setItem()
    // pop()
  }

  for (let i = 0; i < paintLGAssets2.length; i++) {
    // push()
    // let bMode = BLEND
    // if (theme.name === 'digital') {
    //   bMode = HARD_LIGHT
    // }
    // blendMode(OVERLAY)
    paintLGAssets2[i].setItem()
    // pop()
  }

  blendMode(BLEND)

  if (comp.name === 'standard' || comp.name === 'lowDensity') {
    //verticalGradient()
  }
  if (comp.name === 'lowDensity') {
    let thisFloor = floorAssetIds[0]
    //image(thisFloor,0,0,width,height)
  }
}

function standardLayer2() {

  let paintArraysplit = paintAssets2.length - 6

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    for (let i = 0; i < paintArraysplit; i++) {
      paintAssets2[i].setItem()
    }
  }else{
    for (let i = 0; i < paintAssets2.length; i++) {
      paintAssets2[i].setItem()
    }
  }

  for (let i = 0; i < socialAssets2.length; i++) {
    socialAssets2[i].setItem()
  }

  for (let i = 0; i < flower_B_Assets2.length; i++) {
    flower_B_Assets2[i].setItem()
  }

  let flower_F_Arraysplit = flower_F_Assets2.length > 6 ? flower_F_Assets2.length-4 : flower_F_Assets2.length;
  let flowerArraysplit = flowerAssets2.length > 6 ? flowerAssets2.length-4 : flowerAssets2.length;

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    for (let i = 0; i < flower_F_Arraysplit; i++) {
      flower_F_Assets2[i].setItem()
    }
    for (let i = 0; i < flowerArraysplit; i++) {
      flowerAssets2[i].setItem()
    }
  }else{
    for (let i = 0; i < flower_F_Assets2.length; i++) {
      flower_F_Assets2[i].setItem()
    }
    for (let i = 0; i < flowerAssets2.length; i++) {
      flowerAssets2[i].setItem()
    }
  }

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    push()
    translate(domPos.x,domPos.y)
    if (domPos.x > 0 && domPos.y < 0) {
      rotate(radians(90))
    }else if (domPos.x > 0 && domPos.y > 0) {
      rotate(radians(180))
    }else if (domPos.x < 0 && domPos.y > 0) {
      rotate(radians(270))
    }
    for (let i = 0; i < bigFlowerAssets2.length; i++) {
      bigFlowerAssets2[i].setItem()
    }
    pop()
  }

  if (comp.name === 'dominant' || comp.name === 'lowDensity') {
    for (let i = flower_F_Arraysplit; i < flower_F_Assets2.length; i++) {
      flower_F_Assets2[i].setItem()
    }
    for (let i = flowerArraysplit; i < flowerAssets2.length; i++) {
      flowerAssets2[i].setItem()
    }
    for (let i = paintArraysplit; i < paintAssets2.length; i++) {
      paintAssets2[i].setItem()
    }
  }

  for (let i = 0; i < blackRoseAssets2.length; i++) {
    blackRoseAssets2[i].setItem()
  }

  for (let i = 0; i < butterflyAssets2.length; i++) {
    butterflyAssets2[i].setItem()
  }

  if (ovTex < .3) {
    blendMode(BLEND)
    let overlay = ovTextureAssetIds[0]
    image(overlay,0,0,width,height)
  }

  for (let i = 0; i < overTopAssets2.length; i++) {
    overTopAssets2[i].setItem()
  }
}

function stillLife(comp,theme,hasBlackRose,ovTex) {
  minD = comp.minD, maxD = comp.maxD;

  // bMode = HARD_LIGHT;
  // if (theme.name === 'rococo') {
  //   bMode = MULTIPLY
  // }else if (theme.name === 'countryGarden') {
  //   //bMode = OVERLAY
  //   bMode = BLEND
  // }else if (theme.name === 'cmyk') {
  //   bMode = BLEND
  // }else if (theme.name === 'allWhite') {
  //   bMode = BLEND
  // }else if (theme.name === 'graphic') {
  //   bMode = BLEND
  // }

  blendMode(BLEND)
  let fT = fullTextureAssetIds[0]
  image(fT,0,0,width,height)

  verticalGradient()

  blendMode(BLEND)
  let thisFloor = floorAssetIds[0]
  image(thisFloor,0,0,width,height)

  for (let i = 0; i < textureAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.35),w(.35)),rnd(h(comp.texture.minY),h(comp.texture.maxY)))
    let imgId = textureAssetIds[i]
    let imgDiv = rnd(minD,maxD)/3
    if (theme.name === 'allWhite') {
      bMode = BLEND
    }else{
      bMode = OVERLAY
    }
    blendMode(bMode)
    push()
    rotate(90*floor(rnd(4)))
    textureAssets2.push(new PlaceAsset(imgId,pElPos,width/imgDiv,height/imgDiv/aspRatio))
    textureAssets2[i].setItem()
    pop()
  }

  for (let i = 0; i < paintLGAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.35),w(.35)),rnd(h(comp.paintLG.minY),h(comp.paintLG.maxY)))
    let imgId = paintLGAssetIds[i]
    let imgDiv = rnd(minD,maxD)/4
    let bMode = HARD_LIGHT
    blendMode(bMode)
    paintLGAssets2.push(new PlaceAsset(imgId,pElPos,width/imgDiv,height/imgDiv/aspRatio))
    paintLGAssets2[i].setItem()
  }

  for (let i = 0; i < paintAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.paint.minY),h(comp.paint.maxY)))
    let imgId = paintAssetIds[i]
    let imgDiv = rnd(minD,maxD)/2//*2
    let bMode  = BLEND // OVERLAY;
    if (theme.name === 'digital') {
      bMode = BLEND
    }
    blendMode(bMode)
    paintAssets2.push(new PlaceAsset(imgId,pElPos,width/imgDiv,height/imgDiv/aspRatio))
    paintAssets2[i].setItem()
  }

  // // frames
  // if (theme.name === 'rococo') {
  //   for (let i = 0; i < frameAssets.length; i++) {
  //     let framePos = createVector(rnd(-w(.37),w(.37)),rnd(-h(.35),-h(.15)))
  //     let frameId = frameAssetIds[i]
  //     let frameDiv = 1
  //     // frameAssets2.push(new PlaceAsset(frameId,framePos,width/frameDiv,height/frameDiv/aspRatio))
  //     // frameAssets2[i].setItem()
  //   }
  // }

  for (let i = 0; i < vaseFlowerAssetsB.length; i++) {
    let pElPos = createVector(0,0)
    let imgId = vaseFlowerAssetBIds[i]
    let bMode  = BLEND // OVERLAY;
    blendMode(bMode)
    vaseFlowerAssetsB2.push(new PlaceAsset(imgId,pElPos,width,height))
    vaseFlowerAssetsB2[i].setItem()
  }

  let thisVase = vaseAssetIds[0]
  let vasePos = createVector(0,0)
  vaseAssets2.push(new PlaceAsset(thisVase,vasePos,width,height))
  vaseAssets2[0].setItem()

  for (let i = 0; i < vaseFlowerAssetsF.length; i++) {
    let pElPos = createVector(0,0)
    let imgId = vaseFlowerAssetFIds[i]
    let bMode  = BLEND // OVERLAY;
    blendMode(bMode)
    image(imgId,0,0,width,height)
    vaseFlowerAssetsF2.push(new PlaceAsset(imgId,pElPos,width,height))
    vaseFlowerAssetsF2[i].setItem()
  }

  placeSocials(comp)

  if (theme.name === 'countryGarden' || theme.name === 'rococo') {
    for (let i = 0; i < flower_F_Assets.length; i++) {
      let pElPos = createVector(rnd(-w(.25),w(.25)),rnd(-h(.15),h(.15)))
      let imgId = flower_F_AssetIds[i]
      let imgDiv = floor(rnd(minD/3,maxD/3))
      let bMode = BLEND
      blendMode(bMode)
      flower_F_Assets2.push(new PlaceAsset(imgId,pElPos,width/(imgDiv*3),height/(imgDiv*3)/aspRatio))
      flower_F_Assets2[i].setItem()
    }
  }else{
    for (let i = 0; i < flowerAssets.length; i++) {
      let pElPos = createVector(rnd(-w(.25),w(.25)),rnd(-h(.15),h(.15)))
      let imgId = flowerAssetIds[i]
      let imgDiv = floor(rnd(minD/3,maxD/3))
      let bMode = BLEND;
      blendMode(bMode)
      flowerAssets2.push(new PlaceAsset(imgId,pElPos,width/(imgDiv*3),height/(imgDiv*3)/aspRatio))
      flowerAssets2[i].setItem()
    }
  }

  if (hasBlackRose < .03) {
    blendMode(BLEND)
    let blackRose = blackRoseAssetIds[0]
    let brPos = createVector(0,0)
    push()
    translate(w(.39),h(.435))
    rotate(radians(-55))
    blackRoseAssets2.push(new PlaceAsset(blackRose,brPos,w(.4),h(.4)/aspRatio))
    blackRoseAssets2[0].setItem()
    pop()
  }

  if (ovTex < .3) {
    blendMode(BLEND)
    let overlay = ovTextureAssetIds[0]
    image(overlay,0,0,width,height)
  }

  placeButterflies(comp)

  placeOverTop(comp)
}

function stillLifeLayer1() {
  blendMode(BLEND)
  let fT = fullTextureAssetIds[0]
  image(fT,0,0,width,height)

  verticalGradient()

  let thisFloor = floorAssetIds[0]
  image(thisFloor,0,0,width,height)

  for (let i = 0; i < textureAssets2.length; i++) {
    textureAssets2[i].setItem()
  }

  for (let i = 0; i < frameAssets2.length; i++) {
    frameAssets2[i].setItem()
  }

  for (let i = 0; i < paintLGAssets2.length; i++) {
    paintLGAssets2[i].setItem()
  }
}

function stillLifeLayer2() {
  for (let i = 0; i < paintAssets2.length; i++) {
    paintAssets2[i].setItem()
  }
  for (let i = 0; i < vaseFlowerAssetsB2.length; i++) {
    vaseFlowerAssetsB2[i].setItem()
  }
  for (let i = 0; i < flower_B_Assets2.length; i++) {
    flower_B_Assets2[i].setItem()
  }
  for (let i = 0; i < vaseAssets2.length; i++) {
    vaseAssets2[i].setItem()
  }
  for (let i = 0; i < vaseFlowerAssetsF2.length; i++) {
    vaseFlowerAssetsF2[i].setItem()
  }
  for (let i = 0; i < socialAssets2.length; i++) {
    socialAssets2[i].setItem()
  }
  for (let i = 0; i < flower_F_Assets2.length; i++) {
    flower_F_Assets2[i].setItem()
  }
  for (let i = 0; i < flowerAssets2.length; i++) {
    flowerAssets2[i].setItem()
  }
  for (let i = 0; i < blackRoseAssets2.length; i++) {
    push()
    translate(w(.39),h(.435))
    rotate(radians(-55))
    blackRoseAssets2[0].setItem()
    pop()
  }
  for (let i = 0; i < butterflyAssets2.length; i++) {
    butterflyAssets2[i].setItem()
  }
  if (ovTex < .3) {
    blendMode(BLEND)
    let overlay = ovTextureAssetIds[0]
    image(overlay,0,0,width,height)
  }
  for (let i = 0; i < overTopAssets2.length; i++) {
    overTopAssets2[i].setItem()
  }
}

function placeSocials(comp) {
  minD = comp.minD, maxD = comp.maxD;

  for (let i = 0; i < socialAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(h(comp.paint.minY),h(comp.paint.maxY)))
    let imgId = socialAssetIds[i]
    let imgDiv = rnd(minD,maxD)/2//*2
    let bMode  = BLEND // OVERLAY;
    blendMode(bMode)
    socialAssets2.push(new PlaceAsset(imgId,pElPos,width/imgDiv,height/imgDiv/aspRatio))
    socialAssets2[i].setItem()
  }
}

function placeButterflies(comp) {
  minD = comp.minD, maxD = comp.maxD;

  for (let i = 0; i < butterflyAssets.length; i++) {
    let pElPos = createVector(rnd(-w(.48),w(.48)),rnd(-h(.48),h(.48)))
    let imgId = butterflyAssetIds[i]
    let imgDiv = rnd(minD,maxD) / 1.35 //*2
    let bMode  = BLEND // OVERLAY;
    blendMode(bMode)
    butterflyAssets2.push(new PlaceAsset(imgId,pElPos,width/imgDiv,height/imgDiv/aspRatio))
    butterflyAssets2[i].setItem()
  }
}

function placeOverTop(comp) {
  minD = comp.minD, maxD = comp.maxD;

  for (let i = 0; i < overTopAssets.length; i++) {
    if (overTopAssets.length > 4) {
      posY = map(i,0,overTopAssets.length,-h(.35),h(.35)) + rnd(-h(.1),h(.1))
    }else{
      posY = map(i,0,overTopAssets.length,-h(.35),h(.35)) + rnd(-h(.2),h(.2))
    }
    let pElPos = createVector(rnd(-w(.32),w(.32)),posY)
    let imgId = overTopAssetIds[i]
    let imgDiv = rnd(minD,maxD)/3//*2
    let bMode  = BLEND // OVERLAY;
    blendMode(bMode)
    overTopAssets2.push(new PlaceAsset(imgId,pElPos,width/imgDiv,height/imgDiv/aspRatio))
    overTopAssets2[i].setItem()
  }
}

function chooseValue(obj) {
  let keys = Object.keys(obj);
  return obj[keys[ keys.length * rnd() << 0]]
};

function digitalOverlay(theme) {
  if (theme.name === 'digital') {
    //let bModes = [OVERLAY,BURN,SCREEN,HARD_LIGHT,SOFT_LIGHT]
    for (let i = 0; i < 900; i++) {
      let x = map(i,0,900,-w(.5),w(.5))
      for (let j = 0; j < 1600; j++) {
        let y = map(j,0,1600,-h(.5),h(.5))
        //let bMode = bModes[floor(rnd()*bModes.length)]
        let col = chooseValue(theme.bgColors)
        blendMode(bMode)
        fill(col)
        noStroke()
        rect(x,y,width/900,height/1600)
      }
    }
  }
}

////////////////////   THEMES   ///////////////////////////
///////////////////////////////////////////////////////////


class LoadAsset {
  constructor(_fileLoc,_fileName,_id,_type,_arrayToPush) {
    this.fileLoc = _fileLoc;
    this.fileName = _fileName;
    this.id = _id;
    this.type = _type;
    this.arrayToPush = _arrayToPush;
  }
  load() {
    let img = this.fileLoc+'/'+this.fileName+this.id+".png"
    let loadedImg = loadImage(img)
    this.arrayToPush.push(loadedImg)
  }
}

function chooseObjKey(obj) {
  let keys = Object.keys(obj);
  let col = keys[floor(rnd()*keys.length)]
  return obj[col];
}

function chooseTheme() {
  // let theme = chooseObjKey(themes)
  // return theme;
  let tV = map(decPairs[1],0,255,0,1);
  console.log(tV)
  if (tV < .32) {
    theme = themes.rococo
  }else if (tV < .54) {
    theme = themes.countryGarden
  }else if (tV < .72) {
    theme = themes.digital
  }else if (tV < .85){
    theme = themes.cmyk
  }else if (tV < .95){
    theme = themes.graphic
  }else{
    theme = themes.allWhite
  }
  return theme;
}

function chooseComp() {
  // let comp = chooseObjKey(comps)
  // return comp;
  let cV = map(decPairs[0],0,255,0,1);
  if (cV < .33) {
    comp = comps.standard
  }else if (cV < .6) {
    comp = comps.stillLife
  }else if (cV < .78) {
    comp = comps.highVolume
  }else if (cV < .93) {
    comp = comps.dominant
  }else{
    comp = comps.lowDensity
  }
  return comp;
}

class PlaceAsset {
  constructor(_imgId,_pos,_w,_h) {
    this.imgId = _imgId;
    this.pos = _pos;
    this.w = _w;
    this.h = _h;
    this.anOf = rnd(TWO_PI);
    // this.order = _positionInOrder;
  }
  run() {
    let loc = this.moveItem().loc
    let brr = this.moveItem().brr
    this.update(loc,brr)
  }
  setItem() {
    //graphics.image(this.imgId,this.pos.x,this.pos.y,this.w,this.h)
    image(this.imgId,this.pos.x,this.pos.y,this.w,this.h)
  }
  moveItem() {
    //let angle = frameCount / 5;
    let loc = createVector(this.pos.x,this.pos.y)
    let dir = createVector(cos(0), sin(0));
    let speed = -rnd(.1,.5);
    let start = rnd(10,60)
    let rot = rnd(-TWO_PI,TWO_PI)
    //let angle = frameCount/180 + this.anOf //* speed
    let angle = this.anOf
    angle += radians(.01)
    dir.x = cos(angle*2)*w(.001);
    //dir.y = -noise(angle)*w(.0025);
    dir.y = sin(angle)*w(.003)
    //var vel = dir.copy();
    //console.log(dir,vel)
    loc.add(dir);
    //console.log(loc) 
    let brrAngle = frameCount / 30
    let brr = map(sin(brrAngle + this.anOf),-1,1,1,1.1)
    return {loc,brr}
  }
  update(loc,brr) {
    graphics.image(this.imgId,loc.x,loc.y,this.w*brr,this.h*brr)
  }
  addToArray() {
    orderedDraw.push([this.imgId,this.pos.x,this.pos.y,this.w,this.h])
  }
}

function verticalGradient() {
  let num = 1200
  let strW = height/1200
  for (let i = 0; i < num; i++) {
    let x1 = -w(.5)
    let x2 = w(.5)
    let y = -h(.5)+strW*i
    let opacity = 0
    if (i > 800) {
      opacity = map(i,800,1200,0,120)
    }
    strokeWeight(strW)
    stroke(0, opacity)
    line(x1,y,x2,y)
  }
}
