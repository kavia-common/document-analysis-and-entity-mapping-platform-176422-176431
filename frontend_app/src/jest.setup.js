//
// Jest polyfills for Node test environment
// Ensures TextEncoder/TextDecoder and crypto.webcrypto are available
//

// Use CommonJS require to avoid ESM hoisting issues in CRA/Jest
const { TextEncoder, TextDecoder } = require('util');

// Attach TextEncoder/TextDecoder to global if missing
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

// Provide global.crypto.webcrypto if missing (Node >=15 has require('crypto').webcrypto)
if (typeof global.crypto === 'undefined' || typeof global.crypto.subtle === 'undefined') {
  const crypto = require('crypto');
  // If crypto.webcrypto exists, expose it as global.crypto for web APIs expectations
  if (crypto.webcrypto) {
    global.crypto = crypto.webcrypto;
  } else {
    // Minimal fallback to avoid crashes if webcrypto not present (older Node)
    // Note: subtle crypto will not be available; tests should avoid requiring it.
    global.crypto = {
      getRandomValues: (arr) => crypto.randomFillSync(arr),
    };
  }
}
