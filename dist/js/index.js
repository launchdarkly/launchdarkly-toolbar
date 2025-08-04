import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import react, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Input, ListBox, ListBoxItem, Popover, SearchField, Select, SelectValue, Switch, TextField } from "@launchpad-ui/components";
import { useVirtualizer } from "@tanstack/react-virtual";
var __webpack_modules__ = {
    "./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/assets/Audimat3000-Regulier.var-subset.woff2": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = __webpack_require__.p + "static/font/Audimat3000-Regulier.var-subset.woff2";
    },
    "./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/assets/Inter.var-subset.woff2": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = __webpack_require__.p + "static/font/Inter.var-subset.woff2";
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/fonts.css": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/getUrl.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
        var ___CSS_LOADER_URL_IMPORT_0___ = new URL(__webpack_require__("./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/assets/Audimat3000-Regulier.var-subset.woff2"), __webpack_require__.b);
        var ___CSS_LOADER_URL_IMPORT_1___ = new URL(__webpack_require__("./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/assets/Inter.var-subset.woff2"), __webpack_require__.b);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        var ___CSS_LOADER_URL_REPLACEMENT_0___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
        var ___CSS_LOADER_URL_REPLACEMENT_1___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `@font-face {
  font-family: "Audimat 3000 Regulier";
  font-style: normal;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format("woff2");
  font-display: swap;
}

@font-face {
  font-family: Inter;
  font-style: normal;
  font-weight: 300 800;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format("woff2");
  font-display: swap;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/index.css": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `:root {
  --lp-asset-font-audimat-3000-regulier-400-normal: Audimat3000-Regulier. var-subset;
  --lp-asset-font-inter-300-800-normal: Inter. var-subset;
  --lp-duration-0: 0s;
  --lp-duration-100: .1s;
  --lp-duration-150: .15s;
  --lp-duration-200: .2s;
  --lp-duration-250: .25s;
  --lp-duration-300: .3s;
  --lp-duration-350: .35s;
  --lp-duration-400: .4s;
  --lp-duration-500: .5s;
  --lp-font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, Helvetica, Arial, sans-serif;
  --lp-font-family-monospace: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace;
  --lp-font-family-display: "Audimat 3000 Regulier";
  --lp-font-size-800: 3.75rem;
  --lp-font-weight-light: 300;
  --lp-font-weight-regular: 400;
  --lp-font-weight-medium: 500;
  --lp-font-weight-semibold: 600;
  --lp-font-weight-bold: 700;
  --lp-font-weight-extrabold: 800;
  --lp-size-0: 0;
  --lp-size-1: .0625rem;
  --lp-size-2: .125rem;
  --lp-size-3: .1875rem;
  --lp-size-4: .25rem;
  --lp-size-6: .375rem;
  --lp-size-8: .5rem;
  --lp-size-10: .625rem;
  --lp-size-11: .6875rem;
  --lp-size-12: .75rem;
  --lp-size-13: .8125rem;
  --lp-size-14: .875rem;
  --lp-size-15: .9375rem;
  --lp-size-16: 1rem;
  --lp-size-18: 1.125rem;
  --lp-size-20: 1.25rem;
  --lp-size-24: 1.5rem;
  --lp-size-28: 1.75rem;
  --lp-size-32: 2rem;
  --lp-size-36: 2.25rem;
  --lp-size-40: 2.5rem;
  --lp-size-44: 2.75rem;
  --lp-size-48: 3rem;
  --lp-size-56: 3.5rem;
  --lp-size-64: 4rem;
  --lp-size-72: 4.5rem;
  --lp-size-80: 5rem;
  --lp-size-96: 6rem;
  --lp-size-112: 7rem;
  --lp-size-128: 8rem;
  --lp-size-144: 9rem;
  --lp-size-160: 10rem;
  --lp-size-176: 11rem;
  --lp-size-192: 12rem;
  --lp-size-208: 13rem;
  --lp-size-224: 14rem;
  --lp-size-240: 15rem;
  --lp-size-256: 16rem;
  --lp-size-320: 20rem;
  --lp-size-400: 25rem;
  --lp-size-480: 30rem;
  --lp-size-560: 35rem;
  --lp-size-640: 40rem;
  --lp-size-720: 45rem;
  --lp-size-800: 50rem;
  --lp-size-960: 60rem;
  --lp-size-1120: 70rem;
  --lp-size-1200: 75rem;
  --lp-size-1280: 80rem;
  --lp-size-1440: 90rem;
  --lp-viewport-tablet: 46.25rem;
  --lp-viewport-desktop: 62rem;
  --lp-z-index-100: 100;
  --lp-z-index-200: 200;
  --lp-z-index-300: 300;
  --lp-z-index-400: 400;
  --lp-z-index-500: 500;
  --lp-z-index-600: 600;
  --lp-z-index-700: 700;
  --lp-z-index-800: 800;
  --lp-z-index-900: 900;
  --lp-border-radius-regular: var(--lp-size-3);
  --lp-border-radius-medium: var(--lp-size-6);
  --lp-border-radius-large: var(--lp-size-16);
  --lp-border-width-100: var(--lp-size-0);
  --lp-border-width-200: var(--lp-size-1);
  --lp-border-width-300: var(--lp-size-2);
  --lp-font-size-100: var(--lp-size-11);
  --lp-font-size-200: var(--lp-size-13);
  --lp-font-size-300: var(--lp-size-15);
  --lp-font-size-400: var(--lp-size-20);
  --lp-font-size-500: var(--lp-size-24);
  --lp-font-size-600: var(--lp-size-32);
  --lp-font-size-700: var(--lp-size-44);
  --lp-line-height-100: var(--lp-size-16);
  --lp-line-height-200: var(--lp-size-20);
  --lp-line-height-300: var(--lp-size-24);
  --lp-line-height-400: var(--lp-size-28);
  --lp-line-height-500: var(--lp-size-72);
  --lp-gradient-yellow-cyan: linear-gradient(127deg, var(--lp-color-brand-yellow-base) -38.66%, var(--lp-color-brand-cyan-base) 83.73%);
  --lp-gradient-yellow-pink: linear-gradient(148deg, var(--lp-color-brand-yellow-base) 13.5%, var(--lp-color-brand-pink-base) 90.96%);
  --lp-gradient-yellow-blue-pale: linear-gradient(0deg, var(--lp-color-white-50) 0%, var(--lp-color-white-50) 100%), linear-gradient(151deg, var(--lp-color-brand-yellow-light) 5.75%, var(--lp-color-brand-blue-light) 90%);
  --lp-gradient-cyan-blue: linear-gradient(136deg, var(--lp-color-brand-cyan-base) 22.68%, var(--lp-color-brand-blue-base) 127.6%);
  --lp-gradient-cyan-purple: linear-gradient(323deg, var(--lp-color-brand-purple-base) -11.93%, var(--lp-color-brand-cyan-base) 125.4%);
  --lp-gradient-purple-blue: linear-gradient(131deg, var(--lp-color-brand-purple-base) -15.82%, var(--lp-color-brand-blue-base) 118.85%);
  --lp-gradient-purple-pink: linear-gradient(326deg, var(--lp-color-brand-purple-base) -9.86%, var(--lp-color-brand-pink-base) 112.59%);
  --lp-gradient-blue-bg-primary: linear-gradient(40deg, var(--lp-color-brand-blue-light) -30.41%, var(--lp-color-bg-ui-primary) 51.41%);
  --lp-spacing-100: var(--lp-size-0);
  --lp-spacing-200: var(--lp-size-4);
  --lp-spacing-300: var(--lp-size-8);
  --lp-spacing-400: var(--lp-size-12);
  --lp-spacing-500: var(--lp-size-16);
  --lp-spacing-600: var(--lp-size-20);
  --lp-spacing-700: var(--lp-size-24);
  --lp-spacing-800: var(--lp-size-28);
  --lp-spacing-900: var(--lp-size-32);
  --lp-text-heading-1-medium: var(--lp-font-weight-medium) var(--lp-font-size-400) / var(--lp-line-height-400) var(--lp-font-family-base);
  --lp-text-heading-1-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-400) / var(--lp-line-height-400) var(--lp-font-family-base);
  --lp-text-heading-1-extrabold: var(--lp-font-weight-extrabold) var(--lp-font-size-400) / var(--lp-line-height-400) var(--lp-font-family-base);
  --lp-text-heading-2-medium: var(--lp-font-weight-medium) var(--lp-font-size-300) / var(--lp-line-height-300) var(--lp-font-family-base);
  --lp-text-heading-2-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-300) / var(--lp-line-height-300) var(--lp-font-family-base);
  --lp-text-heading-2-extrabold: var(--lp-font-weight-extrabold) var(--lp-font-size-300) / var(--lp-line-height-300) var(--lp-font-family-base);
  --lp-text-heading-3-medium: var(--lp-font-weight-medium) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-heading-3-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-heading-3-extrabold: var(--lp-font-weight-extrabold) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-body-1-regular: var(--lp-font-weight-regular) var(--lp-font-size-300) / var(--lp-line-height-300) var(--lp-font-family-base);
  --lp-text-body-1-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-300) / var(--lp-line-height-300) var(--lp-font-family-base);
  --lp-text-body-1-extrabold: var(--lp-font-weight-extrabold) var(--lp-font-size-300) / var(--lp-line-height-300) var(--lp-font-family-base);
  --lp-text-body-2-regular: var(--lp-font-weight-regular) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-body-2-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-body-2-extrabold: var(--lp-font-weight-extrabold) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-small-1-regular: var(--lp-font-weight-regular) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-base);
  --lp-text-small-1-medium: var(--lp-font-weight-medium) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-base);
  --lp-text-small-1-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-base);
  --lp-text-label-1-regular: var(--lp-font-weight-regular) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-label-1-medium: var(--lp-font-weight-medium) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-label-1-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-base);
  --lp-text-label-2-regular: var(--lp-font-weight-regular) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-base);
  --lp-text-label-2-medium: var(--lp-font-weight-medium) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-base);
  --lp-text-label-2-semibold: var(--lp-font-weight-semibold) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-base);
  --lp-text-code-1-regular: var(--lp-font-weight-regular) var(--lp-font-size-200) / var(--lp-line-height-200) var(--lp-font-family-monospace);
  --lp-text-code-2-regular: var(--lp-font-weight-regular) var(--lp-font-size-100) / var(--lp-line-height-100) var(--lp-font-family-monospace);
  --lp-text-display-1: var(--lp-font-weight-regular) var(--lp-font-size-800) / var(--lp-line-height-500) var(--lp-font-family-display);
  --lp-viewport-mobile: var(--lp-size-0);
  --lp-viewport-wide: var(--lp-size-1200);
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/themes.css": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `:root, [data-theme] {
  --lp-color-gray-0: #f7f9fb;
  --lp-color-gray-50: #eceff2;
  --lp-color-gray-100: #d8dde3;
  --lp-color-gray-200: #c6cbd1;
  --lp-color-gray-300: #a9afb4;
  --lp-color-gray-400: #898e94;
  --lp-color-gray-500: #6c727a;
  --lp-color-gray-600: #545a62;
  --lp-color-gray-700: #3f454c;
  --lp-color-gray-800: #2d3239;
  --lp-color-gray-900: #23252a;
  --lp-color-gray-950: #181a1f;
  --lp-color-blue-0: #f6f8ff;
  --lp-color-blue-50: #e4eaff;
  --lp-color-blue-100: #cfd9ff;
  --lp-color-blue-200: #afbfff;
  --lp-color-blue-300: #8a9eff;
  --lp-color-blue-400: #7084ff;
  --lp-color-blue-500: #425eff;
  --lp-color-blue-600: #3144d9;
  --lp-color-blue-700: #2536a6;
  --lp-color-blue-800: #19267d;
  --lp-color-blue-900: #121d61;
  --lp-color-blue-950: #0b144d;
  --lp-color-purple-0: #fbf6ff;
  --lp-color-purple-50: #f4e9ff;
  --lp-color-purple-100: #e6d0ff;
  --lp-color-purple-200: #dcb9ff;
  --lp-color-purple-300: #cb91ff;
  --lp-color-purple-400: #bd61ff;
  --lp-color-purple-500: #a636ec;
  --lp-color-purple-600: #8717cd;
  --lp-color-purple-700: #6a00a9;
  --lp-color-purple-800: #4e007e;
  --lp-color-purple-900: #3c0262;
  --lp-color-purple-950: #2e004d;
  --lp-color-green-0: #e5ffe8;
  --lp-color-green-50: #c7fbce;
  --lp-color-green-100: #a3f2b4;
  --lp-color-green-200: #6ce090;
  --lp-color-green-300: #1ecb6a;
  --lp-color-green-400: #00a455;
  --lp-color-green-500: #008344;
  --lp-color-green-600: #006933;
  --lp-color-green-700: #005025;
  --lp-color-green-800: #003b1b;
  --lp-color-green-900: #092c17;
  --lp-color-green-950: #00210d;
  --lp-color-red-0: #fff5f6;
  --lp-color-red-50: #ffe8eb;
  --lp-color-red-100: #ffcdd6;
  --lp-color-red-200: #ffb5bd;
  --lp-color-red-300: #ff8a96;
  --lp-color-red-400: #f84f6e;
  --lp-color-red-500: #db2251;
  --lp-color-red-600: #b6073c;
  --lp-color-red-700: #8c062b;
  --lp-color-red-800: #6b001c;
  --lp-color-red-900: #4e0b16;
  --lp-color-red-950: #3c040d;
  --lp-color-black-0: #07080c0d;
  --lp-color-black-50: #07080c1a;
  --lp-color-black-100: #07080c26;
  --lp-color-black-200: #07080c33;
  --lp-color-black-300: #07080c4d;
  --lp-color-black-400: #07080c66;
  --lp-color-black-500: #07080c80;
  --lp-color-black-600: #07080c99;
  --lp-color-black-700: #07080cb3;
  --lp-color-black-800: #07080ccc;
  --lp-color-black-900: #07080ce6;
  --lp-color-black-950: #07080c;
  --lp-color-white-0: #ffffff0d;
  --lp-color-white-50: #ffffff1a;
  --lp-color-white-100: #ffffff26;
  --lp-color-white-200: #fff3;
  --lp-color-white-300: #ffffff4d;
  --lp-color-white-400: #fff6;
  --lp-color-white-500: #ffffff80;
  --lp-color-white-600: #fff9;
  --lp-color-white-700: #ffffffb3;
  --lp-color-white-800: #fffc;
  --lp-color-white-900: #ffffffe6;
  --lp-color-white-950: #fff;
  --lp-color-brand-blue-light: #7084ff;
  --lp-color-brand-blue-base: #405bff;
  --lp-color-brand-blue-dark: #2a3ba6;
  --lp-color-brand-cyan-light: #6de0f7;
  --lp-color-brand-cyan-base: #3dd6f5;
  --lp-color-brand-cyan-dark: #238ca3;
  --lp-color-brand-purple-light: #b675e4;
  --lp-color-brand-purple-base: #a34fde;
  --lp-color-brand-purple-dark: #6a3390;
  --lp-color-brand-pink-light: #ee5dac;
  --lp-color-brand-pink-base: #ff35a2;
  --lp-color-brand-pink-dark: #810b4b;
  --lp-color-brand-orange-light: #ffd099;
  --lp-color-brand-orange-base: #ff9d29;
  --lp-color-brand-orange-dark: #a35901;
  --lp-color-brand-yellow-light: #f7ffaf;
  --lp-color-brand-yellow-base: #ebff38;
  --lp-color-brand-yellow-dark: #818c1f;
  --lp-color-brand-green-light: #e1ffc8;
  --lp-color-brand-green-base: #8bef34;
  --lp-color-brand-green-dark: #439000;
  --lp-color-bg-interactive-tertiary-base: #0000;
  --lp-color-bg-interactive-tertiary-active: #0000;
  --lp-color-border-interactive-primary-base: #0000;
  --lp-color-border-interactive-primary-active: #0000;
  --lp-color-border-interactive-primary-focus: #0000;
  --lp-color-border-interactive-primary-hover: #0000;
  --lp-color-border-interactive-disabled: #0000;
  --lp-color-data-info: #8960c2;
  --lp-color-data-comparison: #a9afb4;
  --lp-color-data-neutral: #94999f;
  --lp-color-data-positive: #008344;
  --lp-color-data-negative: #db2251;
  --lp-color-data-series-1: #34b6d0;
  --lp-color-data-series-2: #febe70;
  --lp-color-data-series-3: #8960c2;
  --lp-color-data-series-4: #008344;
  --lp-color-bg-feedback-primary: var(--lp-color-gray-800);
  --lp-color-bg-feedback-error: var(--lp-color-red-50);
  --lp-color-bg-feedback-info: var(--lp-color-blue-50);
  --lp-color-bg-feedback-success: var(--lp-color-green-50);
  --lp-color-bg-interactive-primary-base: var(--lp-color-blue-500);
  --lp-color-bg-interactive-primary-active: var(--lp-color-blue-500);
  --lp-color-bg-interactive-primary-focus: var(--lp-color-blue-600);
  --lp-color-bg-interactive-primary-hover: var(--lp-color-blue-600);
  --lp-color-bg-interactive-secondary-focus: var(--lp-color-gray-50);
  --lp-color-bg-interactive-secondary-hover: var(--lp-color-gray-50);
  --lp-color-bg-interactive-tertiary-focus: var(--lp-color-gray-50);
  --lp-color-bg-interactive-tertiary-hover: var(--lp-color-gray-50);
  --lp-color-bg-interactive-destructive-base: var(--lp-color-red-500);
  --lp-color-bg-interactive-destructive-active: var(--lp-color-red-500);
  --lp-color-bg-interactive-destructive-focus: var(--lp-color-red-600);
  --lp-color-bg-interactive-destructive-hover: var(--lp-color-red-600);
  --lp-color-bg-interactive-disabled: var(--lp-color-gray-100);
  --lp-color-bg-interactive-link: var(--lp-color-blue-50);
  --lp-color-bg-interactive-selected: var(--lp-color-blue-0);
  --lp-color-bg-ui-primary: var(--lp-color-white-950);
  --lp-color-bg-ui-secondary: var(--lp-color-gray-0);
  --lp-color-bg-ui-tertiary: var(--lp-color-gray-50);
  --lp-color-bg-product-beta: var(--lp-color-purple-100);
  --lp-color-bg-product-federal: var(--lp-color-brand-yellow-base);
  --lp-color-border-feedback-error: var(--lp-color-red-500);
  --lp-color-border-feedback-info: var(--lp-color-blue-500);
  --lp-color-border-feedback-success: var(--lp-color-green-500);
  --lp-color-border-field-active: var(--lp-color-blue-500);
  --lp-color-border-field-focus: var(--lp-color-blue-500);
  --lp-color-border-interactive-focus: var(--lp-color-blue-500);
  --lp-color-border-interactive-selected: var(--lp-color-blue-500);
  --lp-color-border-ui-primary: var(--lp-color-gray-100);
  --lp-color-border-ui-secondary: var(--lp-color-gray-50);
  --lp-color-fill-feedback-error: var(--lp-color-red-500);
  --lp-color-fill-feedback-info: var(--lp-color-blue-500);
  --lp-color-fill-feedback-success: var(--lp-color-green-500);
  --lp-color-fill-interactive-primary: var(--lp-color-white-950);
  --lp-color-fill-interactive-destructive: var(--lp-color-red-500);
  --lp-color-fill-ui-primary: var(--lp-color-gray-700);
  --lp-color-fill-ui-secondary: var(--lp-color-gray-500);
  --lp-color-fill-field-base: var(--lp-color-gray-600);
  --lp-color-shadow-interactive-focus: var(--lp-color-blue-600);
  --lp-color-shadow-interactive-primary: var(--lp-color-white-950);
  --lp-color-shadow-ui-primary: var(--lp-color-black-50);
  --lp-color-shadow-ui-secondary: var(--lp-color-black-0);
  --lp-color-text-feedback-error: var(--lp-color-red-600);
  --lp-color-text-feedback-success: var(--lp-color-green-600);
  --lp-color-text-feedback-info: var(--lp-color-blue-600);
  --lp-color-text-interactive-base: var(--lp-color-blue-600);
  --lp-color-text-interactive-active: var(--lp-color-purple-700);
  --lp-color-text-interactive-primary-base: var(--lp-color-white-950);
  --lp-color-text-interactive-primary-active: var(--lp-color-white-950);
  --lp-color-text-interactive-primary-focus: var(--lp-color-white-950);
  --lp-color-text-interactive-primary-hover: var(--lp-color-white-950);
  --lp-color-text-interactive-secondary: var(--lp-color-gray-600);
  --lp-color-text-interactive-disabled: var(--lp-color-gray-500);
  --lp-color-text-interactive-selected: var(--lp-color-blue-600);
  --lp-color-text-ui-primary-base: var(--lp-color-gray-900);
  --lp-color-text-ui-primary-inverted: var(--lp-color-white-950);
  --lp-color-text-ui-secondary: var(--lp-color-gray-600);
  --lp-color-text-field-disabled: var(--lp-color-gray-500);
  --lp-color-text-field-placeholder: var(--lp-color-gray-500);
  --lp-color-text-product-beta: var(--lp-color-purple-600);
  --lp-color-text-product-federal: var(--lp-color-gray-950);
  --lp-color-text-code-function: var(--lp-color-brand-purple-dark);
  --lp-color-text-code-tag: var(--lp-color-brand-orange-dark);
  --lp-color-text-code-string: var(--lp-color-brand-cyan-dark);
  --lp-color-text-code-comment: var(--lp-color-gray-400);
  --lp-color-text-code-base: var(--lp-color-gray-600);
  --lp-color-text-code-keyword: var(--lp-color-brand-pink-base);
  --lp-color-text-code-title: var(--lp-color-brand-orange-base);
  --lp-color-text-code-number: var(--lp-color-brand-blue-dark);
  --lp-color-bg-interactive-secondary-base: var(--lp-color-bg-ui-primary);
  --lp-color-bg-interactive-secondary-active: var(--lp-color-bg-ui-primary);
  --lp-color-bg-overlay-primary: var(--lp-color-bg-ui-primary);
  --lp-color-bg-overlay-secondary: var(--lp-color-bg-ui-primary);
  --lp-color-bg-field-base: var(--lp-color-bg-ui-primary);
  --lp-color-bg-field-disabled: var(--lp-color-bg-ui-tertiary);
  --lp-color-border-field-base: var(--lp-color-border-ui-primary);
  --lp-color-border-field-error: var(--lp-color-border-feedback-error);
  --lp-color-border-field-disabled: var(--lp-color-border-ui-secondary);
  --lp-color-border-interactive-secondary-base: var(--lp-color-border-ui-primary);
  --lp-color-border-interactive-secondary-active: var(--lp-color-border-ui-primary);
  --lp-color-border-interactive-secondary-focus: var(--lp-color-border-ui-primary);
  --lp-color-border-interactive-secondary-hover: var(--lp-color-border-ui-primary);
  --lp-color-border-interactive-destructive: var(--lp-color-border-feedback-error);
  --lp-color-text-feedback-base: var(--lp-color-text-ui-primary-base);
  --lp-color-text-interactive-destructive: var(--lp-color-text-feedback-error);
}

