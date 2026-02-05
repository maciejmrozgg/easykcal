import '@testing-library/jest-dom';

/**
* JSDOM (test environment) does not implement window.matchMedia.
* The useMediaQuery hook uses matchMedia during render,
* so without this mock, responsive component tests crash.
*
* This does NOT affect production – only tests.
*/
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),            
    removeListener: vi.fn(),         
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});