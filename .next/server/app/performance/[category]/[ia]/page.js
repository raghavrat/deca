(()=>{var e={};e.id=611,e.ids=[611],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2824:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>l.a,__next_app__:()=>p,originalPathname:()=>c,pages:()=>d,routeModule:()=>f,tree:()=>u}),r(2062),r(5681),r(5866);var a=r(3191),n=r(8716),s=r(7922),l=r.n(s),o=r(5231),i={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(i[e]=()=>o[e]);r.d(t,i);let u=["",{children:["performance",{children:["[category]",{children:["[ia]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,2062)),"C:\\Users\\rratn\\OneDrive\\Documents\\GitHub\\deca\\app\\performance\\[category]\\[ia]\\page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,5681)),"C:\\Users\\rratn\\OneDrive\\Documents\\GitHub\\deca\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],d=["C:\\Users\\rratn\\OneDrive\\Documents\\GitHub\\deca\\app\\performance\\[category]\\[ia]\\page.tsx"],c="/performance/[category]/[ia]/page",p={require:r,loadChunk:()=>Promise.resolve()},f=new a.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/performance/[category]/[ia]/page",pathname:"/performance/[category]/[ia]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:u}})},4093:(e,t,r)=>{Promise.resolve().then(r.bind(r,3556))},3556:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var a=r(326),n=r(7577);r(1474);var s=r(434);let l=(0,r(2881).Z)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);var o=r(3353);let i=r.n(o)()(async()=>{},{loadableGenerated:{modules:["app\\performance\\[category]\\[ia]\\page.tsx -> ../../../components/InstructionalArea"]},loading:()=>a.jsx("div",{className:"animate-pulse bg-gray-200 h-96 rounded-lg"}),ssr:!1});function u({params:e,searchParams:t}){let[r,o]=(0,n.useState)(""),[u,d]=(0,n.useState)(""),[c,p]=(0,n.useState)([]),[f,m]=(0,n.useState)(!0);return r&&u?(0,a.jsxs)("div",{className:"py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",children:[(0,a.jsxs)(s.default,{href:"/performance",className:"mb-6 inline-flex items-center text-[#06C167] hover:text-[#05a75a] transition-colors duration-200",children:[a.jsx(l,{className:"mr-1"}),"Back to Clusters"]}),(0,a.jsxs)("h2",{className:"text-3xl font-bold mb-6 text-gray-800",children:[r," - ",u]}),a.jsx(n.Suspense,{fallback:a.jsx("div",{className:"animate-pulse bg-gray-200 h-96 rounded-lg"}),children:f?a.jsx("div",{className:"animate-pulse bg-gray-200 h-96 rounded-lg"}):c.length>0?a.jsx(i,{area:u,indicators:c}):a.jsx("p",{className:"text-gray-600",children:"No performance indicators found for this instructional area."})})]}):null}},3353:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s}});let a=r(1174);r(326),r(7577);let n=a._(r(7028));function s(e,t){var r;let a={loading:e=>{let{error:t,isLoading:r,pastDelay:a}=e;return null}};"function"==typeof e&&(a.loader=e);let s={...a,...t};return(0,n.default)({...s,modules:null==(r=s.loadableGenerated)?void 0:r.modules})}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},933:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"BailoutToCSR",{enumerable:!0,get:function(){return n}});let a=r(4129);function n(e){let{reason:t,children:r}=e;throw new a.BailoutToCSRError(t)}},7028:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return u}});let a=r(326),n=r(7577),s=r(933),l=r(6618);function o(e){return{default:e&&"default"in e?e.default:e}}let i={loader:()=>Promise.resolve(o(()=>null)),loading:null,ssr:!0},u=function(e){let t={...i,...e},r=(0,n.lazy)(()=>t.loader().then(o)),u=t.loading;function d(e){let o=u?(0,a.jsx)(u,{isLoading:!0,pastDelay:!0,error:null}):null,i=t.ssr?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(l.PreloadCss,{moduleIds:t.modules}),(0,a.jsx)(r,{...e})]}):(0,a.jsx)(s.BailoutToCSR,{reason:"next/dynamic",children:(0,a.jsx)(r,{...e})});return(0,a.jsx)(n.Suspense,{fallback:o,children:i})}return d.displayName="LoadableComponent",d}},6618:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"PreloadCss",{enumerable:!0,get:function(){return s}});let a=r(326),n=r(4580);function s(e){let{moduleIds:t}=e,r=(0,n.getExpectedRequestStore)("next/dynamic css"),s=[];if(r.reactLoadableManifest&&t){let e=r.reactLoadableManifest;for(let r of t){if(!e[r])continue;let t=e[r].files.filter(e=>e.endsWith(".css"));s.push(...t)}}return 0===s.length?null:(0,a.jsx)(a.Fragment,{children:s.map(e=>(0,a.jsx)("link",{precedence:"dynamic",rel:"stylesheet",href:r.assetPrefix+"/_next/"+encodeURI(e),as:"style"},e))})}},2062:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});let a=(0,r(8570).createProxy)(String.raw`C:\Users\rratn\OneDrive\Documents\GitHub\deca\app\performance\[category]\[ia]\page.tsx#default`)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[381,632,703,131,402,580,57,991,641,219,844,789,180,846],()=>r(2824));module.exports=a})();