[data-theme="dark"] {
  --lp-color-bg-interactive-link: #4761ff33;
  --lp-color-data-info: #996dd8;
  --lp-color-data-comparison: #60656a;
  --lp-color-data-neutral: #a8adb3;
  --lp-color-data-positive: #2b9556;
  --lp-color-data-negative: #e84866;
  --lp-color-data-series-1: #23abc5;
  --lp-color-data-series-2: #f6b668;
  --lp-color-data-series-3: #996dd8;
  --lp-color-data-series-4: #2b9556;
  --lp-color-bg-feedback-error: var(--lp-color-red-900);
  --lp-color-bg-feedback-info: var(--lp-color-blue-900);
  --lp-color-bg-feedback-success: var(--lp-color-green-900);
  --lp-color-bg-interactive-primary-base: var(--lp-color-blue-600);
  --lp-color-bg-interactive-primary-active: var(--lp-color-blue-600);
  --lp-color-bg-interactive-primary-focus: var(--lp-color-blue-500);
  --lp-color-bg-interactive-primary-hover: var(--lp-color-blue-500);
  --lp-color-bg-interactive-secondary-focus: var(--lp-color-gray-800);
  --lp-color-bg-interactive-secondary-hover: var(--lp-color-gray-800);
  --lp-color-bg-interactive-tertiary-focus: var(--lp-color-gray-800);
  --lp-color-bg-interactive-tertiary-hover: var(--lp-color-gray-800);
  --lp-color-bg-interactive-destructive-base: var(--lp-color-red-600);
  --lp-color-bg-interactive-destructive-active: var(--lp-color-red-600);
  --lp-color-bg-interactive-destructive-focus: var(--lp-color-red-500);
  --lp-color-bg-interactive-destructive-hover: var(--lp-color-red-500);
  --lp-color-bg-interactive-disabled: var(--lp-color-gray-800);
  --lp-color-bg-interactive-selected: var(--lp-color-blue-950);
  --lp-color-bg-ui-primary: var(--lp-color-gray-950);
  --lp-color-bg-ui-secondary: var(--lp-color-gray-900);
  --lp-color-bg-ui-tertiary: var(--lp-color-gray-800);
  --lp-color-bg-product-beta: var(--lp-color-purple-900);
  --lp-color-bg-product-federal: var(--lp-color-brand-yellow-dark);
  --lp-color-border-feedback-error: var(--lp-color-red-400);
  --lp-color-border-feedback-info: var(--lp-color-blue-400);
  --lp-color-border-feedback-success: var(--lp-color-green-400);
  --lp-color-border-field-active: var(--lp-color-blue-400);
  --lp-color-border-field-focus: var(--lp-color-blue-400);
  --lp-color-border-interactive-focus: var(--lp-color-blue-400);
  --lp-color-border-interactive-selected: var(--lp-color-blue-400);
  --lp-color-border-ui-primary: var(--lp-color-gray-700);
  --lp-color-border-ui-secondary: var(--lp-color-gray-800);
  --lp-color-fill-ui-primary: var(--lp-color-gray-200);
  --lp-color-fill-field-base: var(--lp-color-gray-400);
  --lp-color-shadow-interactive-focus: var(--lp-color-blue-400);
  --lp-color-shadow-interactive-primary: var(--lp-color-gray-950);
  --lp-color-shadow-ui-primary: var(--lp-color-black-200);
  --lp-color-shadow-ui-secondary: var(--lp-color-black-100);
  --lp-color-text-feedback-error: var(--lp-color-red-400);
  --lp-color-text-feedback-success: var(--lp-color-green-400);
  --lp-color-text-feedback-info: var(--lp-color-blue-400);
  --lp-color-text-interactive-base: var(--lp-color-blue-400);
  --lp-color-text-interactive-active: var(--lp-color-purple-400);
  --lp-color-text-interactive-secondary: var(--lp-color-gray-400);
  --lp-color-text-interactive-disabled: var(--lp-color-gray-600);
  --lp-color-text-interactive-selected: var(--lp-color-blue-100);
  --lp-color-text-ui-primary-base: var(--lp-color-gray-0);
  --lp-color-text-ui-primary-inverted: var(--lp-color-gray-950);
  --lp-color-text-ui-secondary: var(--lp-color-gray-400);
  --lp-color-text-field-placeholder: var(--lp-color-gray-400);
  --lp-color-text-product-beta: var(--lp-color-purple-400);
  --lp-color-text-code-function: var(--lp-color-brand-purple-base);
  --lp-color-text-code-tag: var(--lp-color-brand-orange-base);
  --lp-color-text-code-string: var(--lp-color-brand-cyan-light);
  --lp-color-text-code-base: var(--lp-color-gray-200);
  --lp-color-text-code-keyword: var(--lp-color-brand-pink-light);
  --lp-color-text-code-title: var(--lp-color-brand-orange-light);
  --lp-color-text-code-number: var(--lp-color-brand-blue-light);
  --lp-color-bg-overlay-secondary: var(--lp-color-bg-ui-secondary);
  --lp-color-bg-field-base: var(--lp-color-bg-ui-secondary);
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/List/List.css.ts.vanilla.css\",\"source\":\"Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._1inyut70 {
  margin: 0;
  padding: 0;
}

._1inyut71 {
  border-bottom: 1px solid var(--lp-color-gray-800);
  color: var(--lp-color-gray-200);
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  transition: background-color .2s;
  display: flex;
}

