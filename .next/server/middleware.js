// runtime can't be in strict mode because a global variable is assign and maybe created.
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["middleware"],{

/***/ "node:async_hooks":
/*!***********************************!*\
  !*** external "node:async_hooks" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:async_hooks");

/***/ }),

/***/ "buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "(middleware)/./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca%5Cmiddleware.ts&page=%2Fmiddleware&rootDir=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca&matchers=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca%5Cmiddleware.ts&page=%2Fmiddleware&rootDir=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca&matchers=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ nHandler)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/globals */ \"(middleware)/./node_modules/next/dist/esm/server/web/globals.js\");\n/* harmony import */ var next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/web/adapter */ \"(middleware)/./node_modules/next/dist/esm/server/web/adapter.js\");\n/* harmony import */ var _middleware_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middleware.ts */ \"(middleware)/./middleware.ts\");\n\n\n// Import the userland code.\n\nconst mod = {\n    ..._middleware_ts__WEBPACK_IMPORTED_MODULE_2__\n};\nconst handler = mod.middleware || mod.default;\nconst page = \"/middleware\";\nif (typeof handler !== \"function\") {\n    throw new Error(`The Middleware \"${page}\" must export a \\`middleware\\` or a \\`default\\` function`);\n}\nfunction nHandler(opts) {\n    return (0,next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_1__.adapter)({\n        ...opts,\n        page,\n        handler\n    });\n}\n\n//# sourceMappingURL=middleware.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1taWRkbGV3YXJlLWxvYWRlci5qcz9hYnNvbHV0ZVBhZ2VQYXRoPUMlM0ElNUNVc2VycyU1Q3JyYXRuJTVDT25lRHJpdmUlNUNEb2N1bWVudHMlNUNHaXRIdWIlNUNkZWNhJTVDbWlkZGxld2FyZS50cyZwYWdlPSUyRm1pZGRsZXdhcmUmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNycmF0biU1Q09uZURyaXZlJTVDRG9jdW1lbnRzJTVDR2l0SHViJTVDZGVjYSZtYXRjaGVycz0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFzQztBQUNpQjtBQUN2RDtBQUN3QztBQUN4QztBQUNBLE9BQU8sMkNBQUk7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxLQUFLO0FBQzVDO0FBQ2U7QUFDZixXQUFXLHFFQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvPzFiYjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwibmV4dC9kaXN0L3NlcnZlci93ZWIvZ2xvYmFsc1wiO1xuaW1wb3J0IHsgYWRhcHRlciB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3dlYi9hZGFwdGVyXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyBfbW9kIGZyb20gXCIuL21pZGRsZXdhcmUudHNcIjtcbmNvbnN0IG1vZCA9IHtcbiAgICAuLi5fbW9kXG59O1xuY29uc3QgaGFuZGxlciA9IG1vZC5taWRkbGV3YXJlIHx8IG1vZC5kZWZhdWx0O1xuY29uc3QgcGFnZSA9IFwiL21pZGRsZXdhcmVcIjtcbmlmICh0eXBlb2YgaGFuZGxlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgTWlkZGxld2FyZSBcIiR7cGFnZX1cIiBtdXN0IGV4cG9ydCBhIFxcYG1pZGRsZXdhcmVcXGAgb3IgYSBcXGBkZWZhdWx0XFxgIGZ1bmN0aW9uYCk7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuSGFuZGxlcihvcHRzKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIoe1xuICAgICAgICAuLi5vcHRzLFxuICAgICAgICBwYWdlLFxuICAgICAgICBoYW5kbGVyXG4gICAgfSk7XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pZGRsZXdhcmUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(middleware)/./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca%5Cmiddleware.ts&page=%2Fmiddleware&rootDir=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca&matchers=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(middleware)/./node_modules/next/dist/esm/api/server.js\");\n\nfunction middleware(request) {\n    const session = request.cookies.get(\"session\");\n    console.log(\"Session cookie:\", session);\n    const currentPath = request.nextUrl.pathname;\n    // Paths that don't require authentication\n    const publicPaths = [\n        \"/login\",\n        \"/signup\",\n        \"/api/auth/session\"\n    ];\n    // Allow public paths and API routes\n    if (publicPaths.includes(currentPath) || currentPath.startsWith(\"/api/\")) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.next();\n    }\n    // Redirect to login if no session exists\n    if (!session?.value) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL(\"/login\", request.url));\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.next();\n}\n// Add paths that should be protected\nconst config = {\n    matcher: [\n        /*\r\n     * Match all request paths except for the ones starting with:\r\n     * - api/auth (API routes that handle authentication)\r\n     * - _next/static (static files)\r\n     * - _next/image (image optimization files)\r\n     * - favicon.ico (favicon file)\r\n     */ \"/((?!api/auth|_next/static|_next/image|favicon.ico).*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEM7QUFHbkMsU0FBU0MsV0FBV0MsT0FBb0I7SUFDN0MsTUFBTUMsVUFBVUQsUUFBUUUsT0FBTyxDQUFDQyxHQUFHLENBQUM7SUFDcENDLFFBQVFDLEdBQUcsQ0FBQyxtQkFBbUJKO0lBQy9CLE1BQU1LLGNBQWNOLFFBQVFPLE9BQU8sQ0FBQ0MsUUFBUTtJQUU1QywwQ0FBMEM7SUFDMUMsTUFBTUMsY0FBYztRQUFDO1FBQVU7UUFBVztLQUFvQjtJQUU5RCxvQ0FBb0M7SUFDcEMsSUFBSUEsWUFBWUMsUUFBUSxDQUFDSixnQkFBZ0JBLFlBQVlLLFVBQVUsQ0FBQyxVQUFVO1FBQ3hFLE9BQU9iLHFEQUFZQSxDQUFDYyxJQUFJO0lBQzFCO0lBRUEseUNBQXlDO0lBQ3pDLElBQUksQ0FBQ1gsU0FBU1ksT0FBTztRQUNuQixPQUFPZixxREFBWUEsQ0FBQ2dCLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLFVBQVVmLFFBQVFnQixHQUFHO0lBQzVEO0lBRUEsT0FBT2xCLHFEQUFZQSxDQUFDYyxJQUFJO0FBQzFCO0FBRUEscUNBQXFDO0FBQzlCLE1BQU1LLFNBQVM7SUFDcEJDLFNBQVM7UUFDUDs7Ozs7O0tBTUMsR0FDRDtLQUNEO0FBQ0gsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9taWRkbGV3YXJlLnRzPzQyMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXHJcbmltcG9ydCB0eXBlIHsgTmV4dFJlcXVlc3QgfSBmcm9tICduZXh0L3NlcnZlcidcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaWRkbGV3YXJlKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IHJlcXVlc3QuY29va2llcy5nZXQoJ3Nlc3Npb24nKVxyXG4gIGNvbnNvbGUubG9nKCdTZXNzaW9uIGNvb2tpZTonLCBzZXNzaW9uKVxyXG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gcmVxdWVzdC5uZXh0VXJsLnBhdGhuYW1lXHJcblxyXG4gIC8vIFBhdGhzIHRoYXQgZG9uJ3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxyXG4gIGNvbnN0IHB1YmxpY1BhdGhzID0gWycvbG9naW4nLCAnL3NpZ251cCcsICcvYXBpL2F1dGgvc2Vzc2lvbiddXHJcbiAgXHJcbiAgLy8gQWxsb3cgcHVibGljIHBhdGhzIGFuZCBBUEkgcm91dGVzXHJcbiAgaWYgKHB1YmxpY1BhdGhzLmluY2x1ZGVzKGN1cnJlbnRQYXRoKSB8fCBjdXJyZW50UGF0aC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLm5leHQoKVxyXG4gIH1cclxuXHJcbiAgLy8gUmVkaXJlY3QgdG8gbG9naW4gaWYgbm8gc2Vzc2lvbiBleGlzdHNcclxuICBpZiAoIXNlc3Npb24/LnZhbHVlKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9sb2dpbicsIHJlcXVlc3QudXJsKSlcclxuICB9XHJcblxyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UubmV4dCgpXHJcbn1cclxuXHJcbi8vIEFkZCBwYXRocyB0aGF0IHNob3VsZCBiZSBwcm90ZWN0ZWRcclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBtYXRjaGVyOiBbXHJcbiAgICAvKlxyXG4gICAgICogTWF0Y2ggYWxsIHJlcXVlc3QgcGF0aHMgZXhjZXB0IGZvciB0aGUgb25lcyBzdGFydGluZyB3aXRoOlxyXG4gICAgICogLSBhcGkvYXV0aCAoQVBJIHJvdXRlcyB0aGF0IGhhbmRsZSBhdXRoZW50aWNhdGlvbilcclxuICAgICAqIC0gX25leHQvc3RhdGljIChzdGF0aWMgZmlsZXMpXHJcbiAgICAgKiAtIF9uZXh0L2ltYWdlIChpbWFnZSBvcHRpbWl6YXRpb24gZmlsZXMpXHJcbiAgICAgKiAtIGZhdmljb24uaWNvIChmYXZpY29uIGZpbGUpXHJcbiAgICAgKi9cclxuICAgICcvKCg/IWFwaS9hdXRofF9uZXh0L3N0YXRpY3xfbmV4dC9pbWFnZXxmYXZpY29uLmljbykuKiknLFxyXG4gIF0sXHJcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIm1pZGRsZXdhcmUiLCJyZXF1ZXN0Iiwic2Vzc2lvbiIsImNvb2tpZXMiLCJnZXQiLCJjb25zb2xlIiwibG9nIiwiY3VycmVudFBhdGgiLCJuZXh0VXJsIiwicGF0aG5hbWUiLCJwdWJsaWNQYXRocyIsImluY2x1ZGVzIiwic3RhcnRzV2l0aCIsIm5leHQiLCJ2YWx1ZSIsInJlZGlyZWN0IiwiVVJMIiwidXJsIiwiY29uZmlnIiwibWF0Y2hlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-_middleware_node_modules_next_dist_compiled_edge-runtime_cookies_index_js-_middleware-d82475","vendors-_middleware_node_modules_next_dist_esm_api_server_js-_shared_node_modules_next_dist_e-3c818d","vendors-_middleware_node_modules_next_dist_esm_server_web_adapter_js-_middleware_node_modules-82379e","vendors-_middleware_node_modules_opentelemetry_api_build_esm_api_metrics_js-_middleware_node_-77a62b","vendors-_middleware_node_modules_opentelemetry_api_build_esm_diag_ComponentLogger_js-_middlew-18ea3f"], () => (__webpack_exec__("(middleware)/./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca%5Cmiddleware.ts&page=%2Fmiddleware&rootDir=C%3A%5CUsers%5Crratn%5COneDrive%5CDocuments%5CGitHub%5Cdeca&matchers=&preferredRegion=&middlewareConfig=e30%3D!")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ (_ENTRIES = typeof _ENTRIES === "undefined" ? {} : _ENTRIES).middleware_middleware = __webpack_exports__;
/******/ }
]);