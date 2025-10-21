//
// Global test setup for CRA + Jest
// IMPORTANT: Polyfills must be loaded BEFORE MSW server setup.
// Using CommonJS require here to avoid ESM import hoisting issues.
//

// Load polyfills first
require('./jest.setup');

// Fetch and jest-dom (assertions) next
require('whatwg-fetch');
require('@testing-library/jest-dom');

// Finally set up MSW server lifecycle hooks
const { server } = require('./__mocks__/server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