._1inyut71:last-child {
  border-bottom: none;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Tabs/Tabs.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE5VTy27jMAy85yt4WaABqkBOk2yqHPdLZIu2uatIhiTntei/LyTbiYqm2fZiSBQ5MxzSi/os7cZx+DsDUOQ7Lc8Cao2n3QygtE6hY04q6r2AbZeinVSKTCNgM9ztAV2t7VFAS0qhibEjqdAKKDj/kUqsp0DWCHCoZaAD7mZvs8VAXtwnb2R3pfgO3DLB3VJk6a3uA8bCYDsBPJ5apKYNN8hSVn8aZ3ujWGW1dQIO0j0xprvhzhonz+wn5/M7xhTLQeaFkVF4GimCk2YSobEOwBcvHqq+pIqVeCF0T3yxXD8DX6w26ZvOr6v589Dw1wuy9l9S+58IzCVJrW89qt7JGGbFms8BpU92PXBiNTlx9U0M6J10aEJ8ioMUUMTjngwbZ8hv/gkw1uC7ldp2p6vYqnc+0neWTECXIK0JrJZ70udMVhZlpfQ4v6Z6uqCAYjUAptBxHPyaJyUf1k5qagyjgHsvoMKJ+XfvA9VnVlkT0IT8KV/Ue5uZ7UWRD0q08c9J43pg9PKD0Y8WdJuyMw5FXpYa1f9oNiPNZLqxgUmt7RFVhrd6AHNsKSB7XX8m99123BAzF75as07Z4z4tx+FOP/R0r0lrEduJxb8i3G729g/Z9pEB7wQAAA==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `.fyao6r0 {
  border-radius: 8px;
  width: 100%;
  padding: 6px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.fyao6r1 {
  gap: 6px;
  width: 100%;
  display: flex;
  position: relative;
}

.fyao6r2 {
  background-color: var(--lp-color-gray-700);
  z-index: 0;
  border-radius: 12px;
  height: 100%;
  transition: left .3s cubic-bezier(.25, .46, .45, .94), width .3s cubic-bezier(.25, .46, .45, .94);
  position: absolute;
  top: 0;
}

.fyao6r3 {
  transition: all var(--lp-duration-150) ease;
  color: var(--lp-color-gray-400);
  cursor: pointer;
  min-width: 0;
  font-family: var(--lp-font-family-base);
  z-index: 1;
  background: none;
  border: none;
  border-radius: 12px;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  position: relative;
}

.fyao6r3:hover {
  color: var(--lp-color-gray-200);
  background-color: var(--lp-color-gray-800);
}

.fyao6r3:disabled {
  color: var(--lp-color-gray-600);
  cursor: not-allowed;
}

.fyao6r4 {
  color: var(--lp-color-white-950);
  background-color: #0000;
}

.fyao6r4:hover {
  background-color: #0000;
}

.fyao6r5 {
  fill: currentColor;
  width: 24px;
  height: 24px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/Header/Header.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE61V227jIBB9z1eMKq2USEuF0zRNyON+yArb2KbFgAA3zq767yuwvdiJm6ZqX5LAHOZyZubk/ve+qfb0GcPfBUDOrRb0RKA0PD8sIHwjx2otqGMoU6KppSVAG6cgKUz4cYmjhlFL4E6oUkHGpGMGaOa4kvbOo6ngpUTcsdqS3u6vNc1zLksCGHa6BQzJVrfekNLspTSqkblPQRkCr9QsERK6O6PS0BPaY7wKaGVyZlCqnFM1gUS3YJXg+eyjp+kjQ3PeWALJWrfdBwbs7TWXqGK8rByBxz6tkuoOeVi8Le57IpNAZODD00DAk3AYc1sI1l5hIXjdTZ2ug9Mjz11FYP3YhR/SGXqg0meWOVRwRyBT0lEu/XXBhWOGQGo8XDJrl3gFXL4y45bJahzmIYQplHTI8j+MQLLpQoWrYx9viwMjVzqx6UkNzwpac3EaAUe3KKWWBeix4o4hq2nGCEh1NFSPM9ucsxr5uuD1ubGOFyfkOWDSjbHvUO6b25PbNZu2wznB+Mc4kceQyG0DuZufrb598w9TQ73TE5WRm/8VpkJlL7cRWyupApuxEX1LcRdevTJTCHUkUPE8Z3KygBvddiMI4FjrUAQzIbi23L7bsxn2eieB/Eh75HR73txeKz69NXi6NU9TTfvAw7tjEx3uvtvh/myaPI2SxZmJ56wx1o+LVvxCLgeVnI5Zf/vlbAGcodJy3xLSTS3g+7UFRi37ebEK0TYplFR+hkK5VzZmPWzMJ/YrBqGdfHEhrslSxKcBP8jow3Y6PVmw9iQj04HwV5U8Hyv5sB4fSml8z26qMUbYTv8rkrMii8t0orGcy3Vmu+ek5HZVjvGqSbzZzIfSs8YYJt0vX/hh8fYPBfEjJ8YIAAA=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._9uh9aj0 {
  background-color: var(--lp-color-gray-900);
  border-bottom: 1px solid var(--lp-color-gray-700);
  border-radius: 12px 12px 0 0;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "logo center actions";
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 0 8px 0 16px;
  display: grid;
}

._9uh9aj1 {
  grid-area: logo;
  align-items: center;
  gap: 8px;
  display: flex;
}

._9uh9aj2 {
  object-fit: contain;
  filter: brightness(0) invert();
  width: 25px;
  height: auto;
}

._9uh9aj3 {
  color: var(--lp-color-gray-400);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--lp-font-family-base);
  white-space: nowrap;
}

._9uh9aj4 {
  grid-area: center;
  justify-content: center;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  display: flex;
}

._9uh9aj5 {
  background-color: var(--lp-color-gray-800);
  color: var(--lp-color-brand-cyan-base);
  font-family: var(--lp-font-family-monospace);
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  border-radius: 5px;
  max-width: 100%;
  padding: 4px 8px;
  font-size: 10px;
  display: block;
  overflow: hidden;
}

._9uh9aj6 {
  grid-area: actions;
  align-items: center;
  gap: 0;
  display: flex;
}

._9uh9aj7, ._9uh9aj8 {
  justify-content: center;
  align-items: center;
  display: flex;
}

._9uh9aj9 {
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  padding: 6px;
  transition: color .2s, background-color .2s;
  display: flex;
}

._9uh9aj9:hover {
  color: var(--lp-color-gray-200);
  background-color: var(--lp-color-gray-800);
}

._9uh9aja {
  fill: var(--lp-color-gray-400);
}

._9uh9ajb {
  height: 36px;
}

._9uh9ajc {
  align-items: center;
  gap: 8px;
  padding-right: 0;
  display: flex;
}

._9uh9ajd {
  width: 100%;
  color: var(--lp-color-gray-400);
}

._9uh9aje {
  fill: var(--lp-color-gray-400);
  width: 16px;
  height: 16px;
}

._9uh9ajf {
  width: 100%;
}

._9uh9ajg {
  justify-content: center;
  width: 100%;
  max-width: 100%;
  display: flex;
  overflow: hidden;
}

._9uh9ajh {
  fill: currentColor;
  width: 16px;
  height: 16px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/LaunchDarklyToolbar.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE61U227jIBB9z1fMy0rJAxVOk17Ix1QYsD0NBgQ4tbvqv6/AdhJvslJ3tQ+2NPjMzDlnGD+8FWYncBgo/FwBOBswojUMKuyVPKwAShujbRlsqetT/EnQSNUzKCilGcDFsfa2M5IIq61ncOJ+TYh2Y0xqzwfySulmLOel8gwK10OwGuVd9POEtiflK20/GDQopTLpTHQ+pC7OoonKpyOJwWk+MKi0yiS5xtoQjKoNDISace9diFgNRFgTlYmXT1+rh9mIIhvhsW7iRXT03ITK+pZYjzUaNtky4hb525yvVfWd9ARbZD/m7BuJV4jdAiFVxTsdU5OknUj0SowTFFZ3rblxI0Svomju2pFLhMj9ktT+t7vBy2B1F1WWZh2DPf1xOIuegg+UsWHwNFnQqNHROf6fI3vK/KaGj7tlwzm25bsSkVSYalgTOWZvKtQx3ccyT9KoENZ0A2hOysd1sTkbGxqP5siALsiX2orjgsvzNZeCjl7ciP3TrK4KveRCf7dc99ZlXDjiucQuMCi2rh9fNGm5aviaG7ZoyGzdbp+HdYXhGfPd2TkuJZqawYvr0/Ovf4szeQr0ImBBrMzEEh8GxWH19QulZ2na2AQAAA==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._1n4ciyy0 {
  z-index: 1000;
  background-color: var(--lp-color-gray-900);
  border: 1px solid var(--lp-color-gray-700);
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  bottom: 20px;
  overflow: hidden;
}

._1n4ciyy1 {
  transform-origin: 100% 100%;
  right: 20px;
}

._1n4ciyy2 {
  transform-origin: 0 100%;
  left: 20px;
}

._1n4ciyy3 {
  cursor: pointer;
}

._1n4ciyy4 {
  cursor: default;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

._1n4ciyy5 {
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
}

._1n4ciyy6 {
  object-fit: contain;
  filter: brightness(0) invert();
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: block;
}

._1n4ciyy7 {
  flex-direction: column;
  width: 100%;
  display: flex;
}

._1n4ciyy8 {
  background-color: var(--lp-color-gray-900);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

._1n4ciyy9 {
  min-height: 450px;
}

._1n4ciyya {
  background-color: var(--lp-color-gray-900);
  border-radius: 0 0 12px 12px;
  align-items: center;
  padding: 8px;
  display: flex;
}

._1n4ciyyb {
  flex: 1;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/TabContent/FlagTabContent.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE62T0XKbMBBF3/0VeulM/CCPcJ04Vb5mgQV2LCRVEgYn03/vSGBMQpom0z7ZLLv3XF1WO2jVefgp2MuGscrowD09o2TZwQ5P11KPVDdBsnshYq0wyjjJzuDuOFeWp2deO7jwvRDb2FKStwouklUKkw4oqjWngK2XrEAd0MVyDVayxxHVkuY9laGRLGHiqGTZ0+bXZje6zJJLc0ZXKdNL1lBZoo69AYfAby9QKbKefHzVNxSQewsFSqZN78CuaTNinxAr+/GXl+SwCGS0jBF0rZ5PcA3r6nh9mBaG63MBqrjLhPjGOPsh7LBd4L+vvsN+lP4g88OUeZqqoCV1WTQuqrw12qQgUv//yHE2fkjGW3A1aa6wCpJlD6P1r+/CrHqfVJtp/Q5CjIo3g9AFEyu+cEapHBz/IKhHIbYsONDegkMdXg9OXyc0pJcOZBNpycenIMcVZKEleY/5iQKfpZLwhJ7uQQ7FqXam06X8ghAPTdfmSW4p8KccEsi4Eh13UFLnpyV+e/B/Ix0/R3qP4aA4rRjvx/GwDDFerIi0xtN4Vx0qCHTGxcQxTdxaIPdGdQHTFTB2urPjGqe/r8RvMovluNn82womSDzIBH87ycRu7xmCj45/A/2qaMCgBQAA\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `.amlvxq0 {
  color: var(--lp-color-gray-200);
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
}

.amlvxq1 {
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
}

.amlvxq2 {
  flex-direction: column;
  flex: 1;
  gap: 4px;
  min-width: 0;
  max-width: calc(100% - 90px);
  display: flex;
}

.amlvxq3 {
  color: var(--lp-color-gray-400);
  font-size: 12px;
  font-family: var(--lp-font-family-monospace);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.amlvxq4 {
  align-items: center;
  gap: 8px;
  margin-left: 16px;
  display: flex;
}

.amlvxq5 {
  scrollbar-color: var(--lp-color-gray-800) transparent;
  scrollbar-width: thin;
  height: 400px;
  overflow: auto;
}

.amlvxq5:hover {
  scrollbar-color: var(--lp-color-gray-700) transparent;
}

.amlvxq5::-webkit-scrollbar {
  background: none;
  width: 8px;
}

.amlvxq5::-webkit-scrollbar-thumb {
  background: var(--lp-color-gray-800);
  border-radius: 4px;
}

.amlvxq5:hover::-webkit-scrollbar-thumb {
  background: var(--lp-color-gray-700);
  border-radius: 4px;
}

.amlvxq5::-webkit-scrollbar-track {
  background: none;
}

.amlvxq6 {
  width: 100%;
  position: relative;
}

.amlvxq7 {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.amlvxq7:hover {
  background-color: var(--lp-color-gray-800);
  transition: background-color .2s;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/TabContent/SettingsTab.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE6VUQXLbMAy8+xU4Ngd6JMVxXPrYh2RoEZLQUCSHhCy5nfw9Q9pO5NhpM+3JowWxCywAL5/KsmEb9wX8XgDsXNAYxM4xu15C6SeIzpCGvQrfhDBe1M64INqgDmJTFHfbxcti+cYhjYos6o6MvkVnncWLhDK/6lVoyUootgsAr7Qm20oo136CqvATbPyUIo2zLCL9QgllNYNGpLZjCesiE+QC5c2CV7lgAMaJBQdlY+NCL2HwHkOtIqagQWYMInpV5zqK5UMSm1Vd5aobg5OEMqVoit6og8xYApSh1gpi7KOEGi1jSPDPITI1B1E7y2hZQhJBsUMeEW160Sp/7m4meJ8Fr1TSr9AUsGZyVqbOh/6d5iPL6lj2zMXVDRdXf3Wx+jj2hyvi03i+MIqc1aiezGH2cIaK3lmXfboUXd/25BPnsyGnPbqaQvYRrb7gf/yHpu7/t6lNFh1Jc3c8gMTWnSZz/m7IGAn1EAJa/pHU35YhdoHsc76kGev34y2q+rkNbrBaQt59rxJByu3JirNouriMqemMVcUJ+4OGyhpuj6ExbpTQkdbHlc7H9h5AY8hHiik0dsSYLw3Tn8MYlN/OL+vlFZtcuVWeBAAA\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._11ftnsv0 {
  border-bottom: 1px solid var(--lp-color-gray-800);
}

._11ftnsv0:last-child {
  border-bottom: none;
}

._11ftnsv1 {
  color: var(--lp-color-gray-400);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin: 0;
  padding: 16px 20px 8px;
  font-size: 12px;
  font-weight: 600;
}

._11ftnsv2 {
  flex: 1;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  display: flex;
}

._11ftnsv3 {
  flex-direction: column;
  gap: 2px;
  display: flex;
}

._11ftnsv4 {
  color: var(--lp-color-gray-200);
  font-size: 14px;
  font-weight: 400;
}

._11ftnsv5 {
  color: var(--lp-color-gray-400);
  font-size: 12px;
  font-family: var(--lp-font-family-monospace);
}

._11ftnsv6 {
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  display: flex;
}

._11ftnsv7 {
  color: var(--lp-color-gray-300);
  font-size: 12px;
  font-family: var(--lp-font-family-monospace);
}

._11ftnsv8 {
  fill: currentColor;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

._11ftnsv9 {
  background: none;
  flex-shrink: 0;
  min-width: 120px;
  max-width: 200px;
}

._11ftnsva {
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  overflow: hidden;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/ActionButtonsContainer.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE+1Ty27bMBC8+yv2aB/o0krsuszHFEuRkgjRJLGkI6lF/72grLpWHk7iFuilN2G0OzM7u1x//TK0/TBw+L4ACKiUcbWADQ898IcFgPSkNDHpU/IHAZvQQ/TWKHhEWjJmAyu99cRqwoHtOV/lJv+oqbK+Y70APCafMWVisDgIqKzuM1BjELAP4/ckzKyukoCCz1EydXMBx5K8tRLpJC1etPKZ8xUkQhcDknZp3tgZlRoBqTHuYfFjsf6VghCs07I1iZ1rx2AafbJwf3IgsWxr8kenxFzjOhVLzfEgR8JLhtfsX8RPqMwxCiiy/lsihGX7TOQVm5t3udnP3Lx1Bbup+sp2iqnkfHC70MOmmNKdz7w7oZV3iUXzTYtz4Qh102q2fLzX8kgxqwZvXNKUoXF0k4x3AtBa4Osigsao88+uMUmzGLDUApzvCMNIbXXPYkPGtSI/hIvEhDIRpdVqjM4HLE0aBPD19lLf+cTQWt9pNe9u8uMQzqflmWh1y0lcSXc7Vv4WLf4v+YNLLv5oycW/WPLdM36qJS4r8oen/ZLQKVYO6JjEqFdAUIOET8DXmxfUb+G5u3IcT9tmU7wvuptG2/6l2e6z45832tTkOQcAAA==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._9ykxyy0 {
  border-bottom: 1px solid var(--lp-color-gray-800);
  scrollbar-color: var(--lp-color-gray-700) transparent;
  scrollbar-width: thin;
  gap: 8px;
  padding: 10px 20px;
  display: flex;
  overflow-x: auto;
}

._9ykxyy0::-webkit-scrollbar {
  background: none;
  height: 4px;
}

._9ykxyy0::-webkit-scrollbar-thumb {
  background: var(--lp-color-gray-700);
  border-radius: 2px;
}

._9ykxyy0::-webkit-scrollbar-track {
  background: none;
}

._9ykxyy1 {
  background: var(--lp-color-gray-800);
  border: 1px solid var(--lp-color-gray-600);
  color: var(--lp-color-gray-200);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 6px;
  flex-shrink: 0;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all .2s;
}

._9ykxyy1:disabled {
  opacity: .5;
  cursor: not-allowed;
}

._9ykxyy1:hover:not(:disabled) {
  background: var(--lp-color-gray-700);
  border-color: var(--lp-color-gray-500);
}

._9ykxyy2 {
  background: var(--lp-color-gray-800);
  border: 1px solid var(--lp-color-gray-600);
  color: var(--lp-color-gray-200);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 6px;
  flex-shrink: 0;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all .2s;
}

._9ykxyy2:disabled {
  opacity: .5;
  cursor: not-allowed;
}

._9ykxyy2:hover:not(:disabled) {
  background: var(--lp-color-gray-700);
  border-color: var(--lp-color-gray-500);
}

._9ykxyy3 {
  background: rgba(from var(--lp-color-brand-cyan-base) r g b / .1);
  border-color: rgba(from var(--lp-color-brand-cyan-base) r g b / .3);
  color: var(--lp-color-brand-cyan-base);
}

._9ykxyy3:hover:not(:disabled) {
  background: rgba(from var(--lp-color-brand-cyan-base) r g b / .15);
  border-color: rgba(from var(--lp-color-brand-cyan-base) r g b / .4);
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/ConnectionStatus.css.ts.vanilla.css\",\"source\":\"Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._16sng780 {
  border-bottom: 1px solid var(--lp-color-gray-800);
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  display: flex;
}

._16sng781 {
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  display: flex;
}

._16sng782 {
  color: var(--lp-color-gray-300);
  font-size: 12px;
  font-family: var(--lp-font-family-monospace);
}

._16sng783 {
  color: var(--lp-color-gray-400);
  font-size: 10px;
  font-family: var(--lp-font-family-monospace);
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/ErrorMessage.css.ts.vanilla.css\",\"source\":\"Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `.iwvpcy0 {
  height: 400px;
}

.iwvpcy1 {
  background: var(--lp-color-red-900);
  border: 1px solid var(--lp-color-red-600);
  color: var(--lp-color-red-200);
  border-radius: 6px;
  margin: 12px 20px;
  padding: 8px 12px;
  font-size: 12px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/FlagControls.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE72UzXLCIBCA73mKvXSmPeAk0fqDxz5IhwRMdorAAJrYju/eCUYTrbXqtD2ywMfut8DgdaI3az+O4SMCWGjlicN3QSFJTT2PAHIttaWwZvaREGlIGJPCsg0ZxfHTPNpGg5aRBAZHZyTbUFhIEQhMYqEIerF0FHKhvLBNuGCGwrQ5pE+QLBMycDKWvxVWrxQnbQ7eMuUMs0L5/qb0pmObacLRityjVhSsrg7ZjHYlL1GRCrkvGwtxG2P1ITaOj7Me3pRAV9d5q7NgFSDTlgtLITE1OC2Rn109OVpNLOO4chTGu6xLgUXpKQzbZma6btqLqqD7HZmu91ooJAcV7QbDOEdVELvjpPcJGgVBF7jxBV97aBw/9JnPgdlyQsG7y/S/gvsPZvTjg0lbVs9fqFyvhV1IXVEokXOhmpgXtSfdhJASjUMXjJToBXGG5YKC0pVl5qSF1/f9ulvbaR8H7Uc9OXPc5afbS7UDT77t532Oezb+QneX+PTkt/pS7K2vZRaAv3wnOjw76uDJR7EfL1BKCvnKNkW8NHbn0fYTl/8/3CwGAAA=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._7oyvt60 {
  color: var(--lp-color-gray-400);
  font-size: 12px;
}

._7oyvt61 {
  align-items: center;
  gap: 8px;
  display: flex;
}

._7oyvt61 label {
  background-color: #0000;
}

._7oyvt62 {
  flex-direction: row;
  align-items: center;
  gap: 4px;
  min-width: 120px;
  max-width: 160px;
  display: flex;
}

._7oyvt63 {
  background: var(--lp-color-gray-900);
  border: 1px solid var(--lp-color-gray-700);
  box-sizing: border-box;
  border-radius: 6px;
  flex: 1;
  align-items: center;
  gap: 2px;
  min-width: 120px;
  max-width: 160px;
  height: 32px;
  padding-right: 2px;
  display: flex;
}

._7oyvt64 {
  align-items: center;
  gap: 2px;
  width: 100%;
  padding-right: 0;
}

._7oyvt65 {
  background: var(--lp-color-gray-900);
  border: 1px solid var(--lp-color-gray-700);
  color: var(--lp-color-gray-200);
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  border-radius: 6px;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: 32px;
  padding: 6px 8px;
  font-size: 14px;
  display: flex;
  overflow: hidden;
}

._7oyvt66 {
  background-color: #0000;
  flex: 1;
  width: 100%;
  height: 32px;
}

._7oyvt67 {
  color: var(--lp-color-gray-200);
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  font-size: 14px;
  overflow: hidden;
}

._7oyvt68 {
  background: none;
  min-width: 120px;
  max-width: 160px;
}

._7oyvt69 {
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  overflow: hidden;
}

._7oyvt6a {
  fill: currentColor;
  width: 16px;
  height: 16px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/GenericHelpText.css.ts.vanilla.css\",\"source\":\"Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._1t10p6i0 {
  min-height: 400px;
  color: var(--lp-color-gray-400);
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  display: flex;
}

._1t10p6i1 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

._1t10p6i2 {
  opacity: .8;
  font-size: 14px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/IconButton.css.ts.vanilla.css\",\"source\":\"LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `.i03vv30 {
  cursor: pointer;
  color: var(--lp-color-gray-400);
  background-color: #0000;
  border: none;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  padding: 8px;
  transition: background-color .2s;
  display: inline-flex;
}

.i03vv30:disabled {
  cursor: not-allowed;
  opacity: .5;
}

.i03vv30:hover:not(:disabled) {
  color: var(--lp-color-gray-200);
  background-color: var(--lp-color-gray-800);
}

.i03vv31 {
  width: 30px;
  height: 30px;
}

.i03vv32 {
  width: 36px;
  height: 36px;
}

.i03vv33 {
  width: 40px;
  height: 40px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/OverrideIndicator.css.ts.vanilla.css\",\"source\":\"LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `.pzduyy0 {
  background-color: rgba(from var(--lp-color-brand-cyan-base) r g b / .1);
  border: 1px solid rgba(from var(--lp-color-brand-cyan-base) r g b / .3);
  border-radius: 12px;
  align-items: center;
  gap: 4px;
  padding: 8px;
  display: inline-flex;
}

.pzduyy1 {
  cursor: pointer;
}

.pzduyy1:hover {
  background-color: rgba(from var(--lp-color-red-500) r g b / .1);
  border-color: rgba(from var(--lp-color-red-500) r g b / .3);
}

.pzduyy2 {
  background-color: var(--lp-color-brand-cyan-base);
  border-radius: 50%;
  flex-shrink: 0;
  width: 6px;
  height: 6px;
}

.pzduyy3 {
  justify-content: center;
  align-items: center;
  width: 50px;
  display: flex;
  position: relative;
}

.pzduyy4 {
  color: var(--lp-color-brand-cyan-base);
  text-transform: uppercase;
  letter-spacing: .5px;
  text-align: center;
  width: 100%;
  font-size: 10px;
  font-weight: 500;
  position: absolute;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/StatusDot.css.ts.vanilla.css\",\"source\":\"Ll8xd3ZvZHZxMCB7CiAgd2lkdGg6IDhweDsKICBoZWlnaHQ6IDhweDsKICBib3JkZXItcmFkaXVzOiA1MCU7Cn0=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `._1wvodvq0 {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/icons/Icon.css.ts.vanilla.css\",\"source\":\"LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var ___CSS_LOADER_EXPORT___ = _rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `.rj9f6c0 {
  fill: currentColor;
  width: 24px;
  height: 24px;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./src/globals.css": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            Z: ()=>__WEBPACK_DEFAULT_EXPORT__
        });
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js");
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1__);
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_index_js_ruleSet_1_rules_2_use_1_builtin_lightningcss_loader_ruleSet_1_rules_2_use_2_node_modules_pnpm_launchpad_ui_tokens_0_12_7_node_modules_launchpad_ui_tokens_dist_index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/index.css");
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_index_js_ruleSet_1_rules_2_use_1_builtin_lightningcss_loader_ruleSet_1_rules_2_use_2_node_modules_pnpm_launchpad_ui_tokens_0_12_7_node_modules_launchpad_ui_tokens_dist_themes_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/themes.css");
        var _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_index_js_ruleSet_1_rules_2_use_1_builtin_lightningcss_loader_ruleSet_1_rules_2_use_2_node_modules_pnpm_launchpad_ui_tokens_0_12_7_node_modules_launchpad_ui_tokens_dist_fonts_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@launchpad-ui+tokens@0.12.7/node_modules/@launchpad-ui/tokens/dist/fonts.css");
        var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
        ___CSS_LOADER_EXPORT___.i(_node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_index_js_ruleSet_1_rules_2_use_1_builtin_lightningcss_loader_ruleSet_1_rules_2_use_2_node_modules_pnpm_launchpad_ui_tokens_0_12_7_node_modules_launchpad_ui_tokens_dist_index_css__WEBPACK_IMPORTED_MODULE_2__.Z);
        ___CSS_LOADER_EXPORT___.i(_node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_index_js_ruleSet_1_rules_2_use_1_builtin_lightningcss_loader_ruleSet_1_rules_2_use_2_node_modules_pnpm_launchpad_ui_tokens_0_12_7_node_modules_launchpad_ui_tokens_dist_themes_css__WEBPACK_IMPORTED_MODULE_3__.Z);
        ___CSS_LOADER_EXPORT___.i(_node_modules_pnpm_rsbuild_core_1_4_12_node_modules_rsbuild_core_compiled_css_loader_index_js_ruleSet_1_rules_2_use_1_builtin_lightningcss_loader_ruleSet_1_rules_2_use_2_node_modules_pnpm_launchpad_ui_tokens_0_12_7_node_modules_launchpad_ui_tokens_dist_fonts_css__WEBPACK_IMPORTED_MODULE_4__.Z);
        ___CSS_LOADER_EXPORT___.push([
            module.id,
            `body {
  font-family: var(--lp-font-family-base);
  color: var(--lp-color-text-ui-primary-base);
  margin: 0;
}
`,
            ""
        ]);
        const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/api.js": function(module) {
        module.exports = function(cssWithMappingToString) {
            var list = [];
            list.toString = function() {
                return this.map(function(item) {
                    var content = "";
                    var needLayer = void 0 !== item[5];
                    if (item[4]) content += "@supports (".concat(item[4], ") {");
                    if (item[2]) content += "@media ".concat(item[2], " {");
                    if (needLayer) content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
                    content += cssWithMappingToString(item);
                    if (needLayer) content += "}";
                    if (item[2]) content += "}";
                    if (item[4]) content += "}";
                    return content;
                }).join("");
            };
            list.i = function(modules, media, dedupe, supports, layer) {
                if ("string" == typeof modules) modules = [
                    [
                        null,
                        modules,
                        void 0
                    ]
                ];
                var alreadyImportedModules = {};
                if (dedupe) for(var k = 0; k < this.length; k++){
                    var id = this[k][0];
                    if (null != id) alreadyImportedModules[id] = true;
                }
                for(var _k = 0; _k < modules.length; _k++){
                    var item = [].concat(modules[_k]);
                    if (!dedupe || !alreadyImportedModules[item[0]]) {
                        if (void 0 !== layer) if (void 0 === item[5]) item[5] = layer;
                        else {
                            item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
                            item[5] = layer;
                        }
                        if (media) if (item[2]) {
                            item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                            item[2] = media;
                        } else item[2] = media;
                        if (supports) if (item[4]) {
                            item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
                            item[4] = supports;
                        } else item[4] = "".concat(supports);
                        list.push(item);
                    }
                }
            };
            return list;
        };
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/getUrl.js": function(module) {
        module.exports = function(url, options) {
            if (!options) options = {};
            if (!url) return url;
            url = String(url.__esModule ? url.default : url);
            if (/^['"].*['"]$/.test(url)) url = url.slice(1, -1);
            if (options.hash) url += options.hash;
            if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
            return url;
        };
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js": function(module) {
        module.exports = function(i) {
            return i[1];
        };
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/injectStylesIntoStyleTag.js": function(module) {
        var stylesInDOM = [];
        function getIndexByIdentifier(identifier) {
            var result = -1;
            for(var i = 0; i < stylesInDOM.length; i++)if (stylesInDOM[i].identifier === identifier) {
                result = i;
                break;
            }
            return result;
        }
        function modulesToDom(list, options) {
            var idCountMap = {};
            var identifiers = [];
            for(var i = 0; i < list.length; i++){
                var item = list[i];
                var id = options.base ? item[0] + options.base : item[0];
                var count = idCountMap[id] || 0;
                var identifier = "".concat(id, " ").concat(count);
                idCountMap[id] = count + 1;
                var indexByIdentifier = getIndexByIdentifier(identifier);
                var obj = {
                    css: item[1],
                    media: item[2],
                    sourceMap: item[3],
                    supports: item[4],
                    layer: item[5]
                };
                if (-1 !== indexByIdentifier) {
                    stylesInDOM[indexByIdentifier].references++;
                    stylesInDOM[indexByIdentifier].updater(obj);
                } else {
                    var updater = addElementStyle(obj, options);
                    options.byIndex = i;
                    stylesInDOM.splice(i, 0, {
                        identifier: identifier,
                        updater: updater,
                        references: 1
                    });
                }
                identifiers.push(identifier);
            }
            return identifiers;
        }
        function addElementStyle(obj, options) {
            var api = options.domAPI(options);
            api.update(obj);
            var updater = function(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) return;
                    api.update(obj = newObj);
                } else api.remove();
            };
            return updater;
        }
        module.exports = function(list, options) {
            options = options || {};
            list = list || [];
            var lastIdentifiers = modulesToDom(list, options);
            return function(newList) {
                newList = newList || [];
                for(var i = 0; i < lastIdentifiers.length; i++){
                    var identifier = lastIdentifiers[i];
                    var index = getIndexByIdentifier(identifier);
                    stylesInDOM[index].references--;
                }
                var newLastIdentifiers = modulesToDom(newList, options);
                for(var _i = 0; _i < lastIdentifiers.length; _i++){
                    var _identifier = lastIdentifiers[_i];
                    var _index = getIndexByIdentifier(_identifier);
                    if (0 === stylesInDOM[_index].references) {
                        stylesInDOM[_index].updater();
                        stylesInDOM.splice(_index, 1);
                    }
                }
                lastIdentifiers = newLastIdentifiers;
            };
        };
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/insertBySelector.js": function(module) {
        var memo = {};
        function getTarget(target) {
            if (void 0 === memo[target]) {
                var styleTarget = document.querySelector(target);
                if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                    styleTarget = styleTarget.contentDocument.head;
                } catch (e) {
                    styleTarget = null;
                }
                memo[target] = styleTarget;
            }
            return memo[target];
        }
        function insertBySelector(insert, style) {
            var target = getTarget(insert);
            if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
            target.appendChild(style);
        }
        module.exports = insertBySelector;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/insertStyleElement.js": function(module) {
        function insertStyleElement(options) {
            var element = document.createElement("style");
            options.setAttributes(element, options.attributes);
            options.insert(element, options.options);
            return element;
        }
        module.exports = insertStyleElement;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/setAttributesWithoutAttributes.js": function(module, __unused_webpack_exports, __webpack_require__) {
        function setAttributesWithoutAttributes(styleElement) {
            var nonce = __webpack_require__.nc;
            if (nonce) styleElement.setAttribute("nonce", nonce);
        }
        module.exports = setAttributesWithoutAttributes;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/styleDomAPI.js": function(module) {
        function apply(styleElement, options, obj) {
            var css = "";
            if (obj.supports) css += "@supports (".concat(obj.supports, ") {");
            if (obj.media) css += "@media ".concat(obj.media, " {");
            var needLayer = void 0 !== obj.layer;
            if (needLayer) css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
            css += obj.css;
            if (needLayer) css += "}";
            if (obj.media) css += "}";
            if (obj.supports) css += "}";
            var sourceMap = obj.sourceMap;
            if (sourceMap && "undefined" != typeof btoa) css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
            options.styleTagTransform(css, styleElement, options.options);
        }
        function removeStyleElement(styleElement) {
            if (null === styleElement.parentNode) return false;
            styleElement.parentNode.removeChild(styleElement);
        }
        function domAPI(options) {
            if ("undefined" == typeof document) return {
                update: function() {},
                remove: function() {}
            };
            var styleElement = options.insertStyleElement(options);
            return {
                update: function(obj) {
                    apply(styleElement, options, obj);
                },
                remove: function() {
                    removeStyleElement(styleElement);
                }
            };
        }
        module.exports = domAPI;
    },
    "./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/styleTagTransform.js": function(module) {
        function styleTagTransform(css, styleElement) {
            if (styleElement.styleSheet) styleElement.styleSheet.cssText = css;
            else {
                while(styleElement.firstChild)styleElement.removeChild(styleElement.firstChild);
                styleElement.appendChild(document.createTextNode(css));
            }
        }
        module.exports = styleTagTransform;
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        id: moduleId,
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
__webpack_require__.m = __webpack_modules__;
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
(()=>{
    __webpack_require__.d = (exports, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.g = (()=>{
        if ('object' == typeof globalThis) return globalThis;
        try {
            return this || new Function('return this')();
        } catch (e) {
            if ('object' == typeof window) return window;
        }
    })();
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.nc = void 0;
})();
(()=>{
    var scriptUrl;
    if ("string" == typeof import.meta.url) scriptUrl = import.meta.url;
    if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
    __webpack_require__.p = scriptUrl + '../';
})();
(()=>{
    // __webpack_require__.b = new URL("../", import.meta.url);
})();
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/ __webpack_require__.n(injectStylesIntoStyleTag);
var styleDomAPI = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/ __webpack_require__.n(styleDomAPI);
var insertBySelector = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/ __webpack_require__.n(insertBySelector);
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/ __webpack_require__.n(setAttributesWithoutAttributes);
var insertStyleElement = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/ __webpack_require__.n(insertStyleElement);
var styleTagTransform = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/style-loader/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/ __webpack_require__.n(styleTagTransform);
var globals = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./src/globals.css");
var options = {};
options.styleTagTransform = styleTagTransform_default();
options.setAttributes = setAttributesWithoutAttributes_default();
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = styleDomAPI_default();
options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(globals.Z, options);
globals.Z && globals.Z.locals && globals.Z.locals;
const SearchContext = /*#__PURE__*/ createContext({
    searchTerm: '',
    setSearchTerm: ()=>{}
});
function SearchProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    return /*#__PURE__*/ jsx(SearchContext.Provider, {
        value: {
            searchTerm,
            setSearchTerm
        },
        children: children
    });
}
function useSearchContext() {
    const context = useContext(SearchContext);
    if (!context) throw new Error('useSearchContext must be used within a SearchProvider');
    return context;
}
var extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/ActionButtonsContainer.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE+1Ty27bMBC8+yv2aB/o0krsuszHFEuRkgjRJLGkI6lF/72grLpWHk7iFuilN2G0OzM7u1x//TK0/TBw+L4ACKiUcbWADQ898IcFgPSkNDHpU/IHAZvQQ/TWKHhEWjJmAyu99cRqwoHtOV/lJv+oqbK+Y70APCafMWVisDgIqKzuM1BjELAP4/ckzKyukoCCz1EydXMBx5K8tRLpJC1etPKZ8xUkQhcDknZp3tgZlRoBqTHuYfFjsf6VghCs07I1iZ1rx2AafbJwf3IgsWxr8kenxFzjOhVLzfEgR8JLhtfsX8RPqMwxCiiy/lsihGX7TOQVm5t3udnP3Lx1Bbup+sp2iqnkfHC70MOmmNKdz7w7oZV3iUXzTYtz4Qh102q2fLzX8kgxqwZvXNKUoXF0k4x3AtBa4Osigsao88+uMUmzGLDUApzvCMNIbXXPYkPGtSI/hIvEhDIRpdVqjM4HLE0aBPD19lLf+cTQWt9pNe9u8uMQzqflmWh1y0lcSXc7Vv4WLf4v+YNLLv5oycW/WPLdM36qJS4r8oen/ZLQKVYO6JjEqFdAUIOET8DXmxfUb+G5u3IcT9tmU7wvuptG2/6l2e6z45832tTkOQcAAA==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var extracted_options = {};
extracted_options.styleTagTransform = styleTagTransform_default();
extracted_options.setAttributes = setAttributesWithoutAttributes_default();
extracted_options.insert = insertBySelector_default().bind(null, "head");
extracted_options.domAPI = styleDomAPI_default();
extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(extracted.Z, extracted_options);
extracted.Z && extracted.Z.locals && extracted.Z.locals;
var container = '_9ykxyy0';
var toggleButton = '_9ykxyy2';
var actionButton = '_9ykxyy1';
var active = '_9ykxyy3';
const ActionButtonsContainer = ({ children })=>/*#__PURE__*/ jsx("div", {
        className: container,
        children: children
    });
const EASING = {
    bounce: [
        0.34,
        1.56,
        0.64,
        1
    ],
    smooth: [
        0.25,
        0.46,
        0.45,
        0.94
    ],
    elastic: [
        0.22,
        1,
        0.36,
        1
    ]
};
const ANIMATION_CONFIG = {
    container: {
        width: {
            duration: 0.5,
            ease: EASING.bounce
        },
        height: {
            duration: 0.5,
            ease: EASING.bounce
        },
        borderRadius: {
            duration: 0.4,
            ease: EASING.smooth
        },
        boxShadow: {
            duration: 0.3,
            ease: 'easeInOut'
        }
    },
    circleLogo: {
        opacity: {
            duration: 0.25,
            ease: 'easeOut'
        },
        scale: {
            duration: 0.3,
            ease: EASING.smooth
        },
        rotate: {
            duration: 0.3,
            ease: EASING.smooth
        }
    },
    toolbarContent: {
        opacity: {
            duration: 0.4,
            ease: EASING.smooth
        },
        y: {
            duration: 0.5,
            ease: EASING.bounce
        },
        scale: {
            duration: 0.5,
            ease: EASING.bounce
        }
    },
    contentArea: {
        opacity: {
            duration: 0.4,
            ease: 'easeInOut'
        },
        maxHeight: {
            duration: 0.5,
            ease: EASING.elastic
        }
    },
    tabContent: {
        duration: 0.3,
        ease: EASING.smooth
    },
    tabsContainer: {
        opacity: {
            duration: 0.5,
            ease: EASING.bounce
        },
        y: {
            duration: 0.5,
            ease: EASING.bounce
        },
        delay: 0.3
    }
};
const DIMENSIONS = {
    collapsed: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    expanded: {
        width: 400,
        borderRadius: 12
    },
    scale: {
        expanded: 1.02,
        collapsed: 1
    },
    slideDistance: 30
};
const SHADOWS = {
    expanded: '0 12px 48px rgba(0, 0, 0, 0.5)',
    hoveredCollapsed: '0 8px 40px rgba(0, 0, 0, 0.4)',
    collapsed: '0 4px 16px rgba(0, 0, 0, 0.3)'
};
function LaunchDarklyIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: className,
        fill: "currentColor",
        preserveAspectRatio: "xMidYMid",
        viewBox: "-.00348466 0 256.88728835 255.31014671",
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        "aria-label": "LaunchDarkly",
        children: /*#__PURE__*/ jsx("path", {
            d: "m129.865 255.306a5.637 5.637 0 0 1 -5.073-3.157 5.355 5.355 0 0 1 .507-5.637l59.98-82.584-105.02 42.899a5.778 5.778 0 0 1 -2.255.479 5.637 5.637 0 0 1 -5.384-4.059 5.412 5.412 0 0 1 2.311-6.172l92.365-54.54-162.632-9.357a5.637 5.637 0 0 1 0-11.106l162.717-9.33-92.393-54.538a5.412 5.412 0 0 1 -2.311-6.173 5.637 5.637 0 0 1 5.355-4.059c.78-.003 1.55.17 2.255.507l105.048 42.955-59.98-82.555a5.355 5.355 0 0 1 -.507-5.638 5.637 5.637 0 0 1 5.046-3.241c1.48.01 2.894.62 3.917 1.691l119.536 119.509a9.076 9.076 0 0 1 0 12.824l-119.592 119.648a5.442 5.442 0 0 1 -3.89 1.634z"
        })
    });
}
var _vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/LaunchDarklyToolbar.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE61U227jIBB9z1fMy0rJAxVOk17Ix1QYsD0NBgQ4tbvqv6/AdhJvslJ3tQ+2NPjMzDlnGD+8FWYncBgo/FwBOBswojUMKuyVPKwAShujbRlsqetT/EnQSNUzKCilGcDFsfa2M5IIq61ncOJ+TYh2Y0xqzwfySulmLOel8gwK10OwGuVd9POEtiflK20/GDQopTLpTHQ+pC7OoonKpyOJwWk+MKi0yiS5xtoQjKoNDISace9diFgNRFgTlYmXT1+rh9mIIhvhsW7iRXT03ITK+pZYjzUaNtky4hb525yvVfWd9ARbZD/m7BuJV4jdAiFVxTsdU5OknUj0SowTFFZ3rblxI0Svomju2pFLhMj9ktT+t7vBy2B1F1WWZh2DPf1xOIuegg+UsWHwNFnQqNHROf6fI3vK/KaGj7tlwzm25bsSkVSYalgTOWZvKtQx3ccyT9KoENZ0A2hOysd1sTkbGxqP5siALsiX2orjgsvzNZeCjl7ciP3TrK4KveRCf7dc99ZlXDjiucQuMCi2rh9fNGm5aviaG7ZoyGzdbp+HdYXhGfPd2TkuJZqawYvr0/Ovf4szeQr0ImBBrMzEEh8GxWH19QulZ2na2AQAAA==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var webpack_plugin_extracted_options = {};
webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(_vanilla_extract_webpack_plugin_extracted.Z, webpack_plugin_extracted_options);
_vanilla_extract_webpack_plugin_extracted.Z && _vanilla_extract_webpack_plugin_extracted.Z.locals && _vanilla_extract_webpack_plugin_extracted.Z.locals;
var contentArea = '_1n4ciyy8';
var tabsContainer = '_1n4ciyya';
var scrollableContent = '_1n4ciyy9';
var toolbarContent = '_1n4ciyy7';
var positionRight = '_1n4ciyy1';
var circleLogo = '_1n4ciyy6';
var positionLeft = '_1n4ciyy2';
var toolbarCircle = '_1n4ciyy3';
var circleContent = '_1n4ciyy5';
var toolbarContainer = '_1n4ciyy0';
var toolbarExpanded = '_1n4ciyy4';
function CircleLogo(props) {
    const { hasBeenExpanded } = props;
    return /*#__PURE__*/ jsx(motion.div, {
        className: circleContent,
        initial: {
            opacity: 0,
            x: '-50%',
            y: '-50%',
            scale: 0.9,
            rotate: 90
        },
        animate: {
            opacity: 1,
            x: '-50%',
            y: '-50%',
            scale: 1,
            rotate: 0
        },
        exit: {
            opacity: 0,
            x: '-50%',
            y: '-50%',
            scale: 0.9,
            rotate: 90
        },
        transition: {
            ...ANIMATION_CONFIG.circleLogo,
            opacity: {
                ...ANIMATION_CONFIG.circleLogo.opacity,
                delay: hasBeenExpanded ? 0.3 : 0
            }
        },
        children: /*#__PURE__*/ jsx(motion.div, {
            whileHover: {
                scale: 1.1
            },
            transition: {
                duration: 0.2,
                ease: 'easeInOut'
            },
            children: /*#__PURE__*/ jsx(LaunchDarklyIcon, {
                className: circleLogo
            })
        })
    }, "circle-logo");
}
var _vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/StatusDot.css.ts.vanilla.css\",\"source\":\"Ll8xd3ZvZHZxMCB7CiAgd2lkdGg6IDhweDsKICBoZWlnaHQ6IDhweDsKICBib3JkZXItcmFkaXVzOiA1MCU7Cn0=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var _vanilla_extract_webpack_plugin_extracted_options = {};
_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, _vanilla_extract_webpack_plugin_extracted_options);
_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && _vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && _vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var statusDot = '_1wvodvq0';
function StatusDot(props) {
    const { status } = props;
    const getStatusColor = ()=>{
        switch(status){
            case 'connected':
                return 'var(--lp-color-green-500)';
            case 'disconnected':
                return 'var(--lp-color-orange-500)';
            case 'error':
                return 'var(--lp-color-red-500)';
        }
    };
    return /*#__PURE__*/ jsx("div", {
        className: `${statusDot}`,
        style: {
            backgroundColor: getStatusColor()
        }
    });
}
var ConnectionStatus_css_ts_vanilla_css_source_Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/ConnectionStatus.css.ts.vanilla.css\",\"source\":\"Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(ConnectionStatus_css_ts_vanilla_css_source_Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, node_modules_vanilla_extract_webpack_plugin_extracted_options);
ConnectionStatus_css_ts_vanilla_css_source_Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && ConnectionStatus_css_ts_vanilla_css_source_Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && ConnectionStatus_css_ts_vanilla_css_source_Ll8xNnNuZzc4MCB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiA4cHggMTZweDsKICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbHAtY29sb3ItZ3JheS04MDApOwp9Ci5fMTZzbmc3ODEgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBnYXA6IDhweDsKICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwp9Ci5fMTZzbmc3ODIgewogIGZvbnQtc2l6ZTogMTJweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0zMDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9Ci5fMTZzbmc3ODMgewogIGZvbnQtc2l6ZTogMTBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIGZvbnQtZmFtaWx5OiB2YXIoLS1scC1mb250LWZhbWlseS1tb25vc3BhY2UpOwp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var lastSync = '_16sng783';
var statusText = '_16sng782';
var statusIndicator = '_16sng781';
var ConnectionStatus_css_connectionStatus = '_16sng780';
function ConnectionStatus(props) {
    const { status, lastSyncTime } = props;
    const getStatusText = ()=>{
        switch(status){
            case 'connected':
                return 'Connected to dev server';
            case 'disconnected':
                return 'Disconnected from dev server';
            case 'error':
                return 'Error connecting to dev server';
        }
    };
    return /*#__PURE__*/ jsxs("div", {
        className: ConnectionStatus_css_connectionStatus,
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: statusIndicator,
                children: [
                    /*#__PURE__*/ jsx(StatusDot, {
                        status: status
                    }),
                    /*#__PURE__*/ jsx("span", {
                        className: statusText,
                        children: getStatusText()
                    })
                ]
            }),
            lastSyncTime > 0 && /*#__PURE__*/ jsxs("span", {
                className: lastSync,
                children: [
                    "Last sync: ",
                    new Date(lastSyncTime).toLocaleTimeString()
                ]
            })
        ]
    });
}
var hh8fYPBfEjJ8YIAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/Header/Header.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE61V227jIBB9z1eMKq2USEuF0zRNyON+yArb2KbFgAA3zq767yuwvdiJm6ZqX5LAHOZyZubk/ve+qfb0GcPfBUDOrRb0RKA0PD8sIHwjx2otqGMoU6KppSVAG6cgKUz4cYmjhlFL4E6oUkHGpGMGaOa4kvbOo6ngpUTcsdqS3u6vNc1zLksCGHa6BQzJVrfekNLspTSqkblPQRkCr9QsERK6O6PS0BPaY7wKaGVyZlCqnFM1gUS3YJXg+eyjp+kjQ3PeWALJWrfdBwbs7TWXqGK8rByBxz6tkuoOeVi8Le57IpNAZODD00DAk3AYc1sI1l5hIXjdTZ2ug9Mjz11FYP3YhR/SGXqg0meWOVRwRyBT0lEu/XXBhWOGQGo8XDJrl3gFXL4y45bJahzmIYQplHTI8j+MQLLpQoWrYx9viwMjVzqx6UkNzwpac3EaAUe3KKWWBeix4o4hq2nGCEh1NFSPM9ucsxr5uuD1ubGOFyfkOWDSjbHvUO6b25PbNZu2wznB+Mc4kceQyG0DuZufrb598w9TQ73TE5WRm/8VpkJlL7cRWyupApuxEX1LcRdevTJTCHUkUPE8Z3KygBvddiMI4FjrUAQzIbi23L7bsxn2eieB/Eh75HR73txeKz69NXi6NU9TTfvAw7tjEx3uvtvh/myaPI2SxZmJ56wx1o+LVvxCLgeVnI5Zf/vlbAGcodJy3xLSTS3g+7UFRi37ebEK0TYplFR+hkK5VzZmPWzMJ/YrBqGdfHEhrslSxKcBP8jow3Y6PVmw9iQj04HwV5U8Hyv5sB4fSml8z26qMUbYTv8rkrMii8t0orGcy3Vmu+ek5HZVjvGqSbzZzIfSs8YYJt0vX/hh8fYPBfEjJ8YIAAA=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var _vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(hh8fYPBfEjJ8YIAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, _vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
hh8fYPBfEjJ8YIAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && hh8fYPBfEjJ8YIAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && hh8fYPBfEjJ8YIAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var centerSection = '_9uh9aj4';
var searchFieldWrapper = '_9uh9ajd';
var searchButtonArea = '_9uh9aj7';
var closeButtonArea = '_9uh9aj8';
var rightSection = '_9uh9aj6';
var environmentWrapper = '_9uh9ajg';
var headerTitle = '_9uh9aj3';
var logo = '_9uh9aj2';
var environmentLabel = '_9uh9aj5';
var searchWrapper = '_9uh9ajf';
var searchField = '_9uh9ajb';
var header = '_9uh9aj0';
var Header_css_actionButton = '_9uh9aj9';
var searchGroup = '_9uh9ajc';
var leftSection = '_9uh9aj1';
function LogoSection() {
    return /*#__PURE__*/ jsxs("div", {
        className: leftSection,
        children: [
            /*#__PURE__*/ jsx(LaunchDarklyIcon, {
                className: logo
            }),
            /*#__PURE__*/ jsx("span", {
                className: headerTitle,
                children: "Developers"
            })
        ]
    });
}
function EnvironmentLabel(props) {
    const { label } = props;
    return /*#__PURE__*/ jsx("div", {
        className: centerSection,
        children: /*#__PURE__*/ jsx("span", {
            className: environmentLabel,
            children: label
        })
    });
}
var IconButton_css_ts_vanilla_css_source_LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/IconButton.css.ts.vanilla.css\",\"source\":\"LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var _pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(IconButton_css_ts_vanilla_css_source_LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, _pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
IconButton_css_ts_vanilla_css_source_LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && IconButton_css_ts_vanilla_css_source_LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && IconButton_css_ts_vanilla_css_source_LmkwM3Z2MzAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGN1cnNvcjogcG9pbnRlcjsKICBwYWRkaW5nOiA4cHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1ncmF5LTQwMCk7Cn0KLmkwM3Z2MzA6ZGlzYWJsZWQgewogIGN1cnNvcjogbm90LWFsbG93ZWQ7CiAgb3BhY2l0eTogMC41Owp9Ci5pMDN2djMwOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKfQouaTAzdnYzMSB7CiAgd2lkdGg6IDMwcHg7CiAgaGVpZ2h0OiAzMHB4Owp9Ci5pMDN2djMyIHsKICB3aWR0aDogMzZweDsKICBoZWlnaHQ6IDM2cHg7Cn0KLmkwM3Z2MzMgewogIHdpZHRoOiA0MHB4OwogIGhlaWdodDogNDBweDsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var medium = 'i03vv32 i03vv30';
var small = 'i03vv31 i03vv30';
var large = 'i03vv33 i03vv30';
function IconButton(props) {
    const { icon, label, onClick, disabled = false, className, size = 'large' } = props;
    const getSizeClass = ()=>{
        switch(size){
            case 'small':
                return small;
            case 'medium':
                return medium;
            case 'large':
                return large;
            default:
                return large;
        }
    };
    return /*#__PURE__*/ jsx("button", {
        className: `${getSizeClass()} ${className || ''}`,
        onClick: onClick,
        disabled: disabled,
        "aria-label": label,
        children: icon
    });
}
var Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/icons/Icon.css.ts.vanilla.css\",\"source\":\"LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && Icon_css_ts_vanilla_css_source_LnJqOWY2YzAgewogIHdpZHRoOiAyNHB4OwogIGhlaWdodDogMjRweDsKICBmaWxsOiBjdXJyZW50Q29sb3I7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var Icon_css_icon = 'rj9f6c0';
function SearchIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M10 2a8 8 0 1 0 5.29 14.29l4.3 4.3a1 1 0 0 0 1.42-1.42l-4.3-4.3A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"
        })
    });
}
function ChevronDownIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M12 15.5l-6-6 1.41-1.41L12 12.67l4.59-4.58L18 9.5z"
        })
    });
}
function EditIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92-1.42L14.06 7.69l1.42 1.42-8.14 8.14H5.92v-1.42zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        })
    });
}
function SyncIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.1-.3 2.13-.82 3.02l1.46 1.46A7.92 7.92 0 0 0 20 12c0-4.42-3.58-8-8-8zm-6 8c0-1.1.3-2.13.82-3.02L5.36 7.52A7.92 7.92 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z"
        })
    });
}
function CheckIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M9 16.17l-3.88-3.88L4 13.41l5 5 12-12-1.41-1.41z"
        })
    });
}
function ToggleOffIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M17 7H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10zm0 8H7a3 3 0 0 1 0-6h10a3 3 0 0 1 0 6zM7 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
        })
    });
}
function GearIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 0 0 .11-.63l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.07 7.07 0 0 0-1.5-.87l-.38-2.65A.5.5 0 0 0 14 3h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.53.2-1.03.48-1.5.87l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .11.63l2.11 1.65c-.04.32-.07.66-.07 1s.03.68.07 1L2.57 14.63a.5.5 0 0 0-.11.63l2 3.46c.14.24.44.33.68.22l2.49-1c.47.39.97.67 1.5.87l.38 2.65c.05.28.28.48.5.48h4c.22 0 .45-.2.5-.48l.38-2.65c.53-.2 1.03-.48 1.5-.87l2.49 1c.24.11.54.02.68-.22l2-3.46a.5.5 0 0 0-.11-.63l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
        })
    });
}
function CancelCircleIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
        })
    });
}
function XIcon({ className }) {
    return /*#__PURE__*/ jsx("svg", {
        className: `${Icon_css_icon} ${className}`,
        fill: "currentColor",
        viewBox: "0 0 20 20",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx("path", {
            fillRule: "evenodd",
            d: "M4.47 4.47a.75.75 0 0 1 1.06 0L10 8.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L11.062 10l4.47 4.47a.75.75 0 0 1-1.06 1.06L10 11.06l-4.47 4.47a.75.75 0 1 1-1.06-1.06L8.94 10 4.47 5.53a.75.75 0 0 1 0-1.06Z",
            clipRule: "evenodd"
        })
    });
}
function SearchSection(props) {
    const { searchTerm, onSearch, setSearchIsExpanded } = props;
    const handleBlur = ()=>{
        if (!searchTerm.trim()) setSearchIsExpanded(false);
    };
    return /*#__PURE__*/ jsx(motion.div, {
        className: searchFieldWrapper,
        initial: {
            scale: 0.95
        },
        animate: {
            scale: 1
        },
        transition: {
            duration: 0.2,
            ease: 'easeOut'
        },
        children: /*#__PURE__*/ jsx(SearchField, {
            "aria-label": "Search",
            "data-theme": "dark",
            onBlur: handleBlur,
            className: searchField,
            children: /*#__PURE__*/ jsxs(Group, {
                className: searchGroup,
                children: [
                    /*#__PURE__*/ jsx(Input, {
                        autoFocus: true,
                        placeholder: "Search",
                        value: searchTerm,
                        onChange: (e)=>{
                            onSearch(e.target.value);
                        }
                    }),
                    /*#__PURE__*/ jsx(IconButton, {
                        icon: /*#__PURE__*/ jsx(CancelCircleIcon, {}),
                        label: "Clear",
                        onClick: ()=>onSearch(''),
                        size: "medium"
                    })
                ]
            })
        })
    });
}
function ActionButtons(props) {
    const { searchIsExpanded, setSearchIsExpanded, onClose, onRefresh, showSearchButton } = props;
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotationCount, setRotationCount] = useState(0);
    const handleRefreshClick = useCallback(()=>{
        if (isSpinning) return;
        setIsSpinning(true);
        setRotationCount((prev)=>prev + 360);
        setTimeout(()=>{
            setIsSpinning(false);
        }, 1000);
        onRefresh();
    }, [
        onRefresh,
        isSpinning
    ]);
    return /*#__PURE__*/ jsxs("div", {
        className: rightSection,
        children: [
            showSearchButton && /*#__PURE__*/ jsx(AnimatePresence, {
                children: !searchIsExpanded && /*#__PURE__*/ jsx(motion.div, {
                    className: searchButtonArea,
                    initial: {
                        opacity: 0,
                        scale: 0.8,
                        x: 10
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        x: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.8,
                        x: 10
                    },
                    transition: {
                        duration: 0.2,
                        ease: 'easeInOut'
                    },
                    children: /*#__PURE__*/ jsx(IconButton, {
                        icon: /*#__PURE__*/ jsx(SearchIcon, {}),
                        label: "Search",
                        onClick: ()=>setSearchIsExpanded(true),
                        className: Header_css_actionButton
                    })
                }, "search-button")
            }),
            /*#__PURE__*/ jsx(IconButton, {
                icon: /*#__PURE__*/ jsx(motion.span, {
                    animate: {
                        rotate: rotationCount
                    },
                    transition: {
                        duration: 1,
                        ease: 'linear'
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center'
                    },
                    children: /*#__PURE__*/ jsx(SyncIcon, {})
                }),
                label: "Refresh",
                onClick: handleRefreshClick,
                className: Header_css_actionButton
            }),
            /*#__PURE__*/ jsx("div", {
                className: closeButtonArea,
                children: /*#__PURE__*/ jsx(motion.div, {
                    whileHover: {
                        scale: 1.05
                    },
                    whileTap: {
                        scale: 0.95
                    },
                    transition: {
                        duration: 0.1
                    },
                    children: /*#__PURE__*/ jsx(IconButton, {
                        icon: /*#__PURE__*/ jsx(ChevronDownIcon, {}),
                        label: "Close toolbar",
                        onClick: onClose,
                        className: Header_css_actionButton
                    })
                })
            })
        ]
    });
}
class DevServerClient {
    baseUrl;
    projectKey = null;
    constructor(baseUrl, projectKey){
        this.baseUrl = baseUrl;
        this.projectKey = projectKey || null;
    }
    setProjectKey(projectKey) {
        this.projectKey = projectKey;
    }
    getProjectKey() {
        return this.projectKey;
    }
    async getProjectData() {
        if (!this.projectKey) throw new Error('No project key set. Call setProjectKey() first.');
        const url = `${this.baseUrl}/dev/projects/${this.projectKey}?expand=overrides&expand=availableVariations`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Dev server error: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            if (error instanceof TypeError) throw new Error(`Failed to connect to dev server at ${this.baseUrl}. Is ldcli dev-server running?`);
            throw error;
        }
    }
    async setOverride(flagKey, value) {
        if (!this.projectKey) throw new Error('No project key set. Call setProjectKey() first.');
        const url = `${this.baseUrl}/dev/projects/${this.projectKey}/overrides/${flagKey}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(value)
            });
            if (!response.ok) throw new Error(`Failed to set override: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            if (error instanceof TypeError) throw new Error(`Failed to connect to dev server at ${this.baseUrl}`);
            throw error;
        }
    }
    async clearOverride(flagKey) {
        if (!this.projectKey) throw new Error('No project key set. Call setProjectKey() first.');
        const url = `${this.baseUrl}/dev/projects/${this.projectKey}/overrides/${flagKey}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Failed to clear override: ${response.status} ${response.statusText}`);
        } catch (error) {
            if (error instanceof TypeError) throw new Error(`Failed to connect to dev server at ${this.baseUrl}`);
            throw error;
        }
    }
    async getAvailableProjects() {
        try {
            const response = await fetch(`${this.baseUrl}/dev/projects`);
            if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            if (error instanceof TypeError) throw new Error(`Failed to connect to dev server at ${this.baseUrl}. Is ldcli dev-server running?`);
            throw error;
        }
    }
}
class FlagStateManager {
    devServerClient;
    listeners = new Set();
    constructor(devServerClient){
        this.devServerClient = devServerClient;
    }
    async getEnhancedFlags() {
        const devServerData = await this.devServerClient.getProjectData();
        const enhancedFlags = {};
        Object.keys(devServerData.flagsState).forEach((flagKey)=>{
            const flagState = devServerData.flagsState[flagKey];
            const override = devServerData.overrides[flagKey];
            const variations = devServerData.availableVariations[flagKey] || [];
            const currentValue = override ? override.value : flagState.value;
            enhancedFlags[flagKey] = {
                key: flagKey,
                name: this.formatFlagName(flagKey),
                currentValue,
                isOverridden: !!override,
                originalValue: flagState.value,
                availableVariations: variations,
                type: this.determineFlagType(variations, currentValue),
                sourceEnvironment: devServerData.sourceEnvironmentKey,
                enabled: null !== flagState.value && void 0 !== flagState.value
            };
        });
        return enhancedFlags;
    }
    formatFlagName(flagKey) {
        return flagKey.split('-').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    determineFlagType(variations, currentValue) {
        if (2 === variations.length && variations.every((v)=>'boolean' == typeof v.value)) return 'boolean';
        if (variations.length > 2) return 'multivariate';
        if ('string' == typeof currentValue) return 'string';
        if ('number' == typeof currentValue) return 'number';
        return 'boolean';
    }
    async setOverride(flagKey, value) {
        await this.devServerClient.setOverride(flagKey, value);
        await this.notifyListeners();
    }
    async clearOverride(flagKey) {
        await this.devServerClient.clearOverride(flagKey);
        await this.notifyListeners();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return ()=>this.listeners.delete(listener);
    }
    async notifyListeners() {
        try {
            const flags = await this.getEnhancedFlags();
            this.listeners.forEach((listener)=>listener(flags));
        } catch (error) {
            console.error('Error notifying listeners:', error);
        }
    }
    destroy() {
        this.listeners.clear();
    }
}
const STORAGE_KEY = 'launchdarkly-toolbar-project';
const LaunchDarklyToolbarContext = /*#__PURE__*/ createContext(null);
const useToolbarContext = ()=>{
    const context = useContext(LaunchDarklyToolbarContext);
    if (!context) throw new Error('useToolbarContext must be used within LaunchDarklyToolbarProvider');
    return context;
};
const LaunchDarklyToolbarProvider = ({ children, config })=>{
    const [toolbarState, setToolbarState] = useState({
        flags: {},
        connectionStatus: 'disconnected',
        lastSyncTime: 0,
        isLoading: true,
        error: null,
        sourceEnvironmentKey: null,
        availableProjects: [],
        currentProjectKey: null
    });
    const devServerClient = useMemo(()=>new DevServerClient(config.devServerUrl || 'http://localhost:8765', config.projectKey), [
        config.devServerUrl,
        config.projectKey
    ]);
    const flagStateManager = useMemo(()=>new FlagStateManager(devServerClient), [
        devServerClient
    ]);
    useEffect(()=>{
        const initializeProject = async ()=>{
            try {
                setToolbarState((prev)=>({
                        ...prev,
                        isLoading: true,
                        error: null
                    }));
                const availableProjects = await devServerClient.getAvailableProjects();
                if (0 === availableProjects.length) throw new Error('No projects found on dev server');
                let projectKeyToUse;
                const savedProjectKey = localStorage.getItem(STORAGE_KEY);
                if (savedProjectKey && availableProjects.includes(savedProjectKey)) projectKeyToUse = savedProjectKey;
                else if (config.projectKey) {
                    if (!availableProjects.includes(config.projectKey)) throw new Error(`Project "${config.projectKey}" not found. Available projects: ${availableProjects.join(', ')}`);
                    projectKeyToUse = config.projectKey;
                } else projectKeyToUse = availableProjects[0];
                localStorage.setItem(STORAGE_KEY, projectKeyToUse);
                devServerClient.setProjectKey(projectKeyToUse);
                setToolbarState((prev)=>({
                        ...prev,
                        availableProjects,
                        currentProjectKey: projectKeyToUse,
                        connectionStatus: 'connected'
                    }));
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                setToolbarState((prev)=>({
                        ...prev,
                        connectionStatus: 'error',
                        error: errorMessage,
                        isLoading: false
                    }));
            }
        };
        initializeProject();
    }, [
        devServerClient,
        config.projectKey
    ]);
    useEffect(()=>{
        const loadProjectData = async ()=>{
            if (!toolbarState.currentProjectKey || 'connected' !== toolbarState.connectionStatus) return;
            try {
                setToolbarState((prev)=>({
                        ...prev,
                        isLoading: true
                    }));
                const projectData = await devServerClient.getProjectData();
                const flags = await flagStateManager.getEnhancedFlags();
                setToolbarState((prev)=>({
                        ...prev,
                        flags,
                        sourceEnvironmentKey: projectData.sourceEnvironmentKey,
                        lastSyncTime: Date.now(),
                        error: null,
                        isLoading: false
                    }));
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                setToolbarState((prev)=>({
                        ...prev,
                        connectionStatus: 'error',
                        error: errorMessage,
                        isLoading: false
                    }));
            }
        };
        loadProjectData();
    }, [
        toolbarState.currentProjectKey,
        toolbarState.connectionStatus,
        devServerClient,
        flagStateManager
    ]);
    useEffect(()=>{
        if ('connected' !== toolbarState.connectionStatus) return;
        const unsubscribe = flagStateManager.subscribe((flags)=>{
            setToolbarState((prev)=>({
                    ...prev,
                    flags,
                    lastSyncTime: Date.now()
                }));
        });
        return unsubscribe;
    }, [
        flagStateManager,
        toolbarState.connectionStatus
    ]);
    useEffect(()=>{
        if (!config.pollIntervalInMs || 'connected' !== toolbarState.connectionStatus) return;
        const checkConnection = async ()=>{
            try {
                const projectData = await devServerClient.getProjectData();
                const flags = await flagStateManager.getEnhancedFlags();
                setToolbarState((prev)=>({
                        ...prev,
                        connectionStatus: 'connected',
                        flags,
                        sourceEnvironmentKey: projectData.sourceEnvironmentKey,
                        lastSyncTime: Date.now(),
                        error: null
                    }));
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                setToolbarState((prev)=>({
                        ...prev,
                        connectionStatus: 'error',
                        error: errorMessage
                    }));
            }
        };
        const interval = setInterval(checkConnection, config.pollIntervalInMs);
        return ()=>clearInterval(interval);
    }, [
        devServerClient,
        flagStateManager,
        config.pollIntervalInMs,
        toolbarState.connectionStatus
    ]);
    const setOverride = useCallback(async (flagKey, value)=>{
        try {
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: true
                }));
            await flagStateManager.setOverride(flagKey, value);
            config.onFlagOverride?.(flagKey, value, true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            config.onError?.(errorMessage);
            setToolbarState((prev)=>({
                    ...prev,
                    error: errorMessage
                }));
        } finally{
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: false
                }));
        }
    }, [
        flagStateManager,
        config
    ]);
    const clearOverride = useCallback(async (flagKey)=>{
        try {
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: true
                }));
            await flagStateManager.clearOverride(flagKey);
            config.onFlagOverride?.(flagKey, null, false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            config.onError?.(errorMessage);
            setToolbarState((prev)=>({
                    ...prev,
                    error: errorMessage
                }));
        } finally{
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: false
                }));
        }
    }, [
        flagStateManager,
        config
    ]);
    const clearAllOverrides = useCallback(async ()=>{
        try {
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: true
                }));
            const overriddenFlags = Object.entries(toolbarState.flags).filter(([_, flag])=>flag.isOverridden);
            await Promise.all(overriddenFlags.map(([flagKey])=>flagStateManager.clearOverride(flagKey)));
            overriddenFlags.forEach(([flagKey])=>{
                config.onFlagOverride?.(flagKey, null, false);
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            config.onError?.(errorMessage);
            setToolbarState((prev)=>({
                    ...prev,
                    error: errorMessage
                }));
        } finally{
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: false
                }));
        }
    }, [
        flagStateManager,
        config,
        toolbarState.flags
    ]);
    const refresh = useCallback(async ()=>{
        try {
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: true
                }));
            const projectData = await devServerClient.getProjectData();
            const flags = await flagStateManager.getEnhancedFlags();
            setToolbarState((prev)=>({
                    ...prev,
                    connectionStatus: 'connected',
                    flags,
                    sourceEnvironmentKey: projectData.sourceEnvironmentKey,
                    lastSyncTime: Date.now(),
                    error: null,
                    isLoading: false
                }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setToolbarState((prev)=>({
                    ...prev,
                    connectionStatus: 'error',
                    error: errorMessage,
                    isLoading: false
                }));
        }
    }, [
        flagStateManager,
        devServerClient
    ]);
    const switchProject = useCallback(async (projectKey)=>{
        try {
            setToolbarState((prev)=>({
                    ...prev,
                    isLoading: true
                }));
            if (!toolbarState.availableProjects.includes(projectKey)) throw new Error(`Project "${projectKey}" not found in available projects`);
            localStorage.setItem(STORAGE_KEY, projectKey);
            devServerClient.setProjectKey(projectKey);
            const projectData = await devServerClient.getProjectData();
            const flags = await flagStateManager.getEnhancedFlags();
            setToolbarState((prev)=>({
                    ...prev,
                    currentProjectKey: projectKey,
                    flags,
                    sourceEnvironmentKey: projectData.sourceEnvironmentKey,
                    lastSyncTime: Date.now(),
                    error: null,
                    isLoading: false
                }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setToolbarState((prev)=>({
                    ...prev,
                    connectionStatus: 'error',
                    error: errorMessage,
                    isLoading: false
                }));
        }
    }, [
        devServerClient,
        flagStateManager,
        toolbarState.availableProjects
    ]);
    const value = useMemo(()=>({
            state: toolbarState,
            setOverride,
            clearOverride,
            clearAllOverrides,
            refresh,
            switchProject
        }), [
        toolbarState,
        setOverride,
        clearOverride,
        clearAllOverrides,
        refresh,
        switchProject
    ]);
    return /*#__PURE__*/ jsx(LaunchDarklyToolbarContext.Provider, {
        value: value,
        children: children
    });
};
function Header(props) {
    const { onClose, onSearch, searchTerm, searchIsExpanded, setSearchIsExpanded, label } = props;
    const { state, refresh } = useToolbarContext();
    const { connectionStatus } = state;
    const isConnected = 'connected' === connectionStatus;
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: header,
                children: [
                    /*#__PURE__*/ jsx(LogoSection, {}),
                    /*#__PURE__*/ jsx("div", {
                        className: centerSection,
                        children: isConnected && /*#__PURE__*/ jsx(AnimatePresence, {
                            mode: "wait",
                            children: searchIsExpanded ? /*#__PURE__*/ jsx(motion.div, {
                                className: searchWrapper,
                                initial: {
                                    opacity: 0,
                                    scale: 0.95
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1
                                },
                                exit: {
                                    opacity: 0,
                                    scale: 0.95
                                },
                                transition: {
                                    duration: 0.2
                                },
                                children: /*#__PURE__*/ jsx(SearchSection, {
                                    searchTerm: searchTerm,
                                    onSearch: onSearch,
                                    setSearchIsExpanded: setSearchIsExpanded
                                })
                            }, "search") : /*#__PURE__*/ jsx(motion.div, {
                                className: environmentWrapper,
                                initial: {
                                    opacity: 0,
                                    scale: 0.9
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1
                                },
                                exit: {
                                    opacity: 0,
                                    scale: 0.9
                                },
                                transition: {
                                    duration: 0.2
                                },
                                children: /*#__PURE__*/ jsx(EnvironmentLabel, {
                                    label: label
                                })
                            }, "environment")
                        })
                    }),
                    /*#__PURE__*/ jsx(ActionButtons, {
                        searchIsExpanded: searchIsExpanded,
                        setSearchIsExpanded: setSearchIsExpanded,
                        onClose: onClose,
                        onRefresh: refresh,
                        showSearchButton: isConnected
                    })
                ]
            }),
            /*#__PURE__*/ jsx(ConnectionStatus, {
                status: connectionStatus,
                lastSyncTime: state.lastSyncTime
            })
        ]
    });
}
const TabsContext = createContext(void 0);
const useTabsContext = ()=>{
    const context = useContext(TabsContext);
    if (!context) throw new Error('useTabsContext must be used within a Tabs component');
    return context;
};
var Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Tabs/Tabs.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE5VTy27jMAy85yt4WaABqkBOk2yqHPdLZIu2uatIhiTntei/LyTbiYqm2fZiSBQ5MxzSi/os7cZx+DsDUOQ7Lc8Cao2n3QygtE6hY04q6r2AbZeinVSKTCNgM9ztAV2t7VFAS0qhibEjqdAKKDj/kUqsp0DWCHCoZaAD7mZvs8VAXtwnb2R3pfgO3DLB3VJk6a3uA8bCYDsBPJ5apKYNN8hSVn8aZ3ujWGW1dQIO0j0xprvhzhonz+wn5/M7xhTLQeaFkVF4GimCk2YSobEOwBcvHqq+pIqVeCF0T3yxXD8DX6w26ZvOr6v589Dw1wuy9l9S+58IzCVJrW89qt7JGGbFms8BpU92PXBiNTlx9U0M6J10aEJ8ioMUUMTjngwbZ8hv/gkw1uC7ldp2p6vYqnc+0neWTECXIK0JrJZ70udMVhZlpfQ4v6Z6uqCAYjUAptBxHPyaJyUf1k5qagyjgHsvoMKJ+XfvA9VnVlkT0IT8KV/Ue5uZ7UWRD0q08c9J43pg9PKD0Y8WdJuyMw5FXpYa1f9oNiPNZLqxgUmt7RFVhrd6AHNsKSB7XX8m99123BAzF75as07Z4z4tx+FOP/R0r0lrEduJxb8i3G729g/Z9pEB7wQAAA==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && Z9pEB7wQAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var tab = 'fyao6r3';
var activeIndicator = 'fyao6r2';
var tabActive = 'fyao6r4';
var Tabs_css_tabsContainer = 'fyao6r1';
var toolbar = 'fyao6r0';
var iconSvg = 'fyao6r5';
const Tabs_Tabs = /*#__PURE__*/ react.forwardRef(function(props, ref) {
    const { defaultActiveTab, activeTab, onTabChange, children } = props;
    const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || '');
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: '0px',
        width: '0px'
    });
    const tabsContainerRef = useRef(null);
    const currentActiveTab = void 0 !== activeTab ? activeTab : internalActiveTab;
    const handleTabChange = (tabId)=>{
        if (onTabChange) onTabChange(tabId);
        else setInternalActiveTab(tabId);
    };
    const updateIndicatorPosition = useCallback(()=>{
        if (!tabsContainerRef.current) return;
        const activeButton = tabsContainerRef.current.querySelector('[aria-selected="true"]');
        if (activeButton) {
            const left = activeButton.offsetLeft;
            const width = activeButton.offsetWidth;
            setIndicatorStyle({
                left: `${left}px`,
                width: `${width}px`
            });
        }
    }, []);
    useEffect(()=>{
        updateIndicatorPosition();
        const timeoutId = setTimeout(updateIndicatorPosition, 200);
        return ()=>clearTimeout(timeoutId);
    }, [
        currentActiveTab,
        updateIndicatorPosition
    ]);
    return /*#__PURE__*/ jsx(TabsContext.Provider, {
        value: {
            activeTab: currentActiveTab,
            onTabChange: handleTabChange
        },
        children: /*#__PURE__*/ jsx("div", {
            ref: ref,
            className: toolbar,
            children: /*#__PURE__*/ jsxs("div", {
                ref: tabsContainerRef,
                className: Tabs_css_tabsContainer,
                children: [
                    children,
                    /*#__PURE__*/ jsx("div", {
                        className: activeIndicator,
                        style: indicatorStyle
                    })
                ]
            })
        })
    });
});
Tabs_Tabs.displayName = 'Tabs';
const TabButton_TabButton = /*#__PURE__*/ react.forwardRef(function(props, ref) {
    const { id, label, icon: IconComponent, disabled } = props;
    const context = useTabsContext();
    const isActive = context.activeTab === id;
    return /*#__PURE__*/ jsxs("button", {
        ref: ref,
        type: "button",
        role: "tab",
        "aria-selected": isActive,
        onClick: ()=>context.onTabChange(id),
        disabled: disabled,
        className: `${tab} ${isActive ? tabActive : ''}`,
        children: [
            IconComponent && /*#__PURE__*/ jsx(IconComponent, {
                className: iconSvg
            }),
            label
        ]
    });
});
TabButton_TabButton.displayName = 'TabButton';
var List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/List/List.css.ts.vanilla.css\",\"source\":\"Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && List_css_ts_vanilla_css_source_Ll8xaW55dXQ3MCB7CiAgcGFkZGluZzogMDsKICBtYXJnaW46IDA7Cn0KLl8xaW55dXQ3MSB7CiAgZGlzcGxheTogZmxleDsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsKICBwYWRkaW5nOiAxNnB4IDIwcHg7CiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLWdyYXktODAwKTsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS0yMDApOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlOwp9Ci5fMWlueXV0NzE6bGFzdC1jaGlsZCB7CiAgYm9yZGVyLWJvdHRvbTogbm9uZTsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var list = '_1inyut70';
var listItem = '_1inyut71';
function List(props) {
    const { children, className } = props;
    return /*#__PURE__*/ jsx("div", {
        className: `${list} ${className || ''}`,
        children: children
    });
}
function ListItem(props) {
    const { children, onClick, className } = props;
    return /*#__PURE__*/ jsx(motion.div, {
        className: `${listItem} ${className || ''}`,
        onClick: onClick,
        whileHover: {
            backgroundColor: onClick ? 'var(--lp-color-gray-850)' : void 0
        },
        transition: {
            duration: 0.2
        },
        children: children
    });
}
var GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/GenericHelpText.css.ts.vanilla.css\",\"source\":\"Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ==\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && GenericHelpText_css_ts_vanilla_css_source_Ll8xdDEwcDZpMCB7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgZ2FwOiAxMnB4OwogIHBhZGRpbmc6IDQwcHggMjBweDsKICBtaW4taGVpZ2h0OiA0MDBweDsKICBjb2xvcjogdmFyKC0tbHAtY29sb3ItZ3JheS00MDApOwogIHRleHQtYWxpZ246IGNlbnRlcjsKfQouXzF0MTBwNmkxIHsKICBtYXJnaW46IDA7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA1MDA7Cn0KLl8xdDEwcDZpMiB7CiAgZm9udC1zaXplOiAxNHB4OwogIG9wYWNpdHk6IDAuODsKfQ_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var genericHelpTextSpan = '_1t10p6i2';
var genericHelpText = '_1t10p6i0';
var genericHelpTextP = '_1t10p6i1';
function GenericHelpText(props) {
    const { title, subtitle } = props;
    return /*#__PURE__*/ jsxs("div", {
        className: genericHelpText,
        children: [
            /*#__PURE__*/ jsx("p", {
                className: genericHelpTextP,
                children: title
            }),
            subtitle && /*#__PURE__*/ jsx("span", {
                className: genericHelpTextSpan,
                children: subtitle
            })
        ]
    });
}
var _3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/FlagControls.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE72UzXLCIBCA73mKvXSmPeAk0fqDxz5IhwRMdorAAJrYju/eCUYTrbXqtD2ywMfut8DgdaI3az+O4SMCWGjlicN3QSFJTT2PAHIttaWwZvaREGlIGJPCsg0ZxfHTPNpGg5aRBAZHZyTbUFhIEQhMYqEIerF0FHKhvLBNuGCGwrQ5pE+QLBMycDKWvxVWrxQnbQ7eMuUMs0L5/qb0pmObacLRityjVhSsrg7ZjHYlL1GRCrkvGwtxG2P1ITaOj7Me3pRAV9d5q7NgFSDTlgtLITE1OC2Rn109OVpNLOO4chTGu6xLgUXpKQzbZma6btqLqqD7HZmu91ooJAcV7QbDOEdVELvjpPcJGgVBF7jxBV97aBw/9JnPgdlyQsG7y/S/gvsPZvTjg0lbVs9fqFyvhV1IXVEokXOhmpgXtSfdhJASjUMXjJToBXGG5YKC0pVl5qSF1/f9ulvbaR8H7Uc9OXPc5afbS7UDT77t532Oezb+QneX+PTkt/pS7K2vZRaAv3wnOjw76uDJR7EfL1BKCvnKNkW8NHbn0fYTl/8/3CwGAAA=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var _3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, _3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
_3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && _3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && _3CwGAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var switch_ = '_7oyvt60';
var customVariantField = '_7oyvt66';
var customVariantFieldGroup = '_7oyvt64';
var currentValueText = '_7oyvt67';
var FlagControls_css_icon = '_7oyvt6a';
var switchContainer = '_7oyvt61';
var currentValueGroup = '_7oyvt63';
var customVariantContainer = '_7oyvt62';
var selectedValue = '_7oyvt69';
var FlagControls_css_select = '_7oyvt68';
function BooleanFlagControl(props) {
    const { flag, onOverride, disabled = false } = props;
    return /*#__PURE__*/ jsx("div", {
        className: switchContainer,
        children: /*#__PURE__*/ jsx(Switch, {
            "data-theme": "dark",
            isSelected: flag.currentValue,
            onChange: onOverride,
            isDisabled: disabled,
            className: switch_
        })
    });
}
function MultivariateFlagControl(props) {
    const { flag, onOverride, disabled = false } = props;
    const currentVariation = flag.availableVariations.find((v)=>v.value === flag.currentValue);
    return /*#__PURE__*/ jsxs(Select, {
        selectedKey: currentVariation?._id,
        onSelectionChange: (key)=>{
            const variation = flag.availableVariations.find((v)=>v._id === key);
            if (variation) onOverride(variation.value);
        },
        "aria-label": "Select variant",
        placeholder: "Select variant",
        "data-theme": "dark",
        className: FlagControls_css_select,
        isDisabled: disabled,
        children: [
            /*#__PURE__*/ jsxs(Button, {
                children: [
                    /*#__PURE__*/ jsx(SelectValue, {
                        className: selectedValue
                    }),
                    /*#__PURE__*/ jsx(ChevronDownIcon, {
                        className: FlagControls_css_icon
                    })
                ]
            }),
            /*#__PURE__*/ jsx(Popover, {
                "data-theme": "dark",
                children: /*#__PURE__*/ jsx(ListBox, {
                    children: flag.availableVariations.map((variation)=>/*#__PURE__*/ jsx(ListBoxItem, {
                            id: variation._id,
                            children: variation.name
                        }, variation._id))
                })
            })
        ]
    });
}
function StringNumberFlagControl(props) {
    const { flag, onOverride, disabled = false } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(String(flag.currentValue));
    const handleConfirm = ()=>{
        const finalValue = 'number' === flag.type ? parseFloat(tempValue) : tempValue;
        onOverride(finalValue);
        setIsEditing(false);
    };
    const handleCancel = ()=>{
        setTempValue(String(flag.currentValue));
        setIsEditing(false);
    };
    return /*#__PURE__*/ jsx("div", {
        className: customVariantContainer,
        children: isEditing ? /*#__PURE__*/ jsx(TextField, {
            "aria-label": `Enter ${flag.type} value`,
            className: customVariantField,
            "data-theme": "dark",
            children: /*#__PURE__*/ jsxs(Group, {
                className: customVariantFieldGroup,
                children: [
                    /*#__PURE__*/ jsx(Input, {
                        placeholder: `Enter ${flag.type} value`,
                        value: tempValue,
                        onChange: (e)=>setTempValue(e.target.value),
                        type: 'number' === flag.type ? 'number' : 'text'
                    }),
                    /*#__PURE__*/ jsx(IconButton, {
                        icon: /*#__PURE__*/ jsx(CheckIcon, {}),
                        label: "Confirm",
                        onClick: handleConfirm
                    }),
                    /*#__PURE__*/ jsx(IconButton, {
                        icon: /*#__PURE__*/ jsx(XIcon, {}),
                        label: "Cancel",
                        onClick: handleCancel
                    })
                ]
            })
        }) : /*#__PURE__*/ jsxs("div", {
            className: currentValueGroup,
            children: [
                /*#__PURE__*/ jsx("div", {
                    className: currentValueText,
                    children: String(flag.currentValue)
                }),
                /*#__PURE__*/ jsx(IconButton, {
                    icon: /*#__PURE__*/ jsx(EditIcon, {}),
                    label: "Edit",
                    onClick: ()=>setIsEditing(true),
                    disabled: disabled
                })
            ]
        })
    });
}
var OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/OverrideIndicator.css.ts.vanilla.css\",\"source\":\"LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0=\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && OverrideIndicator_css_ts_vanilla_css_source_LnB6ZHV5eTAgewogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgZ2FwOiA0cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLWJyYW5kLWN5YW4tYmFzZSkgciBnIGIgLyAwLjEpOwogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpIHIgZyBiIC8gMC4zKTsKICBib3JkZXItcmFkaXVzOiAxMnB4OwogIHBhZGRpbmc6IDhweCA4cHg7Cn0KLnB6ZHV5eTEgewogIGN1cnNvcjogcG9pbnRlcjsKfQoucHpkdXl5MTpob3ZlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYShmcm9tIHZhcigtLWxwLWNvbG9yLXJlZC01MDApIHIgZyBiIC8gMC4xKTsKICBib3JkZXItY29sb3I6IHJnYmEoZnJvbSB2YXIoLS1scC1jb2xvci1yZWQtNTAwKSByIGcgYiAvIDAuMyk7Cn0KLnB6ZHV5eTIgewogIHdpZHRoOiA2cHg7CiAgaGVpZ2h0OiA2cHg7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbHAtY29sb3ItYnJhbmQtY3lhbi1iYXNlKTsKICBib3JkZXItcmFkaXVzOiA1MCU7CiAgZmxleC1zaHJpbms6IDA7Cn0KLnB6ZHV5eTMgewogIHdpZHRoOiA1MHB4OwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBwb3NpdGlvbjogcmVsYXRpdmU7Cn0KLnB6ZHV5eTQgewogIGZvbnQtc2l6ZTogMTBweDsKICBmb250LXdlaWdodDogNTAwOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1icmFuZC1jeWFuLWJhc2UpOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7CiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4OwogIHRleHQtYWxpZ246IGNlbnRlcjsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgd2lkdGg6IDEwMCU7Cn0_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var overrideDot = 'pzduyy2';
var overrideTextContainer = 'pzduyy3';
var overrideText = 'pzduyy4';
var interactive = 'pzduyy1';
var overrideIndicator = 'pzduyy0';
function OverrideIndicator(props) {
    const { onClear } = props;
    const [isHovered, setIsHovered] = useState(false);
    return /*#__PURE__*/ jsxs(motion.span, {
        className: `${overrideIndicator} ${onClear ? interactive : ''}`,
        onMouseEnter: ()=>setIsHovered(true),
        onMouseLeave: ()=>setIsHovered(false),
        onClick: onClear,
        title: onClear ? 'Click to remove override' : 'Override active',
        whileHover: onClear ? {
            scale: 1.05
        } : {},
        transition: {
            duration: 0.2
        },
        children: [
            /*#__PURE__*/ jsx(motion.span, {
                className: overrideDot,
                animate: isHovered && onClear ? {
                    backgroundColor: 'var(--lp-color-red-500)'
                } : {
                    backgroundColor: 'var(--lp-color-brand-cyan-base)'
                },
                transition: {
                    duration: 0.2
                }
            }),
            /*#__PURE__*/ jsx("div", {
                className: overrideTextContainer,
                children: /*#__PURE__*/ jsx(AnimatePresence, {
                    mode: "wait",
                    children: /*#__PURE__*/ jsx(motion.span, {
                        className: overrideText,
                        initial: {
                            opacity: 0,
                            y: -2
                        },
                        animate: {
                            opacity: 1,
                            y: 0,
                            color: isHovered && onClear ? 'var(--lp-color-red-500)' : 'var(--lp-color-brand-cyan-base)'
                        },
                        exit: {
                            opacity: 0,
                            y: 2
                        },
                        transition: {
                            duration: 0.15
                        },
                        children: isHovered && onClear ? 'Remove' : 'Override'
                    }, isHovered && onClear ? 'remove' : 'override')
                })
            })
        ]
    });
}
var _2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/TabContent/FlagTabContent.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE62T0XKbMBBF3/0VeulM/CCPcJ04Vb5mgQV2LCRVEgYn03/vSGBMQpom0z7ZLLv3XF1WO2jVefgp2MuGscrowD09o2TZwQ5P11KPVDdBsnshYq0wyjjJzuDuOFeWp2deO7jwvRDb2FKStwouklUKkw4oqjWngK2XrEAd0MVyDVayxxHVkuY9laGRLGHiqGTZ0+bXZje6zJJLc0ZXKdNL1lBZoo69AYfAby9QKbKefHzVNxSQewsFSqZN78CuaTNinxAr+/GXl+SwCGS0jBF0rZ5PcA3r6nh9mBaG63MBqrjLhPjGOPsh7LBd4L+vvsN+lP4g88OUeZqqoCV1WTQuqrw12qQgUv//yHE2fkjGW3A1aa6wCpJlD6P1r+/CrHqfVJtp/Q5CjIo3g9AFEyu+cEapHBz/IKhHIbYsONDegkMdXg9OXyc0pJcOZBNpycenIMcVZKEleY/5iQKfpZLwhJ7uQQ7FqXam06X8ghAPTdfmSW4p8KccEsi4Eh13UFLnpyV+e/B/Ix0/R3qP4aA4rRjvx/GwDDFerIi0xtN4Vx0qCHTGxcQxTdxaIPdGdQHTFTB2urPjGqe/r8RvMovluNn82womSDzIBH87ycRu7xmCj45/A/2qaMCgBQAA\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var _2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, _2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
_2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && _2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && _2qaMCgBQAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var flagName = 'amlvxq0';
var virtualContainer = 'amlvxq5';
var flagHeader = 'amlvxq2';
var FlagTabContent_css_flagKey = 'amlvxq3';
var flagOptions = 'amlvxq4';
var virtualInner = 'amlvxq6';
var FlagTabContent_css_virtualItem = 'amlvxq7';
var flagNameText = 'amlvxq1';
function FlagTabContent() {
    const { searchTerm } = useSearchContext();
    const { state, setOverride, clearOverride, clearAllOverrides } = useToolbarContext();
    const { flags } = state;
    const [showOverriddenOnly, setShowOverriddenOnly] = useState(false);
    const parentRef = useRef(null);
    const flagEntries = Object.entries(flags);
    const filteredFlags = flagEntries.filter(([flagKey, flag])=>{
        const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) || flagKey.toLowerCase().includes(searchTerm.trim().toLowerCase());
        const matchesOverrideFilter = showOverriddenOnly ? flag.isOverridden : true;
        return matchesSearch && matchesOverrideFilter;
    });
    const virtualizer = useVirtualizer({
        count: filteredFlags.length,
        getScrollElement: ()=>parentRef.current,
        estimateSize: ()=>85,
        overscan: 5
    });
    const totalOverriddenFlags = Object.values(flags).filter((flag)=>flag.isOverridden).length;
    const renderFlagControl = (flag)=>{
        const handleOverride = (value)=>setOverride(flag.key, value);
        switch(flag.type){
            case 'boolean':
                return /*#__PURE__*/ jsx(BooleanFlagControl, {
                    flag: flag,
                    onOverride: handleOverride,
                    disabled: !flag.enabled
                });
            case 'multivariate':
                return /*#__PURE__*/ jsx(MultivariateFlagControl, {
                    flag: flag,
                    onOverride: handleOverride,
                    disabled: !flag.enabled
                });
            case 'string':
            case 'number':
                return /*#__PURE__*/ jsx(StringNumberFlagControl, {
                    flag: flag,
                    onOverride: handleOverride,
                    disabled: !flag.enabled
                });
            default:
                return /*#__PURE__*/ jsxs("div", {
                    children: [
                        "Unsupported flag type: ",
                        flag.type
                    ]
                });
        }
    };
    const onRemoveAllOverrides = ()=>{
        clearAllOverrides();
        setShowOverriddenOnly(false);
    };
    const onClearOverride = (flagKey)=>{
        if (totalOverriddenFlags <= 1) setShowOverriddenOnly(false);
        clearOverride(flagKey);
    };
    const genericHelpTitle = showOverriddenOnly ? 'No overrides found' : 'No flags found';
    const genericHelpSubtitle = showOverriddenOnly ? 'You have not set any overrides yet' : 'Try adjusting your search';
    return /*#__PURE__*/ jsx("div", {
        "data-testid": "flag-tab-content",
        children: /*#__PURE__*/ jsxs(Fragment, {
            children: [
                /*#__PURE__*/ jsxs(ActionButtonsContainer, {
                    children: [
                        /*#__PURE__*/ jsx("button", {
                            className: `${toggleButton} ${showOverriddenOnly ? active : ''}`,
                            onClick: ()=>setShowOverriddenOnly((prev)=>!prev),
                            disabled: state.isLoading,
                            children: "Show overrides only"
                        }),
                        /*#__PURE__*/ jsxs("button", {
                            className: actionButton,
                            onClick: onRemoveAllOverrides,
                            disabled: state.isLoading || 0 === totalOverriddenFlags,
                            children: [
                                "Remove all overrides (",
                                totalOverriddenFlags,
                                ")"
                            ]
                        })
                    ]
                }),
                0 === filteredFlags.length && (searchTerm.trim() || showOverriddenOnly) ? /*#__PURE__*/ jsx(GenericHelpText, {
                    title: genericHelpTitle,
                    subtitle: genericHelpSubtitle
                }) : /*#__PURE__*/ jsx("div", {
                    ref: parentRef,
                    className: virtualContainer,
                    children: /*#__PURE__*/ jsx(List, {
                        children: /*#__PURE__*/ jsx("div", {
                            className: virtualInner,
                            style: {
                                height: virtualizer.getTotalSize()
                            },
                            children: virtualizer.getVirtualItems().map((virtualItem)=>{
                                const [_, flag] = filteredFlags[virtualItem.index];
                                return /*#__PURE__*/ jsx("div", {
                                    className: FlagTabContent_css_virtualItem,
                                    style: {
                                        height: `${virtualItem.size}px`,
                                        transform: `translateY(${virtualItem.start}px)`,
                                        borderBottom: '1px solid var(--lp-color-gray-800)'
                                    },
                                    children: /*#__PURE__*/ jsxs(ListItem, {
                                        children: [
                                            /*#__PURE__*/ jsxs("div", {
                                                className: flagHeader,
                                                children: [
                                                    /*#__PURE__*/ jsxs("span", {
                                                        className: flagName,
                                                        children: [
                                                            /*#__PURE__*/ jsx("span", {
                                                                className: flagNameText,
                                                                children: flag.name
                                                            }),
                                                            flag.isOverridden && /*#__PURE__*/ jsx(OverrideIndicator, {
                                                                onClear: ()=>onClearOverride(flag.key)
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ jsx("span", {
                                                        className: FlagTabContent_css_flagKey,
                                                        children: flag.key
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx("div", {
                                                className: flagOptions,
                                                children: renderFlagControl(flag)
                                            })
                                        ]
                                    })
                                }, virtualItem.key);
                            })
                        })
                    })
                })
            ]
        })
    });
}
var OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/TabContent/SettingsTab.css.ts.vanilla.css\",\"source\":\"​#H4sIAAAAAAAAE6VUQXLbMAy8+xU4Ngd6JMVxXPrYh2RoEZLQUCSHhCy5nfw9Q9pO5NhpM+3JowWxCywAL5/KsmEb9wX8XgDsXNAYxM4xu15C6SeIzpCGvQrfhDBe1M64INqgDmJTFHfbxcti+cYhjYos6o6MvkVnncWLhDK/6lVoyUootgsAr7Qm20oo136CqvATbPyUIo2zLCL9QgllNYNGpLZjCesiE+QC5c2CV7lgAMaJBQdlY+NCL2HwHkOtIqagQWYMInpV5zqK5UMSm1Vd5aobg5OEMqVoit6og8xYApSh1gpi7KOEGi1jSPDPITI1B1E7y2hZQhJBsUMeEW160Sp/7m4meJ8Fr1TSr9AUsGZyVqbOh/6d5iPL6lj2zMXVDRdXf3Wx+jj2hyvi03i+MIqc1aiezGH2cIaK3lmXfboUXd/25BPnsyGnPbqaQvYRrb7gf/yHpu7/t6lNFh1Jc3c8gMTWnSZz/m7IGAn1EAJa/pHU35YhdoHsc76kGev34y2q+rkNbrBaQt59rxJByu3JirNouriMqemMVcUJ+4OGyhpuj6ExbpTQkdbHlc7H9h5AY8hHiik0dsSYLw3Tn8MYlN/OL+vlFZtcuVWeBAAA\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && OL_vlFZtcuVWeBAAA_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var settingName = '_11ftnsv4';
var settingInfo = '_11ftnsv2';
var SettingsTab_css_icon = '_11ftnsv8';
var settingDetails = '_11ftnsv3';
var settingsGroup = '_11ftnsv0';
var SettingsTab_css_statusText = '_11ftnsv7';
var settingsGroupTitle = '_11ftnsv1';
var settingValue = '_11ftnsv5';
var SettingsTab_css_statusIndicator = '_11ftnsv6';
var SettingsTab_css_select = '_11ftnsv9';
function ProjectSelector(props) {
    const { availableProjects, currentProject, onProjectChange, isLoading } = props;
    const handleProjectSelect = (key)=>{
        if (key && 'string' == typeof key) {
            const projectKey = key;
            if (projectKey !== currentProject && !isLoading) onProjectChange(projectKey);
        }
    };
    return /*#__PURE__*/ jsxs(Select, {
        selectedKey: currentProject,
        onSelectionChange: handleProjectSelect,
        "aria-label": "Select project",
        placeholder: "Select project",
        "data-theme": "dark",
        className: SettingsTab_css_select,
        isDisabled: isLoading,
        children: [
            /*#__PURE__*/ jsxs(Button, {
                children: [
                    /*#__PURE__*/ jsx(SelectValue, {}),
                    /*#__PURE__*/ jsx(ChevronDownIcon, {
                        className: SettingsTab_css_icon
                    })
                ]
            }),
            /*#__PURE__*/ jsx(Popover, {
                "data-theme": "dark",
                children: /*#__PURE__*/ jsx(ListBox, {
                    children: availableProjects.map((projectKey)=>/*#__PURE__*/ jsx(ListBoxItem, {
                            id: projectKey,
                            children: projectKey
                        }, projectKey))
                })
            })
        ]
    });
}
function ConnectionStatusDisplay(props) {
    const { status } = props;
    const getStatusText = ()=>{
        switch(status){
            case 'connected':
                return 'Connected';
            case 'disconnected':
                return 'Disconnected';
            case 'error':
                return 'Error';
        }
    };
    return /*#__PURE__*/ jsxs("div", {
        className: SettingsTab_css_statusIndicator,
        children: [
            /*#__PURE__*/ jsx("span", {
                className: SettingsTab_css_statusText,
                children: getStatusText()
            }),
            /*#__PURE__*/ jsx(StatusDot, {
                status: status
            })
        ]
    });
}
function SettingsTabContent() {
    const { state, switchProject } = useToolbarContext();
    const { searchTerm } = useSearchContext();
    const handleProjectSwitch = async (projectKey)=>{
        try {
            await switchProject(projectKey);
        } catch (error) {
            console.error('Failed to switch project:', error);
        }
    };
    const settingsGroups = [
        {
            title: 'Configuration',
            items: [
                {
                    id: 'project',
                    name: 'Project',
                    icon: 'folder',
                    isProjectSelector: true
                },
                {
                    id: 'environment',
                    name: 'Environment',
                    icon: 'globe',
                    value: state.sourceEnvironmentKey || 'Unknown'
                },
                {
                    id: 'connection',
                    name: 'Connection status',
                    icon: 'link',
                    isConnectionStatus: true
                }
            ]
        }
    ];
    const hasResults = settingsGroups.some((group)=>group.items.some((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.trim().toLowerCase())));
    if (!hasResults && searchTerm.trim()) return /*#__PURE__*/ jsx(GenericHelpText, {
        title: "No settings found",
        subtitle: "Try adjusting your search"
    });
    return /*#__PURE__*/ jsx("div", {
        "data-testid": "settings-tab-content",
        children: settingsGroups.map((group)=>{
            const groupResults = group.items.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.trim().toLowerCase()));
            if (0 === groupResults.length) return null;
            return /*#__PURE__*/ jsxs("div", {
                className: settingsGroup,
                children: [
                    /*#__PURE__*/ jsx("h4", {
                        className: settingsGroupTitle,
                        children: group.title
                    }),
                    /*#__PURE__*/ jsx(List, {
                        children: group.items.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.trim().toLowerCase())).map((item)=>{
                            if (item.isConnectionStatus) return /*#__PURE__*/ jsx(ListItem, {
                                onClick: void 0,
                                children: /*#__PURE__*/ jsxs("div", {
                                    className: settingInfo,
                                    children: [
                                        /*#__PURE__*/ jsx("div", {
                                            className: settingDetails,
                                            children: /*#__PURE__*/ jsx("span", {
                                                className: settingName,
                                                children: item.name
                                            })
                                        }),
                                        /*#__PURE__*/ jsx(ConnectionStatusDisplay, {
                                            status: state.connectionStatus
                                        })
                                    ]
                                })
                            }, item.id);
                            return /*#__PURE__*/ jsx(ListItem, {
                                onClick: void 0,
                                children: /*#__PURE__*/ jsxs("div", {
                                    className: settingInfo,
                                    children: [
                                        /*#__PURE__*/ jsx("div", {
                                            className: settingDetails,
                                            children: /*#__PURE__*/ jsx("span", {
                                                className: settingName,
                                                children: item.name
                                            })
                                        }),
                                        item.isProjectSelector ? /*#__PURE__*/ jsx(ProjectSelector, {
                                            availableProjects: state.availableProjects,
                                            currentProject: state.currentProjectKey,
                                            onProjectChange: handleProjectSwitch,
                                            isLoading: state.isLoading
                                        }) : /*#__PURE__*/ jsx("span", {
                                            className: settingValue,
                                            children: item.value
                                        })
                                    ]
                                })
                            }, item.id);
                        })
                    })
                ]
            }, group.title);
        })
    });
}
const TAB_CONTENT_MAP = {
    flags: FlagTabContent,
    settings: SettingsTabContent
};
function TabContentRenderer(props) {
    const { activeTab, slideDirection } = props;
    const ContentComponent = TAB_CONTENT_MAP[activeTab];
    if (!ContentComponent) return null;
    return /*#__PURE__*/ jsx(motion.div, {
        initial: {
            opacity: 0,
            x: slideDirection * DIMENSIONS.slideDistance,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            x: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            x: slideDirection * -DIMENSIONS.slideDistance,
            scale: 0.95
        },
        transition: ANIMATION_CONFIG.tabContent,
        children: /*#__PURE__*/ jsx(ContentComponent, {})
    }, activeTab);
}
var ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted = __webpack_require__("./node_modules/.pnpm/@rsbuild+core@1.4.12/node_modules/@rsbuild/core/compiled/css-loader/index.js??ruleSet[1].rules[2].use[1]!builtin:lightningcss-loader??ruleSet[1].rules[2].use[2]!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/virtualFileLoader/dist/vanilla-extract-webpack-plugin-virtualFileLoader.cjs.js?{\"fileName\":\"src/ui/Toolbar/components/ErrorMessage.css.ts.vanilla.css\",\"source\":\"Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9\"}!./node_modules/.pnpm/@vanilla-extract+webpack-plugin@2.3.22_webpack@5.99.9_esbuild@0.25.5_/node_modules/@vanilla-extract/webpack-plugin/extracted.js");
var ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options = {};
ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.styleTagTransform = styleTagTransform_default();
ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.setAttributes = setAttributesWithoutAttributes_default();
ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insert = insertBySelector_default().bind(null, "head");
ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.domAPI = styleDomAPI_default();
ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options.insertStyleElement = insertStyleElement_default();
injectStylesIntoStyleTag_default()(ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z, ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted_options);
ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z && ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals && ErrorMessage_css_ts_vanilla_css_source_Lml3dnBjeTAgewogIGhlaWdodDogNDAwcHg7Cn0KLml3dnBjeTEgewogIGJhY2tncm91bmQ6IHZhcigtLWxwLWNvbG9yLXJlZC05MDApOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxwLWNvbG9yLXJlZC02MDApOwogIGNvbG9yOiB2YXIoLS1scC1jb2xvci1yZWQtMjAwKTsKICBwYWRkaW5nOiA4cHggMTJweDsKICBtYXJnaW46IDEycHggMjBweDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgZm9udC1zaXplOiAxMnB4Owp9_node_modules_pnpm_vanilla_extract_webpack_plugin_2_3_22_webpack_5_99_9_esbuild_0_25_5_node_modules_vanilla_extract_webpack_plugin_extracted.Z.locals;
var ErrorMessage_css_errorMessage = 'iwvpcy1';
var errorContainer = 'iwvpcy0';
function ErrorMessage(props) {
    const { error } = props;
    return /*#__PURE__*/ jsx("div", {
        className: errorContainer,
        children: /*#__PURE__*/ jsx("div", {
            className: ErrorMessage_css_errorMessage,
            children: error
        })
    });
}
function getHeaderLabel(currentProjectKey, sourceEnvironmentKey) {
    let label = '';
    if (currentProjectKey && sourceEnvironmentKey) label = `${currentProjectKey} - ${sourceEnvironmentKey}`;
    return label;
}
function ExpandedToolbarContent(props) {
    const { isExpanded, activeTab, slideDirection, searchTerm, searchIsExpanded, onSearch, onClose, onTabChange, setSearchIsExpanded } = props;
    const { state } = useToolbarContext();
    const headerLabel = getHeaderLabel(state.currentProjectKey, state.sourceEnvironmentKey);
    const { error } = state;
    return /*#__PURE__*/ jsxs(motion.div, {
        className: toolbarContent,
        initial: {
            opacity: 0,
            y: 10,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            y: 10,
            scale: 0.95
        },
        transition: ANIMATION_CONFIG.toolbarContent,
        children: [
            /*#__PURE__*/ jsx(AnimatePresence, {
                children: isExpanded && /*#__PURE__*/ jsxs(motion.div, {
                    className: contentArea,
                    initial: {
                        opacity: 0,
                        maxHeight: 0
                    },
                    animate: {
                        opacity: 1,
                        maxHeight: 600
                    },
                    exit: {
                        opacity: 0,
                        maxHeight: 0
                    },
                    transition: ANIMATION_CONFIG.contentArea,
                    children: [
                        /*#__PURE__*/ jsx(Header, {
                            onSearch: onSearch,
                            searchTerm: searchTerm,
                            onClose: onClose,
                            searchIsExpanded: searchIsExpanded,
                            setSearchIsExpanded: setSearchIsExpanded,
                            label: headerLabel
                        }),
                        error && /*#__PURE__*/ jsx(ErrorMessage, {
                            error: error
                        }),
                        !error && /*#__PURE__*/ jsx(motion.div, {
                            className: scrollableContent,
                            initial: {
                                opacity: 0,
                                y: -10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: 0.3,
                                ease: EASING.elastic,
                                delay: 0.1
                            },
                            children: /*#__PURE__*/ jsx(AnimatePresence, {
                                mode: "wait",
                                children: activeTab && /*#__PURE__*/ jsx(TabContentRenderer, {
                                    activeTab: activeTab,
                                    slideDirection: slideDirection
                                })
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsx(motion.div, {
                className: tabsContainer,
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: ANIMATION_CONFIG.tabsContainer,
                children: /*#__PURE__*/ jsxs(Tabs_Tabs, {
                    activeTab: activeTab || void 0,
                    onTabChange: onTabChange,
                    children: [
                        /*#__PURE__*/ jsx(TabButton_TabButton, {
                            id: "flags",
                            label: "Flags",
                            icon: ToggleOffIcon
                        }),
                        /*#__PURE__*/ jsx(TabButton_TabButton, {
                            id: "settings",
                            label: "Settings",
                            icon: GearIcon
                        })
                    ]
                })
            })
        ]
    }, "toolbar-content");
}
const TAB_ORDER = [
    'flags',
    'settings'
];
function useToolbarState() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState();
    const [previousTab, setPreviousTab] = useState();
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchIsExpanded, setSearchIsExpanded] = useState(false);
    const hasBeenExpandedRef = useRef(false);
    const toolbarRef = useRef(null);
    const { setSearchTerm } = useSearchContext();
    const showFullToolbar = useMemo(()=>isExpanded || isHovered && !isExpanded, [
        isExpanded,
        isHovered
    ]);
    const slideDirection = useMemo(()=>{
        if (!activeTab || !previousTab) return 1;
        const currentIndex = TAB_ORDER.indexOf(activeTab);
        const previousIndex = TAB_ORDER.indexOf(previousTab);
        return currentIndex > previousIndex ? 1 : -1;
    }, [
        activeTab,
        previousTab
    ]);
    const handleTabChange = useCallback((tabId)=>{
        if (isAnimating) return;
        setSearchIsExpanded(false);
        setSearchTerm('');
        const newTabId = tabId;
        if (newTabId === activeTab && isExpanded) return void setIsExpanded(false);
        setPreviousTab(activeTab);
        setActiveTab(newTabId);
        if (!isExpanded) setIsExpanded(true);
    }, [
        activeTab,
        isExpanded,
        setSearchTerm,
        isAnimating
    ]);
    const handleMouseEnter = useCallback(()=>{
        setIsHovered(true);
    }, []);
    const handleMouseLeave = useCallback(()=>{
        setIsHovered(false);
    }, []);
    const handleClose = useCallback(()=>{
        setIsExpanded(false);
    }, []);
    const handleSearch = useCallback((newSearchTerm)=>{
        setSearchTerm(newSearchTerm);
    }, [
        setSearchTerm
    ]);
    useEffect(()=>{
        if (showFullToolbar) hasBeenExpandedRef.current = true;
    }, [
        showFullToolbar
    ]);
    useEffect(()=>{
        if (!isExpanded) {
            setActiveTab(void 0);
            setPreviousTab(void 0);
        }
    }, [
        isExpanded
    ]);
    useEffect(()=>{
        const handleClickOutside = (event)=>{
            if (isExpanded && toolbarRef.current && !toolbarRef.current.contains(event.target)) setIsExpanded(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [
        isExpanded
    ]);
    return {
        isExpanded,
        isHovered,
        activeTab,
        previousTab,
        isAnimating,
        searchIsExpanded,
        showFullToolbar,
        slideDirection,
        hasBeenExpanded: hasBeenExpandedRef.current,
        toolbarRef,
        handleTabChange,
        handleMouseEnter,
        handleMouseLeave,
        handleClose,
        handleSearch,
        setIsAnimating,
        setSearchIsExpanded
    };
}
function useToolbarAnimations(props) {
    const { showFullToolbar, isHovered, setIsAnimating } = props;
    const containerAnimations = useMemo(()=>({
            width: showFullToolbar ? DIMENSIONS.expanded.width : DIMENSIONS.collapsed.width,
            height: showFullToolbar ? 'auto' : DIMENSIONS.collapsed.height,
            borderRadius: showFullToolbar ? DIMENSIONS.expanded.borderRadius : DIMENSIONS.collapsed.borderRadius,
            scale: showFullToolbar ? DIMENSIONS.scale.expanded : DIMENSIONS.scale.collapsed,
            boxShadow: showFullToolbar ? SHADOWS.expanded : isHovered ? SHADOWS.hoveredCollapsed : SHADOWS.collapsed
        }), [
        showFullToolbar,
        isHovered
    ]);
    const handleAnimationStart = useCallback(()=>{
        setIsAnimating(true);
    }, [
        setIsAnimating
    ]);
    const handleAnimationComplete = useCallback(()=>{
        setIsAnimating(false);
    }, [
        setIsAnimating
    ]);
    return {
        containerAnimations,
        animationConfig: ANIMATION_CONFIG.container,
        handleAnimationStart,
        handleAnimationComplete
    };
}
function LdToolbar(props) {
    const { position = 'right' } = props;
    const { searchTerm } = useSearchContext();
    const toolbarState = useToolbarState();
    const { isExpanded, activeTab, slideDirection, searchIsExpanded, showFullToolbar, hasBeenExpanded, toolbarRef, handleTabChange, handleMouseEnter, handleMouseLeave, handleClose, handleSearch, setSearchIsExpanded, setIsAnimating } = toolbarState;
    const toolbarAnimations = useToolbarAnimations({
        showFullToolbar,
        isHovered: toolbarState.isHovered,
        setIsAnimating
    });
    const { containerAnimations, animationConfig, handleAnimationStart, handleAnimationComplete } = toolbarAnimations;
    return /*#__PURE__*/ jsxs(motion.div, {
        ref: toolbarRef,
        className: `${toolbarContainer} ${'left' === position ? positionLeft : positionRight} ${showFullToolbar ? toolbarExpanded : toolbarCircle}`,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        initial: false,
        animate: containerAnimations,
        transition: animationConfig,
        onAnimationStart: handleAnimationStart,
        onAnimationComplete: handleAnimationComplete,
        "data-testid": "launchdarkly-toolbar",
        children: [
            /*#__PURE__*/ jsx(AnimatePresence, {
                children: !showFullToolbar && /*#__PURE__*/ jsx(CircleLogo, {
                    hasBeenExpanded: hasBeenExpanded
                })
            }),
            /*#__PURE__*/ jsx(AnimatePresence, {
                children: showFullToolbar && /*#__PURE__*/ jsx(ExpandedToolbarContent, {
                    isExpanded: isExpanded,
                    activeTab: activeTab,
                    slideDirection: slideDirection,
                    searchTerm: searchTerm,
                    searchIsExpanded: searchIsExpanded,
                    onSearch: handleSearch,
                    onClose: handleClose,
                    onTabChange: handleTabChange,
                    setSearchIsExpanded: setSearchIsExpanded
                })
            })
        ]
    });
}
function LaunchDarklyToolbar(props) {
    const { projectKey, position, devServerUrl = 'http://localhost:8765' } = props;
    return /*#__PURE__*/ jsx(LaunchDarklyToolbarProvider, {
        config: {
            projectKey,
            devServerUrl,
            pollIntervalInMs: 5000
        },
        children: /*#__PURE__*/ jsx(SearchProvider, {
            children: /*#__PURE__*/ jsx(LdToolbar, {
                position: position
            })
        })
    });
}
export { LaunchDarklyToolbar };
