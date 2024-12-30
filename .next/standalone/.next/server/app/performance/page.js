(()=>{var e={};e.id=367,e.ids=[367],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8064:(e,n,t)=>{"use strict";t.r(n),t.d(n,{GlobalError:()=>o.a,__next_app__:()=>d,originalPathname:()=>u,pages:()=>m,routeModule:()=>g,tree:()=>c}),t(4454),t(4466),t(5866);var a=t(3191),r=t(8716),s=t(7922),o=t.n(s),i=t(5231),l={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>i[e]);t.d(n,l);let c=["",{children:["performance",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,4454)),"C:\\Users\\rratn\\OneDrive\\Documents\\GitHub\\deca\\app\\performance\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,4466)),"C:\\Users\\rratn\\OneDrive\\Documents\\GitHub\\deca\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,5866,23)),"next/dist/client/components/not-found-error"]}],m=["C:\\Users\\rratn\\OneDrive\\Documents\\GitHub\\deca\\app\\performance\\page.tsx"],u="/performance/page",d={require:t,loadChunk:()=>Promise.resolve()},g=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/performance/page",pathname:"/performance",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},4521:(e,n,t)=>{Promise.resolve().then(t.bind(t,8770))},6901:(e,n,t)=>{Promise.resolve().then(t.t.bind(t,2994,23)),Promise.resolve().then(t.t.bind(t,6114,23)),Promise.resolve().then(t.t.bind(t,9727,23)),Promise.resolve().then(t.t.bind(t,9671,23)),Promise.resolve().then(t.t.bind(t,1868,23)),Promise.resolve().then(t.t.bind(t,4759,23))},9983:(e,n,t)=>{Promise.resolve().then(t.t.bind(t,9404,23))},8770:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>u});var a=t(326),r=t(7577),s=t(434),o=t(2881);let i=(0,o.Z)("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]),l=(0,o.Z)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),c=["MANAGMENT","MARKETING","FINANCE","HOSPITIALITY","ENTREPRENEUR"],m={MANAGMENT:["Business Law","Communications","Customer Relations","Economics","Emotional Intelligence","Entrepreneurship","Financial Analysis","Human Resources Management","Information Management","Knowledge Management","Marketing","Operations","Professional Development","Project Management","Quality Management","Risk Management","Strategic Management"],MARKETING:["Business Law","Channel Management","Communications","Customer Relations","Economics","Emotional Intelligence","Entrepreneurship","Financial Analysis","Human Resources Management","Information Management","Market Planning","Marketing","Marketing-Information Management","Operations","Pricing","Product/Service Management","Professional Development","Promotion","Selling","Strategic Management"],FINANCE:["Business Law","Communications","Customer Relations","Economics","Emotional Intelligence","Entrepreneurship","Financial Analysis","Financial-Information Management","Human Resources Management","Information Management","Marketing","Operations","Professional Development","Risk Management","Strategic Management"],HOSPITIALITY:["Business Law","Communications","Customer Relations","Economics","Emotional Intelligence","Entrepreneurship","Financial Analysis","Human Resources Management","Information Management","Knowledge Management","Market Planning","Marketing","Operations","Pricing","Product/Service Management","Professional Development","Promotion","Quality Management","Risk Management","Selling","Strategic Management"],ENTREPRENEUR:["Business Law","Channel Management","Communications","Customer Relations","Economics","Emotional Intelligence","Entrepreneurship","Financial Analysis","Human Resources Management","Information Management","Market Planning","Marketing","Marketing-Information Management","Operations","Pricing","Product/Service Management","Professional Development","Promotion","Quality Management","Risk Management","Selling","Strategic Management"]};function u(){let[e,n]=(0,r.useState)(null),[t,o]=(0,r.useState)(!1),u=a=>{e===a?o(!t):(n(a),o(!0))};return(0,a.jsxs)("div",{className:"py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center",children:[a.jsx("h1",{className:"text-4xl font-bold mb-12 text-center text-gray-800",children:"Performance Indicators"}),a.jsx("div",{className:"w-full max-w-md space-y-4 px-2 sm:px-0",children:c.map(n=>(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsxs)("button",{onClick:()=>u(n),className:`w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167] flex justify-between items-center ${e===n?"bg-gray-50":""}`,children:[a.jsx("span",{children:n}),e===n&&(t?a.jsx(i,{className:"h-5 w-5 text-gray-400"}):a.jsx(l,{className:"h-5 w-5 text-gray-400"}))]}),a.jsx("div",{className:`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${t&&e===n?"max-h-[1000px] opacity-100 transform translate-y-0":"max-h-0 opacity-0 transform -translate-y-2"}`,children:m[n].map(e=>a.jsx(s.default,{href:`/performance/${n.toLowerCase()}/${e.toLowerCase().replace(/\s+/g,"-")}`,className:"block w-full bg-[#06C167] hover:bg-[#05a75a] text-white font-semibold py-3 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167]",children:e},e))})]},n))})]})}},2881:(e,n,t)=>{"use strict";t.d(n,{Z:()=>l});var a=t(7577);let r=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=(...e)=>e.filter((e,n,t)=>!!e&&""!==e.trim()&&t.indexOf(e)===n).join(" ").trim();var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,a.forwardRef)(({color:e="currentColor",size:n=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:i="",children:l,iconNode:c,...m},u)=>(0,a.createElement)("svg",{ref:u,...o,width:n,height:n,stroke:e,strokeWidth:r?24*Number(t)/Number(n):t,className:s("lucide",i),...m},[...c.map(([e,n])=>(0,a.createElement)(e,n)),...Array.isArray(l)?l:[l]])),l=(e,n)=>{let t=(0,a.forwardRef)(({className:t,...o},l)=>(0,a.createElement)(i,{ref:l,iconNode:n,className:s(`lucide-${r(e)}`,t),...o}));return t.displayName=`${e}`,t}},434:(e,n,t)=>{"use strict";t.d(n,{default:()=>r.a});var a=t(9404),r=t.n(a)},4466:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>m,metadata:()=>c});var a=t(9510),r=t(7366),s=t.n(r);t(7272);var o=t(7371),i=t(3292);function l(){return a.jsx("header",{className:"bg-white shadow-md fixed top-0 left-0 right-0 z-10",children:a.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,a.jsxs)("div",{className:"flex items-center h-16",children:[a.jsx("div",{className:"w-64",children:a.jsx(o.default,{href:"/",className:"text-2xl font-bold text-gray-800 hover:text-[#06C167] transition-colors duration-300",children:"Deca Pal"})}),(0,a.jsxs)("nav",{className:"flex-1 flex justify-center -ml-16 space-x-8",children:[(0,a.jsxs)(o.default,{href:"/performance",className:"text-gray-600 hover:text-[#06C167] transition-colors duration-300 relative group",children:["Performance",a.jsx("span",{className:"absolute bottom-0 left-0 w-full h-0.5 bg-[#06C167] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"})]}),(0,a.jsxs)(o.default,{href:"/test",className:"text-gray-600 hover:text-[#06C167] transition-colors duration-300 relative group",children:["Test",a.jsx("span",{className:"absolute bottom-0 left-0 w-full h-0.5 bg-[#06C167] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"})]})]}),a.jsx("div",{className:"w-64 flex justify-end",children:a.jsx("button",{className:"text-gray-600 hover:text-[#06C167] transition-colors duration-300 transform hover:scale-110",children:a.jsx(i.Z,{size:32})})})]})})})}let c={title:"Deca Pal",description:"Deca Pal"};function m({children:e}){return a.jsx("html",{lang:"en",children:a.jsx("body",{className:s().className,children:(0,a.jsxs)("div",{className:"min-h-screen bg-gray-100 flex flex-col",children:[a.jsx(l,{}),a.jsx("main",{className:"flex-grow pt-16",children:e})]})})})}},4454:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>a});let a=(0,t(8570).createProxy)(String.raw`C:\Users\rratn\OneDrive\Documents\GitHub\deca\app\performance\page.tsx#default`)},7272:()=>{}};var n=require("../../webpack-runtime.js");n.C(e);var t=e=>n(n.s=e),a=n.X(0,[771],()=>t(8064));module.exports=a})();