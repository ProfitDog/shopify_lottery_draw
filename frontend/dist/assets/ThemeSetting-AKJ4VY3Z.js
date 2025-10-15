import{f as X,h as s,l as T,M as mn,N as Rt,O as xn,P as yn,Q as Ze,R as wn,c as d,a as S,b as R,u as yt,S as kn,T as Se,U as be,V as le,W as he,X as Re,Y as Ce,Z as ae,j,_ as ze,$ as Pe,e as Et,q as wt,a0 as kt,a1 as Ve,a2 as ut,a3 as pt,a4 as ft,a5 as Sn,a6 as Cn,d as m,a7 as $n,a8 as Rn,a9 as zn,aa as bt,ab as Vt,ac as Dt,ad as Pn,ae as _n,g as Qe,af as In,p as Ht,t as K,ag as ht,y as Ge,ah as Y,k as Ot,ai as Tn,aj as An,ak as fe,al as Me,am as De,an as Bn,ao as Un,G as St,ap as Mn,aq as En,ar as Vn,as as Dn,at as it,au as zt,av as lt,aw as Hn,ax as Pt,o as On,ay as Ln,az as je,aA as Wn,aB as Fn,aC as jn,aD as Nn,L as Lt,aE as qn,C as ge,A as J,K as Wt,D as V,aF as Xn,z as Ye,B as q,aG as Ee,J as N,aH as re,F as gt,r as Ne,aI as Gn,aJ as Kn,aK as _t,I as ie,E as ke,aL as Ft,aM as Zn,aN as Yn,aO as jt,w as Jn,v as Qn,aP as eo,H as to,aQ as no,aR as oo}from"./index-DrZMjmv9.js";import{_ as ro}from"./Dropdown-DuE7bwls.js";import"./UserAvatar-DdIP6CMA.js";import{_ as ao}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{A as io}from"./Add-BTul0XN7.js";import{_ as lo}from"./Input-AGQs7Bn2.js";import{u as so}from"./Eye-CJXJszYF.js";function Nt(e,t,n){t/=100,n/=100;const o=t*Math.min(n,1-n)+n;return[e,o?(2-2*n/o)*100:0,o*100]}function Ke(e,t,n){t/=100,n/=100;const o=n-n*t/2,r=Math.min(o,1-o);return[e,r?(n-o)/r*100:0,o*100]}function pe(e,t,n){t/=100,n/=100;let o=(r,a=(r+e/60)%6)=>n-n*t*Math.max(Math.min(a,4-a,1),0);return[o(5)*255,o(3)*255,o(1)*255]}function vt(e,t,n){e/=255,t/=255,n/=255;let o=Math.max(e,t,n),r=o-Math.min(e,t,n),a=r&&(o==e?(t-n)/r:o==t?2+(n-e)/r:4+(e-t)/r);return[60*(a<0?a+6:a),o&&r/o*100,o*100]}function mt(e,t,n){e/=255,t/=255,n/=255;let o=Math.max(e,t,n),r=o-Math.min(e,t,n),a=1-Math.abs(o+o-r-1),c=r&&(o==e?(t-n)/r:o==t?2+(n-e)/r:4+(e-t)/r);return[60*(c<0?c+6:c),a?r/a*100:0,(o+o-r)*50]}function xt(e,t,n){t/=100,n/=100;let o=t*Math.min(n,1-n),r=(a,c=(a+e/30)%12)=>n-o*Math.max(Math.min(c-3,9-c,1),-1);return[r(0)*255,r(8)*255,r(4)*255]}const co=Rt(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[Rt("&::-webkit-scrollbar",{width:0,height:0})]),uo=X({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=T(null);function t(r){!(r.currentTarget.offsetWidth<r.currentTarget.scrollWidth)||r.deltaY===0||(r.currentTarget.scrollLeft+=r.deltaY+r.deltaX,r.preventDefault())}const n=mn();return co.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:xn,ssr:n}),Object.assign({selfRef:e,handleWheel:t},{scrollTo(...r){var a;(a=e.value)===null||a===void 0||a.scrollTo(...r)}})},render(){return s("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var po=/\s/;function fo(e){for(var t=e.length;t--&&po.test(e.charAt(t)););return t}var bo=/^\s+/;function ho(e){return e&&e.slice(0,fo(e)+1).replace(bo,"")}var It=NaN,go=/^[-+]0x[0-9a-f]+$/i,vo=/^0b[01]+$/i,mo=/^0o[0-7]+$/i,xo=parseInt;function Tt(e){if(typeof e=="number")return e;if(yn(e))return It;if(Ze(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=Ze(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=ho(e);var n=vo.test(e);return n||mo.test(e)?xo(e.slice(2),n?2:8):go.test(e)?It:+e}var st=function(){return wn.Date.now()},yo="Expected a function",wo=Math.max,ko=Math.min;function So(e,t,n){var o,r,a,c,p,g,h=0,x=!1,k=!1,C=!0;if(typeof e!="function")throw new TypeError(yo);t=Tt(t)||0,Ze(n)&&(x=!!n.leading,k="maxWait"in n,a=k?wo(Tt(n.maxWait)||0,t):a,C="trailing"in n?!!n.trailing:C);function y(v){var D=o,E=r;return o=r=void 0,h=v,c=e.apply(E,D),c}function _(v){return h=v,p=setTimeout(P,t),x?y(v):c}function B(v){var D=v-g,E=v-h,F=t-D;return k?ko(F,a-E):F}function O(v){var D=v-g,E=v-h;return g===void 0||D>=t||D<0||k&&E>=a}function P(){var v=st();if(O(v))return A(v);p=setTimeout(P,B(v))}function A(v){return p=void 0,C&&o?y(v):(o=r=void 0,c)}function W(){p!==void 0&&clearTimeout(p),h=0,o=g=r=p=void 0}function L(){return p===void 0?c:A(st())}function z(){var v=st(),D=O(v);if(o=arguments,r=this,g=v,D){if(p===void 0)return _(g);if(k)return clearTimeout(p),p=setTimeout(P,t),y(g)}return p===void 0&&(p=setTimeout(P,t)),c}return z.cancel=W,z.flush=L,z}var Co="Expected a function";function dt(e,t,n){var o=!0,r=!0;if(typeof e!="function")throw new TypeError(Co);return Ze(n)&&(o="leading"in n?!!n.leading:o,r="trailing"in n?!!n.trailing:r),So(e,t,{leading:o,maxWait:t,trailing:r})}const $o=d("input-group",`
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`,[S(">",[d("input",[S("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),S("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]),d("button",[S("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[R("state-border, border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]),S("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[R("state-border, border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]),S("*",[S("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[S(">",[d("input",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),d("base-selection",[d("base-selection-label",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),d("base-selection-tags",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),R("box-shadow, border, state-border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]),S("&:not(:first-child)",`
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[S(">",[d("input",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),d("base-selection",[d("base-selection-label",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),d("base-selection-tags",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),R("box-shadow, border, state-border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]),Ro={},zo=X({name:"InputGroup",props:Ro,setup(e){const{mergedClsPrefixRef:t}=yt(e);return kn("-input-group",$o,t),{mergedClsPrefix:t}},render(){const{mergedClsPrefix:e}=this;return s("div",{class:`${e}-input-group`},this.$slots)}});function Po(e,t){switch(e[0]){case"hex":return t?"#000000FF":"#000000";case"rgb":return t?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return t?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return t?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function He(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function _o(e){return e=Math.round(e),e>=360?359:e<0?0:e}function Io(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const To={rgb:{hex(e){return he(ae(e))},hsl(e){const[t,n,o,r]=ae(e);return be([...mt(t,n,o),r])},hsv(e){const[t,n,o,r]=ae(e);return Ce([...vt(t,n,o),r])}},hex:{rgb(e){return le(ae(e))},hsl(e){const[t,n,o,r]=ae(e);return be([...mt(t,n,o),r])},hsv(e){const[t,n,o,r]=ae(e);return Ce([...vt(t,n,o),r])}},hsl:{hex(e){const[t,n,o,r]=Re(e);return he([...xt(t,n,o),r])},rgb(e){const[t,n,o,r]=Re(e);return le([...xt(t,n,o),r])},hsv(e){const[t,n,o,r]=Re(e);return Ce([...Nt(t,n,o),r])}},hsv:{hex(e){const[t,n,o,r]=Se(e);return he([...pe(t,n,o),r])},rgb(e){const[t,n,o,r]=Se(e);return le([...pe(t,n,o),r])},hsl(e){const[t,n,o,r]=Se(e);return be([...Ke(t,n,o),r])}}};function qt(e,t,n){return n=n||He(e),n?n===t?e:To[n][t](e):null}const Ue="12px",Ao=12,ye="6px",Bo=X({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const t=T(null);function n(a){!t.value||!e.rgba||(ze("mousemove",document,o),ze("mouseup",document,r),o(a))}function o(a){const{value:c}=t;if(!c)return;const{width:p,left:g}=c.getBoundingClientRect(),h=(a.clientX-g)/(p-Ao);e.onUpdateAlpha(Io(h))}function r(){var a;Pe("mousemove",document,o),Pe("mouseup",document,r),(a=e.onComplete)===null||a===void 0||a.call(e)}return{railRef:t,railBackgroundImage:j(()=>{const{rgba:a}=e;return a?`linear-gradient(to right, rgba(${a[0]}, ${a[1]}, ${a[2]}, 0) 0%, rgba(${a[0]}, ${a[1]}, ${a[2]}, 1) 100%)`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return s("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:Ue,borderRadius:ye},onMousedown:this.handleMouseDown},s("div",{style:{borderRadius:ye,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},s("div",{class:`${e}-color-picker-checkboard`}),s("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&s("div",{style:{position:"absolute",left:ye,right:ye,top:0,bottom:0}},s("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${ye})`,borderRadius:ye,width:Ue,height:Ue}},s("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:le(this.rgba),borderRadius:ye,width:Ue,height:Ue}}))))}}),Ct=Et("n-color-picker");function Uo(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),255)):!1}function Mo(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),360)):!1}function Eo(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e),100)):!1}function Vo(e){const t=e.trim();return/^#[0-9a-fA-F]+$/.test(t)?[4,5,7,9].includes(t.length):!1}function Do(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(Number.parseInt(e)/100,100)):!1}const Ho={paddingSmall:"0 4px"},At=X({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const t=T(""),{themeRef:n}=wt(Ct,null);kt(()=>{t.value=o()});function o(){const{value:c}=e;if(c===null)return"";const{label:p}=e;return p==="HEX"?c:p==="A"?`${Math.floor(c*100)}%`:String(Math.floor(c))}function r(c){t.value=c}function a(c){let p,g;switch(e.label){case"HEX":g=Vo(c),g&&e.onUpdateValue(c),t.value=o();break;case"H":p=Mo(c),p===!1?t.value=o():e.onUpdateValue(p);break;case"S":case"L":case"V":p=Eo(c),p===!1?t.value=o():e.onUpdateValue(p);break;case"A":p=Do(c),p===!1?t.value=o():e.onUpdateValue(p);break;case"R":case"G":case"B":p=Uo(c),p===!1?t.value=o():e.onUpdateValue(p);break}}return{mergedTheme:n,inputValue:t,handleInputChange:a,handleInputUpdateValue:r}},render(){const{mergedTheme:e}=this;return s(lo,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Ho,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Oo=X({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(t,n){const{showAlpha:o}=e;if(e.mode==="hex"){e.onUpdateValue((o?he:Ve)(n));return}let r;switch(e.valueArr===null?r=[0,0,0,0]:r=Array.from(e.valueArr),e.mode){case"hsv":r[t]=n,e.onUpdateValue((o?Ce:ft)(r));break;case"rgb":r[t]=n,e.onUpdateValue((o?le:pt)(r));break;case"hsl":r[t]=n,e.onUpdateValue((o?be:ut)(r));break}}}},render(){const{clsPrefix:e,modes:t}=this;return s("div",{class:`${e}-color-picker-input`},s("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:t.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),s(zo,null,{default:()=>{const{mode:n,valueArr:o,showAlpha:r}=this;if(n==="hex"){let a=null;try{a=o===null?null:(r?he:Ve)(o)}catch{}return s(At,{label:"HEX",showAlpha:r,value:a,onUpdateValue:c=>{this.handleUnitUpdateValue(0,c)}})}return(n+(r?"a":"")).split("").map((a,c)=>s(At,{label:a.toUpperCase(),value:o===null?null:o[c],onUpdateValue:p=>{this.handleUnitUpdateValue(c,p)}}))}}))}});function Lo(e,t){if(t==="hsv"){const[n,o,r,a]=Se(e);return le([...pe(n,o,r),a])}return e}function Wo(e){const t=document.createElement("canvas").getContext("2d");return t?(t.fillStyle=e,t.fillStyle):"#000000"}const Fo=X({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const t=j(()=>e.swatches.map(a=>{const c=He(a);return{value:a,mode:c,legalValue:Lo(a,c)}}));function n(a){const{mode:c}=e;let{value:p,mode:g}=a;return g||(g="hex",/^[a-zA-Z]+$/.test(p)?p=Wo(p):(Sn("color-picker",`color ${p} in swatches is invalid.`),p="#000000")),g===c?p:qt(p,c,g)}function o(a){e.onUpdateColor(n(a))}function r(a,c){a.key==="Enter"&&o(c)}return{parsedSwatchesRef:t,handleSwatchSelect:o,handleSwatchKeyDown:r}},render(){const{clsPrefix:e}=this;return s("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(t=>s("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(t)},onKeydown:n=>{this.handleSwatchKeyDown(n,t)}},s("div",{class:`${e}-color-picker-swatch__fill`,style:{background:t.legalValue}}))))}}),jo=X({name:"ColorPickerTrigger",slots:Object,props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:t,renderLabelRef:n}=wt(Ct,null);return()=>{const{hsla:o,value:r,clsPrefix:a,onClick:c,disabled:p}=e,g=t.label||n.value;return s("div",{class:[`${a}-color-picker-trigger`,p&&`${a}-color-picker-trigger--disabled`],onClick:p?void 0:c},s("div",{class:`${a}-color-picker-trigger__fill`},s("div",{class:`${a}-color-picker-checkboard`}),s("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:o?be(o):""}}),r&&o?s("div",{class:`${a}-color-picker-trigger__value`,style:{color:o[2]>50||o[3]<.5?"black":"white"}},g?g(r):r):null))}}}),No=X({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const t=He(e);return!!(!e||t&&t!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function t(n){var o;const r=n.target.value;(o=e.onUpdateColor)===null||o===void 0||o.call(e,qt(r.toUpperCase(),e.mode,"hex")),n.stopPropagation()}return{handleChange:t}},render(){const{clsPrefix:e}=this;return s("div",{class:`${e}-color-picker-preview__preview`},s("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),s("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),$e="12px",qo=12,we="6px",Xo=6,Go="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",Ko=X({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const t=T(null);function n(a){t.value&&(ze("mousemove",document,o),ze("mouseup",document,r),o(a))}function o(a){const{value:c}=t;if(!c)return;const{width:p,left:g}=c.getBoundingClientRect(),h=_o((a.clientX-g-Xo)/(p-qo)*360);e.onUpdateHue(h)}function r(){var a;Pe("mousemove",document,o),Pe("mouseup",document,r),(a=e.onComplete)===null||a===void 0||a.call(e)}return{railRef:t,handleMouseDown:n}},render(){const{clsPrefix:e}=this;return s("div",{class:`${e}-color-picker-slider`,style:{height:$e,borderRadius:we}},s("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Go,height:$e,borderRadius:we,position:"relative"},onMousedown:this.handleMouseDown},s("div",{style:{position:"absolute",left:we,right:we,top:0,bottom:0}},s("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${we})`,borderRadius:we,width:$e,height:$e}},s("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:we,width:$e,height:$e}})))))}}),qe="12px",Xe="6px",Zo=X({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const t=T(null);function n(a){t.value&&(ze("mousemove",document,o),ze("mouseup",document,r),o(a))}function o(a){const{value:c}=t;if(!c)return;const{width:p,height:g,left:h,bottom:x}=c.getBoundingClientRect(),k=(x-a.clientY)/g,C=(a.clientX-h)/p,y=100*(C>1?1:C<0?0:C),_=100*(k>1?1:k<0?0:k);e.onUpdateSV(y,_)}function r(){var a;Pe("mousemove",document,o),Pe("mouseup",document,r),(a=e.onComplete)===null||a===void 0||a.call(e)}return{palleteRef:t,handleColor:j(()=>{const{rgba:a}=e;return a?`rgb(${a[0]}, ${a[1]}, ${a[2]})`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return s("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},s("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),s("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&s("div",{class:`${e}-color-picker-handle`,style:{width:qe,height:qe,borderRadius:Xe,left:`calc(${this.displayedSv[0]}% - ${Xe})`,bottom:`calc(${this.displayedSv[1]}% - ${Xe})`}},s("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:Xe,width:qe,height:qe}})))}}),Yo=S([d("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),d("color-picker-panel",`
 margin: 4px 0;
 width: 240px;
 font-size: var(--n-panel-font-size);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 `,[Cn(),d("input",`
 text-align: center;
 `)]),d("color-picker-checkboard",`
 background: white; 
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[S("&::after",`
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 12px 12px;
 background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
 background-repeat: repeat;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),d("color-picker-slider",`
 margin-bottom: 8px;
 position: relative;
 box-sizing: border-box;
 `,[R("image",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `),S("&::after",`
 content: "";
 position: absolute;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 pointer-events: none;
 `)]),d("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[R("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),d("color-picker-pallete",`
 height: 180px;
 position: relative;
 margin-bottom: 8px;
 cursor: crosshair;
 `,[R("layer",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[m("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),d("color-picker-preview",`
 display: flex;
 `,[R("sliders",`
 flex: 1 0 auto;
 `),R("preview",`
 position: relative;
 height: 30px;
 width: 30px;
 margin: 0 0 8px 6px;
 border-radius: 50%;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 overflow: hidden;
 `),R("fill",`
 display: block;
 width: 30px;
 height: 30px;
 `),R("input",`
 position: absolute;
 top: 0;
 left: 0;
 width: 30px;
 height: 30px;
 opacity: 0;
 z-index: 1;
 `)]),d("color-picker-input",`
 display: flex;
 align-items: center;
 `,[d("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),R("mode",`
 width: 72px;
 text-align: center;
 `)]),d("color-picker-control",`
 padding: 12px;
 `),d("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[d("button","margin-left: 8px;")]),d("color-picker-trigger",`
 border: var(--n-border);
 height: 100%;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 cursor: pointer;
 `,[R("value",`
 white-space: nowrap;
 position: relative;
 `),R("fill",`
 border-radius: var(--n-border-radius);
 position: absolute;
 display: flex;
 align-items: center;
 justify-content: center;
 left: 4px;
 right: 4px;
 top: 4px;
 bottom: 4px;
 `),m("disabled","cursor: not-allowed"),d("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[S("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),d("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[d("color-picker-swatch",`
 width: 18px;
 height: 18px;
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 8px 8px;
 background-position: 0px 0, 0px 4px, 4px -4px, -4px 0px;
 background-repeat: repeat;
 `,[R("fill",`
 position: relative;
 width: 100%;
 height: 100%;
 border-radius: 3px;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 cursor: pointer;
 `),S("&:focus",`
 outline: none;
 `,[R("fill",[S("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),Jo=Object.assign(Object.assign({},Qe.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:bt.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,onClear:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),Qo=X({name:"ColorPicker",props:Jo,slots:Object,setup(e,{slots:t}){const n=T(null);let o=null;const r=_n(e),{mergedSizeRef:a,mergedDisabledRef:c}=r,{localeRef:p}=so("global"),{mergedClsPrefixRef:g,namespaceRef:h,inlineThemeDisabled:x}=yt(e),k=Qe("ColorPicker","-color-picker",Yo,In,e,g);Ht(Ct,{themeRef:k,renderLabelRef:K(e,"renderLabel"),colorPickerSlots:t});const C=T(e.defaultShow),y=ht(K(e,"show"),C);function _(u){const{onUpdateShow:w,"onUpdate:show":i}=e;w&&fe(w,u),i&&fe(i,u),C.value=u}const{defaultValue:B}=e,O=T(B===void 0?Po(e.modes,e.showAlpha):B),P=ht(K(e,"value"),O),A=T([P.value]),W=T(0),L=j(()=>He(P.value)),{modes:z}=e,v=T(He(P.value)||z[0]||"rgb");function D(){const{modes:u}=e,{value:w}=v,i=u.findIndex(l=>l===w);~i?v.value=u[(i+1)%u.length]:v.value="rgb"}let E,F,ne,Q,ee,G,Z,M;const ve=j(()=>{const{value:u}=P;if(!u)return null;switch(L.value){case"hsv":return Se(u);case"hsl":return[E,F,ne,M]=Re(u),[...Nt(E,F,ne),M];case"rgb":case"hex":return[ee,G,Z,M]=ae(u),[...vt(ee,G,Z),M]}}),oe=j(()=>{const{value:u}=P;if(!u)return null;switch(L.value){case"rgb":case"hex":return ae(u);case"hsv":return[E,F,Q,M]=Se(u),[...pe(E,F,Q),M];case"hsl":return[E,F,ne,M]=Re(u),[...xt(E,F,ne),M]}}),_e=j(()=>{const{value:u}=P;if(!u)return null;switch(L.value){case"hsl":return Re(u);case"hsv":return[E,F,Q,M]=Se(u),[...Ke(E,F,Q),M];case"rgb":case"hex":return[ee,G,Z,M]=ae(u),[...mt(ee,G,Z),M]}}),Oe=j(()=>{switch(v.value){case"rgb":case"hex":return oe.value;case"hsv":return ve.value;case"hsl":return _e.value}}),me=T(0),Ie=T(1),Te=T([0,0]);function et(u,w){const{value:i}=ve,l=me.value,f=i?i[3]:1;Te.value=[u,w];const{showAlpha:b}=e;switch(v.value){case"hsv":U((b?Ce:ft)([l,u,w,f]),"cursor");break;case"hsl":U((b?be:ut)([...Ke(l,u,w),f]),"cursor");break;case"rgb":U((b?le:pt)([...pe(l,u,w),f]),"cursor");break;case"hex":U((b?he:Ve)([...pe(l,u,w),f]),"cursor");break}}function Le(u){me.value=u;const{value:w}=ve;if(!w)return;const[,i,l,f]=w,{showAlpha:b}=e;switch(v.value){case"hsv":U((b?Ce:ft)([u,i,l,f]),"cursor");break;case"rgb":U((b?le:pt)([...pe(u,i,l),f]),"cursor");break;case"hex":U((b?he:Ve)([...pe(u,i,l),f]),"cursor");break;case"hsl":U((b?be:ut)([...Ke(u,i,l),f]),"cursor");break}}function se(u){switch(v.value){case"hsv":[E,F,Q]=ve.value,U(Ce([E,F,Q,u]),"cursor");break;case"rgb":[ee,G,Z]=oe.value,U(le([ee,G,Z,u]),"cursor");break;case"hex":[ee,G,Z]=oe.value,U(he([ee,G,Z,u]),"cursor");break;case"hsl":[E,F,ne]=_e.value,U(be([E,F,ne,u]),"cursor");break}Ie.value=u}function U(u,w){w==="cursor"?o=u:o=null;const{nTriggerFormChange:i,nTriggerFormInput:l}=r,{onUpdateValue:f,"onUpdate:value":b}=e;f&&fe(f,u),b&&fe(b,u),i(),l(),O.value=u}function We(u){U(u,"input"),De(de)}function de(u=!0){const{value:w}=P;if(w){const{nTriggerFormChange:i,nTriggerFormInput:l}=r,{onComplete:f}=e;f&&f(w);const{value:b}=A,{value:$}=W;u&&(b.splice($+1,b.length,w),W.value=$+1),i(),l()}}function tt(){const{value:u}=W;u-1<0||(U(A.value[u-1],"input"),de(!1),W.value=u-1)}function ce(){const{value:u}=W;u<0||u+1>=A.value.length||(U(A.value[u+1],"input"),de(!1),W.value=u+1)}function nt(){U(null,"input");const{onClear:u}=e;u&&u(),_(!1)}function ot(){const{value:u}=P,{onConfirm:w}=e;w&&w(u),_(!1)}const rt=j(()=>W.value>=1),Ae=j(()=>{const{value:u}=A;return u.length>1&&W.value<u.length-1});Ge(y,u=>{u||(A.value=[P.value],W.value=0)}),kt(()=>{if(!(o&&o===P.value)){const{value:u}=ve;u&&(me.value=u[0],Ie.value=u[3],Te.value=[u[1],u[2]])}o=null});const Be=j(()=>{const{value:u}=a,{common:{cubicBezierEaseInOut:w},self:{textColor:i,color:l,panelFontSize:f,boxShadow:b,border:$,borderRadius:I,dividerColor:H,[Y("height",u)]:ue,[Y("fontSize",u)]:xe}}=k.value;return{"--n-bezier":w,"--n-text-color":i,"--n-color":l,"--n-panel-font-size":f,"--n-font-size":xe,"--n-box-shadow":b,"--n-border":$,"--n-border-radius":I,"--n-height":ue,"--n-divider-color":H}}),te=x?Ot("color-picker",j(()=>a.value[0]),Be,e):void 0;function at(){var u;const{value:w}=oe,{value:i}=me,{internalActions:l,modes:f,actions:b}=e,{value:$}=k,{value:I}=g;return s("div",{class:[`${I}-color-picker-panel`,te?.themeClass.value],onDragstart:H=>{H.preventDefault()},style:x?void 0:Be.value},s("div",{class:`${I}-color-picker-control`},s(Zo,{clsPrefix:I,rgba:w,displayedHue:i,displayedSv:Te.value,onUpdateSV:et,onComplete:de}),s("div",{class:`${I}-color-picker-preview`},s("div",{class:`${I}-color-picker-preview__sliders`},s(Ko,{clsPrefix:I,hue:i,onUpdateHue:Le,onComplete:de}),e.showAlpha?s(Bo,{clsPrefix:I,rgba:w,alpha:Ie.value,onUpdateAlpha:se,onComplete:de}):null),e.showPreview?s(No,{clsPrefix:I,mode:v.value,color:oe.value&&Ve(oe.value),onUpdateColor:H=>{U(H,"input")}}):null),s(Oo,{clsPrefix:I,showAlpha:e.showAlpha,mode:v.value,modes:f,onUpdateMode:D,value:P.value,valueArr:Oe.value,onUpdateValue:We}),((u=e.swatches)===null||u===void 0?void 0:u.length)&&s(Fo,{clsPrefix:I,mode:v.value,swatches:e.swatches,onUpdateColor:H=>{U(H,"input")}})),b?.length?s("div",{class:`${I}-color-picker-action`},b.includes("confirm")&&s(Me,{size:"small",onClick:ot,theme:$.peers.Button,themeOverrides:$.peerOverrides.Button},{default:()=>p.value.confirm}),b.includes("clear")&&s(Me,{size:"small",onClick:nt,disabled:!P.value,theme:$.peers.Button,themeOverrides:$.peerOverrides.Button},{default:()=>p.value.clear})):null,t.action?s("div",{class:`${I}-color-picker-action`},{default:t.action}):l?s("div",{class:`${I}-color-picker-action`},l.includes("undo")&&s(Me,{size:"small",onClick:tt,disabled:!rt.value,theme:$.peers.Button,themeOverrides:$.peerOverrides.Button},{default:()=>p.value.undo}),l.includes("redo")&&s(Me,{size:"small",onClick:ce,disabled:!Ae.value,theme:$.peers.Button,themeOverrides:$.peerOverrides.Button},{default:()=>p.value.redo})):null)}return{mergedClsPrefix:g,namespace:h,selfRef:n,hsla:_e,rgba:oe,mergedShow:y,mergedDisabled:c,isMounted:Tn(),adjustedTo:bt(e),mergedValue:P,handleTriggerClick(){_(!0)},handleClickOutside(u){var w;!((w=n.value)===null||w===void 0)&&w.contains(An(u))||_(!1)},renderPanel:at,cssVars:x?void 0:Be,themeClass:te?.themeClass,onRender:te?.onRender}},render(){const{mergedClsPrefix:e,onRender:t}=this;return t?.(),s("div",{class:[this.themeClass,`${e}-color-picker`],ref:"selfRef",style:this.cssVars},s($n,null,{default:()=>[s(Rn,null,{default:()=>s(jo,{clsPrefix:e,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick})}),s(zn,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===bt.tdkey,to:this.adjustedTo},{default:()=>s(Vt,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?Dt(this.renderPanel(),[[Pn,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}}),Xt=Et("n-tabs"),er={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},tr=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Vn(er,["displayDirective"])),Je=X({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:tr,setup(e){const{mergedClsPrefixRef:t,valueRef:n,typeRef:o,closableRef:r,tabStyleRef:a,addTabStyleRef:c,tabClassRef:p,addTabClassRef:g,tabChangeIdRef:h,onBeforeLeaveRef:x,triggerRef:k,handleAdd:C,activateTab:y,handleClose:_}=wt(Xt);return{trigger:k,mergedClosable:j(()=>{if(e.internalAddable)return!1;const{closable:B}=e;return B===void 0?r.value:B}),style:a,addStyle:c,tabClass:p,addTabClass:g,clsPrefix:t,value:n,type:o,handleClose(B){B.stopPropagation(),!e.disabled&&_(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){C();return}const{name:B}=e,O=++h.id;if(B!==n.value){const{value:P}=x;P?Promise.resolve(P(e.name,n.value)).then(A=>{A&&h.id===O&&y(B)}):y(B)}}}},render(){const{internalAddable:e,clsPrefix:t,name:n,disabled:o,label:r,tab:a,value:c,mergedClosable:p,trigger:g,$slots:{default:h}}=this,x=r??a;return s("div",{class:`${t}-tabs-tab-wrapper`},this.internalLeftPadded?s("div",{class:`${t}-tabs-tab-pad`}):null,s("div",Object.assign({key:n,"data-name":n,"data-disabled":o?!0:void 0},Bn({class:[`${t}-tabs-tab`,c===n&&`${t}-tabs-tab--active`,o&&`${t}-tabs-tab--disabled`,p&&`${t}-tabs-tab--closable`,e&&`${t}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:g==="click"?this.activateTab:void 0,onMouseenter:g==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),s("span",{class:`${t}-tabs-tab__label`},e?s(St,null,s("div",{class:`${t}-tabs-tab__height-placeholder`}," "),s(Mn,{clsPrefix:t},{default:()=>s(io,null)})):h?h():typeof x=="object"?x:Un(x??n)),p&&this.type==="card"?s(En,{clsPrefix:t,class:`${t}-tabs-tab__close`,onClick:this.handleClose,disabled:o}):null))}}),nr=d("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[m("segment-type",[d("tabs-rail",[S("&.transition-disabled",[d("tabs-capsule",`
 transition: none;
 `)])])]),m("top",[d("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),m("left",[d("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),m("left, right",`
 flex-direction: row;
 `,[d("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),d("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),m("right",`
 flex-direction: row-reverse;
 `,[d("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),d("tabs-bar",`
 left: 0;
 `)]),m("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[d("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),d("tabs-bar",`
 top: 0;
 `)]),d("tabs-rail",`
 position: relative;
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[d("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),d("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[d("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[m("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),S("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),m("flex",[d("tabs-nav",`
 width: 100%;
 position: relative;
 `,[d("tabs-wrapper",`
 width: 100%;
 `,[d("tabs-tab",`
 margin-right: 0;
 `)])])]),d("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[R("prefix, suffix",`
 display: flex;
 align-items: center;
 `),R("prefix","padding-right: 16px;"),R("suffix","padding-left: 16px;")]),m("top, bottom",[d("tabs-nav-scroll-wrapper",[S("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),S("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),m("shadow-start",[S("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),m("shadow-end",[S("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),m("left, right",[d("tabs-nav-scroll-content",`
 flex-direction: column;
 `),d("tabs-nav-scroll-wrapper",[S("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),S("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),m("shadow-start",[S("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),m("shadow-end",[S("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),d("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[d("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[S("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `)]),S("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),d("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),d("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),d("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),d("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[m("disabled",{cursor:"not-allowed"}),R("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),R("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),d("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[S("&.transition-disabled",`
 transition: none;
 `),m("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),d("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),d("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[S("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),S("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),S("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),S("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),S("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),d("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),m("line-type, bar-type",[d("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[S("&:hover",{color:"var(--n-tab-text-color-hover)"}),m("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),m("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),d("tabs-nav",[m("line-type",[m("top",[R("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),d("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),d("tabs-bar",`
 bottom: -1px;
 `)]),m("left",[R("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),d("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),d("tabs-bar",`
 right: -1px;
 `)]),m("right",[R("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),d("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),d("tabs-bar",`
 left: -1px;
 `)]),m("bottom",[R("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),d("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),d("tabs-bar",`
 top: -1px;
 `)]),R("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),d("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),d("tabs-bar",`
 border-radius: 0;
 `)]),m("card-type",[R("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),d("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),d("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),d("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[m("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 justify-content: center;
 `,[R("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),Dn("disabled",[S("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),m("closable","padding-right: 8px;"),m("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),m("disabled","color: var(--n-tab-text-color-disabled);")])]),m("left, right",`
 flex-direction: column; 
 `,[R("prefix, suffix",`
 padding: var(--n-tab-padding-vertical);
 `),d("tabs-wrapper",`
 flex-direction: column;
 `),d("tabs-tab-wrapper",`
 flex-direction: column;
 `,[d("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])]),m("top",[m("card-type",[d("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);"),R("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),d("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[m("active",`
 border-bottom: 1px solid #0000;
 `)]),d("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),d("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),m("left",[m("card-type",[d("tabs-scroll-padding","border-right: 1px solid var(--n-tab-border-color);"),R("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),d("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[m("active",`
 border-right: 1px solid #0000;
 `)]),d("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),d("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),m("right",[m("card-type",[d("tabs-scroll-padding","border-left: 1px solid var(--n-tab-border-color);"),R("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),d("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[m("active",`
 border-left: 1px solid #0000;
 `)]),d("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),d("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),m("bottom",[m("card-type",[d("tabs-scroll-padding","border-top: 1px solid var(--n-tab-border-color);"),R("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),d("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[m("active",`
 border-top: 1px solid #0000;
 `)]),d("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),d("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),or=Object.assign(Object.assign({},Qe.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),rr=X({name:"Tabs",props:or,slots:Object,setup(e,{slots:t}){var n,o,r,a;const{mergedClsPrefixRef:c,inlineThemeDisabled:p}=yt(e),g=Qe("Tabs","-tabs",nr,Hn,e,c),h=T(null),x=T(null),k=T(null),C=T(null),y=T(null),_=T(null),B=T(!0),O=T(!0),P=Pt(e,["labelSize","size"]),A=Pt(e,["activeName","value"]),W=T((o=(n=A.value)!==null&&n!==void 0?n:e.defaultValue)!==null&&o!==void 0?o:t.default?(a=(r=it(t.default())[0])===null||r===void 0?void 0:r.props)===null||a===void 0?void 0:a.name:null),L=ht(A,W),z={id:0},v=j(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});Ge(L,()=>{z.id=0,Q(),ee()});function D(){var i;const{value:l}=L;return l===null?null:(i=h.value)===null||i===void 0?void 0:i.querySelector(`[data-name="${l}"]`)}function E(i){if(e.type==="card")return;const{value:l}=x;if(!l)return;const f=l.style.opacity==="0";if(i){const b=`${c.value}-tabs-bar--disabled`,{barWidth:$,placement:I}=e;if(i.dataset.disabled==="true"?l.classList.add(b):l.classList.remove(b),["top","bottom"].includes(I)){if(ne(["top","maxHeight","height"]),typeof $=="number"&&i.offsetWidth>=$){const H=Math.floor((i.offsetWidth-$)/2)+i.offsetLeft;l.style.left=`${H}px`,l.style.maxWidth=`${$}px`}else l.style.left=`${i.offsetLeft}px`,l.style.maxWidth=`${i.offsetWidth}px`;l.style.width="8192px",f&&(l.style.transition="none"),l.offsetWidth,f&&(l.style.transition="",l.style.opacity="1")}else{if(ne(["left","maxWidth","width"]),typeof $=="number"&&i.offsetHeight>=$){const H=Math.floor((i.offsetHeight-$)/2)+i.offsetTop;l.style.top=`${H}px`,l.style.maxHeight=`${$}px`}else l.style.top=`${i.offsetTop}px`,l.style.maxHeight=`${i.offsetHeight}px`;l.style.height="8192px",f&&(l.style.transition="none"),l.offsetHeight,f&&(l.style.transition="",l.style.opacity="1")}}}function F(){if(e.type==="card")return;const{value:i}=x;i&&(i.style.opacity="0")}function ne(i){const{value:l}=x;if(l)for(const f of i)l.style[f]=""}function Q(){if(e.type==="card")return;const i=D();i?E(i):F()}function ee(){var i;const l=(i=y.value)===null||i===void 0?void 0:i.$el;if(!l)return;const f=D();if(!f)return;const{scrollLeft:b,offsetWidth:$}=l,{offsetLeft:I,offsetWidth:H}=f;b>I?l.scrollTo({top:0,left:I,behavior:"smooth"}):I+H>b+$&&l.scrollTo({top:0,left:I+H-$,behavior:"smooth"})}const G=T(null);let Z=0,M=null;function ve(i){const l=G.value;if(l){Z=i.getBoundingClientRect().height;const f=`${Z}px`,b=()=>{l.style.height=f,l.style.maxHeight=f};M?(b(),M(),M=null):M=b}}function oe(i){const l=G.value;if(l){const f=i.getBoundingClientRect().height,b=()=>{document.body.offsetHeight,l.style.maxHeight=`${f}px`,l.style.height=`${Math.max(Z,f)}px`};M?(M(),M=null,b()):M=b}}function _e(){const i=G.value;if(i){i.style.maxHeight="",i.style.height="";const{paneWrapperStyle:l}=e;if(typeof l=="string")i.style.cssText=l;else if(l){const{maxHeight:f,height:b}=l;f!==void 0&&(i.style.maxHeight=f),b!==void 0&&(i.style.height=b)}}}const Oe={value:[]},me=T("next");function Ie(i){const l=L.value;let f="next";for(const b of Oe.value){if(b===l)break;if(b===i){f="prev";break}}me.value=f,Te(i)}function Te(i){const{onActiveNameChange:l,onUpdateValue:f,"onUpdate:value":b}=e;l&&fe(l,i),f&&fe(f,i),b&&fe(b,i),W.value=i}function et(i){const{onClose:l}=e;l&&fe(l,i)}function Le(){const{value:i}=x;if(!i)return;const l="transition-disabled";i.classList.add(l),Q(),i.classList.remove(l)}const se=T(null);function U({transitionDisabled:i}){const l=h.value;if(!l)return;i&&l.classList.add("transition-disabled");const f=D();f&&se.value&&(se.value.style.width=`${f.offsetWidth}px`,se.value.style.height=`${f.offsetHeight}px`,se.value.style.transform=`translateX(${f.offsetLeft-Wn(getComputedStyle(l).paddingLeft)}px)`,i&&se.value.offsetWidth),i&&l.classList.remove("transition-disabled")}Ge([L],()=>{e.type==="segment"&&De(()=>{U({transitionDisabled:!1})})}),On(()=>{e.type==="segment"&&U({transitionDisabled:!0})});let We=0;function de(i){var l;if(i.contentRect.width===0&&i.contentRect.height===0||We===i.contentRect.width)return;We=i.contentRect.width;const{type:f}=e;if((f==="line"||f==="bar")&&Le(),f!=="segment"){const{placement:b}=e;Ae((b==="top"||b==="bottom"?(l=y.value)===null||l===void 0?void 0:l.$el:_.value)||null)}}const tt=dt(de,64);Ge([()=>e.justifyContent,()=>e.size],()=>{De(()=>{const{type:i}=e;(i==="line"||i==="bar")&&Le()})});const ce=T(!1);function nt(i){var l;const{target:f,contentRect:{width:b,height:$}}=i,I=f.parentElement.parentElement.offsetWidth,H=f.parentElement.parentElement.offsetHeight,{placement:ue}=e;if(!ce.value)ue==="top"||ue==="bottom"?I<b&&(ce.value=!0):H<$&&(ce.value=!0);else{const{value:xe}=C;if(!xe)return;ue==="top"||ue==="bottom"?I-b>xe.$el.offsetWidth&&(ce.value=!1):H-$>xe.$el.offsetHeight&&(ce.value=!1)}Ae(((l=y.value)===null||l===void 0?void 0:l.$el)||null)}const ot=dt(nt,64);function rt(){const{onAdd:i}=e;i&&i(),De(()=>{const l=D(),{value:f}=y;!l||!f||f.scrollTo({left:l.offsetLeft,top:0,behavior:"smooth"})})}function Ae(i){if(!i)return;const{placement:l}=e;if(l==="top"||l==="bottom"){const{scrollLeft:f,scrollWidth:b,offsetWidth:$}=i;B.value=f<=0,O.value=f+$>=b}else{const{scrollTop:f,scrollHeight:b,offsetHeight:$}=i;B.value=f<=0,O.value=f+$>=b}}const Be=dt(i=>{Ae(i.target)},64);Ht(Xt,{triggerRef:K(e,"trigger"),tabStyleRef:K(e,"tabStyle"),tabClassRef:K(e,"tabClass"),addTabStyleRef:K(e,"addTabStyle"),addTabClassRef:K(e,"addTabClass"),paneClassRef:K(e,"paneClass"),paneStyleRef:K(e,"paneStyle"),mergedClsPrefixRef:c,typeRef:K(e,"type"),closableRef:K(e,"closable"),valueRef:L,tabChangeIdRef:z,onBeforeLeaveRef:K(e,"onBeforeLeave"),activateTab:Ie,handleClose:et,handleAdd:rt}),Ln(()=>{Q(),ee()}),kt(()=>{const{value:i}=k;if(!i)return;const{value:l}=c,f=`${l}-tabs-nav-scroll-wrapper--shadow-start`,b=`${l}-tabs-nav-scroll-wrapper--shadow-end`;B.value?i.classList.remove(f):i.classList.add(f),O.value?i.classList.remove(b):i.classList.add(b)});const te={syncBarPosition:()=>{Q()}},at=()=>{U({transitionDisabled:!0})},u=j(()=>{const{value:i}=P,{type:l}=e,f={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[l],b=`${i}${f}`,{self:{barColor:$,closeIconColor:I,closeIconColorHover:H,closeIconColorPressed:ue,tabColor:xe,tabBorderColor:Gt,paneTextColor:Kt,tabFontWeight:Zt,tabBorderRadius:Yt,tabFontWeightActive:Jt,colorSegment:Qt,fontWeightStrong:en,tabColorSegment:tn,closeSize:nn,closeIconSize:on,closeColorHover:rn,closeColorPressed:an,closeBorderRadius:ln,[Y("panePadding",i)]:Fe,[Y("tabPadding",b)]:sn,[Y("tabPaddingVertical",b)]:dn,[Y("tabGap",b)]:cn,[Y("tabGap",`${b}Vertical`)]:un,[Y("tabTextColor",l)]:pn,[Y("tabTextColorActive",l)]:fn,[Y("tabTextColorHover",l)]:bn,[Y("tabTextColorDisabled",l)]:hn,[Y("tabFontSize",i)]:gn},common:{cubicBezierEaseInOut:vn}}=g.value;return{"--n-bezier":vn,"--n-color-segment":Qt,"--n-bar-color":$,"--n-tab-font-size":gn,"--n-tab-text-color":pn,"--n-tab-text-color-active":fn,"--n-tab-text-color-disabled":hn,"--n-tab-text-color-hover":bn,"--n-pane-text-color":Kt,"--n-tab-border-color":Gt,"--n-tab-border-radius":Yt,"--n-close-size":nn,"--n-close-icon-size":on,"--n-close-color-hover":rn,"--n-close-color-pressed":an,"--n-close-border-radius":ln,"--n-close-icon-color":I,"--n-close-icon-color-hover":H,"--n-close-icon-color-pressed":ue,"--n-tab-color":xe,"--n-tab-font-weight":Zt,"--n-tab-font-weight-active":Jt,"--n-tab-padding":sn,"--n-tab-padding-vertical":dn,"--n-tab-gap":cn,"--n-tab-gap-vertical":un,"--n-pane-padding-left":je(Fe,"left"),"--n-pane-padding-right":je(Fe,"right"),"--n-pane-padding-top":je(Fe,"top"),"--n-pane-padding-bottom":je(Fe,"bottom"),"--n-font-weight-strong":en,"--n-tab-color-segment":tn}}),w=p?Ot("tabs",j(()=>`${P.value[0]}${e.type[0]}`),u,e):void 0;return Object.assign({mergedClsPrefix:c,mergedValue:L,renderedNames:new Set,segmentCapsuleElRef:se,tabsPaneWrapperRef:G,tabsElRef:h,barElRef:x,addTabInstRef:C,xScrollInstRef:y,scrollWrapperElRef:k,addTabFixed:ce,tabWrapperStyle:v,handleNavResize:tt,mergedSize:P,handleScroll:Be,handleTabsResize:ot,cssVars:p?void 0:u,themeClass:w?.themeClass,animationDirection:me,renderNameListRef:Oe,yScrollElRef:_,handleSegmentResize:at,onAnimationBeforeLeave:ve,onAnimationEnter:oe,onAnimationAfterEnter:_e,onRender:w?.onRender},te)},render(){const{mergedClsPrefix:e,type:t,placement:n,addTabFixed:o,addable:r,mergedSize:a,renderNameListRef:c,onRender:p,paneWrapperClass:g,paneWrapperStyle:h,$slots:{default:x,prefix:k,suffix:C}}=this;p?.();const y=x?it(x()).filter(z=>z.type.__TAB_PANE__===!0):[],_=x?it(x()).filter(z=>z.type.__TAB__===!0):[],B=!_.length,O=t==="card",P=t==="segment",A=!O&&!P&&this.justifyContent;c.value=[];const W=()=>{const z=s("div",{style:this.tabWrapperStyle,class:`${e}-tabs-wrapper`},A?null:s("div",{class:`${e}-tabs-scroll-padding`,style:n==="top"||n==="bottom"?{width:`${this.tabsPadding}px`}:{height:`${this.tabsPadding}px`}}),B?y.map((v,D)=>(c.value.push(v.props.name),ct(s(Je,Object.assign({},v.props,{internalCreatedByPane:!0,internalLeftPadded:D!==0&&(!A||A==="center"||A==="start"||A==="end")}),v.children?{default:v.children.tab}:void 0)))):_.map((v,D)=>(c.value.push(v.props.name),ct(D!==0&&!A?Mt(v):v))),!o&&r&&O?Ut(r,(B?y.length:_.length)!==0):null,A?null:s("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return s("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},O&&r?s(lt,{onResize:this.handleTabsResize},{default:()=>z}):z,O?s("div",{class:`${e}-tabs-pad`}):null,O?null:s("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},L=P?"top":n;return s("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${t}-type`,`${e}-tabs--${a}-size`,A&&`${e}-tabs--flex`,`${e}-tabs--${L}`],style:this.cssVars},s("div",{class:[`${e}-tabs-nav--${t}-type`,`${e}-tabs-nav--${L}`,`${e}-tabs-nav`]},zt(k,z=>z&&s("div",{class:`${e}-tabs-nav__prefix`},z)),P?s(lt,{onResize:this.handleSegmentResize},{default:()=>s("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},s("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},s("div",{class:`${e}-tabs-wrapper`},s("div",{class:`${e}-tabs-tab`}))),B?y.map((z,v)=>(c.value.push(z.props.name),s(Je,Object.assign({},z.props,{internalCreatedByPane:!0,internalLeftPadded:v!==0}),z.children?{default:z.children.tab}:void 0))):_.map((z,v)=>(c.value.push(z.props.name),v===0?z:Mt(z))))}):s(lt,{onResize:this.handleNavResize},{default:()=>s("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(L)?s(uo,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:W}):s("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},W()))}),o&&r&&O?Ut(r,!0):null,zt(C,z=>z&&s("div",{class:`${e}-tabs-nav__suffix`},z))),B&&(this.animated&&(L==="top"||L==="bottom")?s("div",{ref:"tabsPaneWrapperRef",style:h,class:[`${e}-tabs-pane-wrapper`,g]},Bt(y,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Bt(y,this.mergedValue,this.renderedNames)))}});function Bt(e,t,n,o,r,a,c){const p=[];return e.forEach(g=>{const{name:h,displayDirective:x,"display-directive":k}=g.props,C=_=>x===_||k===_,y=t===h;if(g.key!==void 0&&(g.key=h),y||C("show")||C("show:lazy")&&n.has(h)){n.has(h)||n.add(h);const _=!C("if");p.push(_?Dt(g,[[Fn,y]]):g)}}),c?s(jn,{name:`${c}-transition`,onBeforeLeave:o,onEnter:r,onAfterEnter:a},{default:()=>p}):p}function Ut(e,t){return s(Je,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:t,disabled:typeof e=="object"&&e.disabled})}function Mt(e){const t=Nn(e);return t.props?t.props.internalLeftPadded=!0:t.props={internalLeftPadded:!0},t}function ct(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}const Pr={__name:"ToggleTheme",setup(e){const t=Lt(),n=qn();async function o({clientX:r,clientY:a}){function c(){t.toggleDark(),Xn(n)()}if(!document.startViewTransition)return c();const p=[`circle(0px at ${r}px ${a}px)`,`circle(${Math.hypot(Math.max(r,window.innerWidth-r),Math.max(a,window.innerHeight-a))}px at ${r}px ${a}px)`];await document.startViewTransition(c).ready,document.documentElement.animate({clipPath:n.value?p.reverse():p},{duration:500,easing:"ease-in",pseudoElement:`::view-transition-${n.value?"old":"new"}(root)`,fill:"both"})}return(r,a)=>(J(),ge("i",{id:"toggleTheme",class:Wt(["mr-16 cursor-pointer",V(n)?"i-fe:moon":"i-fe:sun"]),onClick:o},null,2))}};var ar=void 0;const ir=(e,t)=>{let n=null,o=!0;return function(){if(!o)return;o=!1;for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];let p=a;n&&clearTimeout(n),n=setTimeout(()=>{o=!0,e.apply(ar,p)},t)}};var $t=X({name:"Vue3IntroStep",props:{show:{type:Boolean,required:!0},config:{type:Object,required:!0}},emits:["update:show"],data(){return{originalBox:{left:250,top:250,width:200,height:100},tipBoxPosition:"bottom",currentIndex:0}},watch:{config:{deep:!0,handler(){this.currentIndex=0},immediate:!0},show(e){e?this.setBoxInfo():document.body.style.overflow="auto"}},computed:{tipBoxStyle(){if(this.tipBoxPosition==="right")return{left:`${this.originalBox.left+this.originalBox.width}px`,top:`${this.originalBox.top}px`};if(this.tipBoxPosition==="left")return{right:`${window.innerWidth-this.originalBox.left}px`,top:`${this.originalBox.top}px`};if(this.tipBoxPosition==="top")return{left:`${this.originalBox.left}px`,bottom:`${window.innerHeight-this.originalBox.top}px`};if(this.tipBoxPosition==="bottom")return{left:`${this.originalBox.left>window.innerWidth-300?window.innerWidth-300:this.originalBox.left}px`,top:`${this.originalBox.top+this.originalBox.height}px`}}},created(){this.init()},mounted(){window.onresize=ir(()=>{this.show&&this.setBoxInfo()},100)},beforeUnmount(){window.onresize=null},methods:{async prev(){let e=!0;if(this.config.tips[this.currentIndex]&&this.config.tips[this.currentIndex].onPrev&&(e=await this.config.tips[this.currentIndex].onPrev()),!e)throw new Error("onPrev 需要 Promise.resolve(true) 才可以继续往下走");this.setBoxInfo(this.currentIndex-1)},async next(){let e=!0;if(this.config.tips[this.currentIndex]&&this.config.tips[this.currentIndex].onNext&&(e=await this.config.tips[this.currentIndex].onNext()),!e)throw new Error("onNext 需要 Promise.resolve(true) 才可以继续往下走");this.setBoxInfo(this.currentIndex+1)},done(){this.$emit("update:show",!1)},async setBoxInfo(e){try{e===void 0&&(e=this.currentIndex),this.show&&(document.body.style.overflow="hidden");let t=this.config.tips[e].el,n=document.querySelector(t);if(!n)throw new Error("没有找到相应的元素");let o=n.getBoundingClientRect();this.originalBox={left:o.left,top:o.top,width:o.width,height:o.height},this.tipBoxPosition=this.config.tips[e].tipPosition,this.currentIndex=e}catch(t){throw new Error(t.message)}},init(){const{tips:e}=this.config;let t=null;if(e&&Array.isArray(e))if(e.length>0){this.currentIndex=0;try{let n=document.querySelector(e[0].el);t=setInterval(()=>{n=document.querySelector(e[0].el),n&&(this.setBoxInfo(0),clearInterval(t))},0)}catch(n){throw new Error(n.message)}}else throw new Error("tips数组不能为空");else throw new Error("config中的tips不存在或者不是数组")}}});const lr=e=>(Gn("data-v-5d3b253c"),e=e(),Kn(),e),sr={key:0,id:"intro_box"},dr=lr(()=>N("div",{class:"round round-flicker"},null,-1)),cr=[dr],ur={class:"tip-content"},pr={class:"action",style:{justifyContent:"center"}};function fr(e,t,n,o,r,a){return J(),Ye(Vt,{name:"custom-classes-transition","enter-active-class":"animate__animated animate__fadeIn animate__faster","leave-active-class":"animate__animated animate__fadeOut animate__faster"},{default:q(()=>[e.show?(J(),ge("div",sr,[N("div",{class:"top",style:re({height:`${e.originalBox.top}px`,backgroundColor:`rgba(0, 0, 0, ${e.config.backgroundOpacity?e.config.backgroundOpacity:.9})`})},null,4),N("div",{class:"content",style:re({height:`${e.originalBox.height}px`})},[N("div",{class:"left",style:re({top:`${e.originalBox.top}px`,width:`${e.originalBox.left}px`,height:`${e.originalBox.height}px`,backgroundColor:`rgba(0, 0, 0, ${e.config.backgroundOpacity?e.config.backgroundOpacity:.9})`})},null,4),N("div",{class:"original-box",style:re({top:`${e.originalBox.top}px`,left:`${e.originalBox.left}px`,width:`${e.originalBox.width}px`,height:`${e.originalBox.height}px`})},cr,4),N("div",{class:"tip-box",style:re(e.tipBoxStyle)},[N("div",ur,[e.config.tips[e.currentIndex].title?(J(),ge("div",{key:0,class:"title",style:re({textAlign:e.config.titleStyle&&e.config.titleStyle.textAlign?e.config.titleStyle.textAlign:"center",fontSize:e.config.titleStyle&&e.config.titleStyle.fontSize?e.config.titleStyle.fontSize:"19px"})},gt(e.config.tips[e.currentIndex].title),5)):Ee("",!0),N("div",{class:"content",style:re({textAlign:e.config.contentStyle&&e.config.contentStyle.textAlign?e.config.contentStyle.textAlign:"center",fontSize:e.config.contentStyle&&e.config.contentStyle.fontSize?e.config.contentStyle.fontSize:"15px"})},gt(e.config.tips[e.currentIndex].content),5),N("div",pr,[e.currentIndex!==0?Ne(e.$slots,"prev",{key:0,index:e.currentIndex,tipItem:e.config.tips[e.currentIndex]},()=>[N("div",{class:"item prev",onClick:t[0]||(t[0]=function(){return e.prev&&e.prev(...arguments)})},"上一步")]):Ee("",!0),e.currentIndex!==e.config.tips.length-1?Ne(e.$slots,"next",{key:1,index:e.currentIndex,tipItem:e.config.tips[e.currentIndex]},()=>[N("div",{class:"item next",onClick:t[1]||(t[1]=function(){return e.next&&e.next(...arguments)})},"下一步")]):Ee("",!0),e.currentIndex===e.config.tips.length-1?Ne(e.$slots,"done",{key:2,index:e.currentIndex,tipItem:e.config.tips[e.currentIndex]},()=>[N("div",{class:"item done",onClick:t[2]||(t[2]=function(){return e.done&&e.done(...arguments)})},"完成")]):Ne(e.$slots,"skip",{key:3,index:e.currentIndex,tipItem:e.config.tips[e.currentIndex]},()=>[N("div",{class:"item skip",onClick:t[3]||(t[3]=function(){return e.done&&e.done(...arguments)})},"跳过")])])])],4),N("div",{class:"right",style:re({top:`${e.originalBox.top}px`,left:`${e.originalBox.left+e.originalBox.width}px`,width:`calc(100% - ${e.originalBox.left+e.originalBox.width}px)`,height:`${e.originalBox.height}px`,backgroundColor:`rgba(0, 0, 0, ${e.config.backgroundOpacity?e.config.backgroundOpacity:.9})`}),ref:"tip_box"},null,4)],4),N("div",{class:"bottom",style:re({height:`calc(100% - ${e.originalBox.top}px - ${e.originalBox.height}px)`,backgroundColor:`rgba(0, 0, 0, ${e.config.backgroundOpacity?e.config.backgroundOpacity:.9})`})},null,4)])):Ee("",!0)]),_:3})}function br(e,t){t===void 0&&(t={});var n=t.insertAt;if(!(typeof document>"u")){var o=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",n==="top"&&o.firstChild?o.insertBefore(r,o.firstChild):o.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}}var hr=`
#intro_box[data-v-5d3b253c] {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
#intro_box > .top[data-v-5d3b253c] {
  width: 100%;
}
#intro_box > .content[data-v-5d3b253c] {
  width: 100%;
}
#intro_box > .content > .left[data-v-5d3b253c] {
  position: absolute;
  left: 0;
}
#intro_box > .content > .original-box[data-v-5d3b253c] {
  position: absolute;
  background-color: transparent;
  transition: all 0.3s cubic-bezier(0, 0, 0.58, 1);
}
#intro_box > .content > .original-box .round[data-v-5d3b253c] {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.65;
  background-color: #9900ff;
}
#intro_box > .content > .original-box .round-flicker[data-v-5d3b253c]:before,
#intro_box > .content > .original-box .round-flicker[data-v-5d3b253c]:after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  left: -1px;
  top: -1px;
  box-shadow: #9900ff 0px 0px 2px 2px;
  border: 1px solid rgba(153, 0, 255, 0.5);
  border-radius: 50%;
  animation: warn-5d3b253c 2s linear 0s infinite;
}
@keyframes warn-5d3b253c {
0% {
    transform: scale(0.5);
    opacity: 1;
}
25% {
    transform: scale(1);
    opacity: 0.75;
}
50% {
    transform: scale(1.5);
    opacity: 0.5;
}
75% {
    transform: scale(2);
    opacity: 0.25;
}
100% {
    transform: scale(2.5);
    opacity: 0;
}
}
#intro_box > .content > .tip-box[data-v-5d3b253c] {
  position: absolute;
  /*宽度应为内容宽*/
  width: fit-content;
  max-width: 300px;
  box-sizing: border-box;
  /*高度应为内容高度*/
  height: fit-content;
  transition: all 0.3s;
  z-index: 99999;
  padding: 12px;
  font-size: 15px;
}
#intro_box > .content > .tip-box > .tip-content[data-v-5d3b253c] {
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  color: #fff;
}
#intro_box > .content > .tip-box > .tip-content > .title[data-v-5d3b253c] {
  font-weight: bold;
  margin-bottom: 10px;
}
#intro_box > .content > .tip-box > .tip-content > .content[data-v-5d3b253c] {
  white-space: normal;
  overflow-wrap: break-word;
  line-height: 1.5;
}
#intro_box > .content > .tip-box > .tip-content > .action[data-v-5d3b253c] {
  margin-top: 15px;
  width: 100%;
  display: flex;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item[data-v-5d3b253c] {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 5px 15px;
  color: #fff;
  font-weight: bold;
  border: 1px solid #ccc;
  margin: 5px;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.prev[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.next[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.done[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.skip[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .right[data-v-5d3b253c] {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
}
#intro_box > .bottom[data-v-5d3b253c] {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.9);
}
`;br(hr);$t.render=fr;$t.__scopeId="data-v-5d3b253c";var gr=(()=>{const e=$t;return e.install=t=>{t.component("Vue3IntroStep",e)},e})();const _r={__name:"BeginnerGuide",setup(e){const t=_t(null),n=_t(!1),o={backgroundOpacity:.8,titleStyle:{textAlign:"left",fontSize:"18px"},contentStyle:{textAlign:"left",fontSize:"14px"},tips:[{el:"#toggleTheme",tipPosition:"bottom",title:"切换系统主题",content:"一键开启护眼模式"},{el:"#fullscreen",tipPosition:"bottom",title:"全屏/退出全屏",content:"一键开启全屏"},{el:"#theme-setting",tipPosition:"bottom",title:"设置主题色",content:"调整为你喜欢的主题色"},{el:"#user-dropdown",tipPosition:"bottom",title:"个人中心",content:"查看个人资料和退出系统"},{el:"#menu-collapse",tipPosition:"bottom",title:"展开/收起菜单",content:"一键展开/收起菜单"},{el:"#top-tab",tipPosition:"bottom",title:"标签栏",content:"鼠标滚轮滑动可调整至最佳视野"},{el:"#layout-setting",tipPosition:"left",title:"调整系统布局",content:"将系统布局调整为你喜欢的样子"}]};function r(){n.value=!1}function a(){n.value=!1}function c(){t.value.next()}function p(){t.value.prev()}return(g,h)=>{const x=Ft,k=Me;return J(),ge(St,null,[ie(x,{trigger:"hover"},{trigger:q(()=>[N("i",{class:"i-fe:beginner mr-16 cursor-pointer text-20",onClick:h[0]||(h[0]=C=>n.value=!0)})]),default:q(()=>[h[2]||(h[2]=ke(" 操作指引 ",-1))]),_:1}),ie(V(gr),{ref_key:"myIntroStep",ref:t,show:V(n),"onUpdate:show":h[1]||(h[1]=C=>Zn(n)?n.value=C:null),config:o},{prev:q(({tipItem:C,index:y})=>[ie(k,{class:"mr-12",type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:_=>p(C,y)},{default:q(()=>[...h[3]||(h[3]=[ke(" 上一步 ",-1)])]),_:2},1032,["onClick"])]),next:q(({tipItem:C})=>[ie(k,{class:"mr-12",type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:y=>c(C)},{default:q(()=>[...h[4]||(h[4]=[ke(" 下一步 ",-1)])]),_:2},1032,["onClick"])]),skip:q(()=>[ie(k,{type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:r},{default:q(()=>[...h[5]||(h[5]=[ke(" 跳过 ",-1)])]),_:1})]),done:q(()=>[ie(k,{type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:a},{default:q(()=>[...h[6]||(h[6]=[ke(" 完成 ",-1)])]),_:1})]),_:1},8,["show"])],64)}}},Ir={__name:"Fullscreen",setup(e){const{isFullscreen:t,toggle:n}=Yn();return(o,r)=>(J(),ge("i",{id:"fullscreen",class:Wt(["mr-16 cursor-pointer",V(t)?"i-fe:minimize":"i-fe:maximize"]),onClick:r[0]||(r[0]=(...a)=>V(n)&&V(n)(...a))},null,2))}},vr={__name:"ContextMenu",props:{show:{type:Boolean,default:!1},currentPath:{type:String,default:""},x:{type:Number,default:0},y:{type:Number,default:0}},emits:["update:show"],setup(e,{emit:t}){const n=e,o=t,r=jt(),a=j(()=>[{label:"重新加载",key:"reload",disabled:n.currentPath!==r.activeTab,icon:()=>s("i",{class:"i-mdi:refresh text-14"})},{label:"关闭",key:"close",disabled:r.tabs.length<=1,icon:()=>s("i",{class:"i-mdi:close text-14"})},{label:"关闭其他",key:"close-other",disabled:r.tabs.length<=1,icon:()=>s("i",{class:"i-mdi:arrow-expand-horizontal text-14"})},{label:"关闭左侧",key:"close-left",disabled:r.tabs.length<=1||n.currentPath===r.tabs[0].path,icon:()=>s("i",{class:"i-mdi:arrow-expand-left text-14"})},{label:"关闭右侧",key:"close-right",disabled:r.tabs.length<=1||n.currentPath===r.tabs[r.tabs.length-1].path,icon:()=>s("i",{class:"i-mdi:arrow-expand-right text-14"})}]),c=Jn(),p=new Map([["reload",()=>{r.reloadTab(c.fullPath,c.meta?.keepAlive)}],["close",()=>{r.removeTab(n.currentPath)}],["close-other",()=>{r.removeOther(n.currentPath)}],["close-left",()=>{r.removeLeft(n.currentPath)}],["close-right",()=>{r.removeRight(n.currentPath)}]]);function g(){o("update:show",!1)}function h(x){const k=p.get(x);typeof k=="function"&&k(),g()}return(x,k)=>{const C=ro;return J(),Ye(C,{show:e.show,options:V(a),x:e.x,y:e.y,placement:"bottom-start",onClickoutside:g,onSelect:h},null,8,["show","options","x","y"])}}},mr={id:"top-tab"},xr={__name:"index",setup(e){const t=Qn(),n=jt(),o=eo({show:!1,x:0,y:0,currentPath:""});function r(h){n.setActiveTab(h),t.push(h)}function a(){o.show=!0}function c(){o.show=!1}function p(h,x,k){Object.assign(o,{x:h,y:x,currentPath:k})}async function g(h,x){const{clientX:k,clientY:C}=h;c(),p(k,C,x.path),await De(),a()}return(h,x)=>{const k=Je,C=rr;return J(),ge("div",mr,[ie(C,{value:V(n).activeTab,closable:V(n).tabs.length>1,type:"card",onClose:x[0]||(x[0]=y=>V(n).removeTab(y))},{default:q(()=>[(J(!0),ge(St,null,to(V(n).tabs,y=>(J(),Ye(k,{key:y.path,name:y.path,onClick:_=>r(y.path),onContextmenu:no(_=>g(_,y),["prevent"])},{default:q(()=>[ke(gt(y.title),1)]),_:2},1032,["name","onClick","onContextmenu"]))),128))]),_:1},8,["value","closable"]),V(o).show?(J(),Ye(vr,{key:0,show:V(o).show,"onUpdate:show":x[1]||(x[1]=y=>V(o).show=y),"current-path":V(o).currentPath,x:V(o).x,y:V(o).y},null,8,["show","current-path","x","y"])):Ee("",!0)])}}},Tr=ao(xr,[["__scopeId","data-v-0d851a24"]]),yr={class:"f-c-c"},Ar={__name:"ThemeSetting",setup(e){const t=Lt(),n=Object.entries(oo.getPresetColors()).map(([,o])=>o.primary);return(o,r)=>{const a=Qo,c=Ft;return J(),ge("div",yr,[ie(c,{trigger:"hover",placement:"bottom"},{trigger:q(()=>[ie(a,{id:"theme-setting",class:"h-32 w-32",value:V(t).primaryColor,swatches:V(n),"on-update:value":p=>V(t).setPrimaryColor(p),"render-label":()=>""},null,8,["value","swatches","on-update:value"])]),default:q(()=>[r[0]||(r[0]=ke(" 设置主题色 ",-1))]),_:1})])}}};export{Tr as A,_r as _,Pr as a,Ir as b,Ar as c};
