import{f as F,h as m,au as We,e as Q,a as C,c as g,d as I,as as V,b as f,aS as Ze,ao as B,ap as Je,q as K,j as x,aT as de,aL as Xe,aU as le,p as D,G as ue,aV as ne,l as H,aW as Ye,av as Qe,u as eo,g as Re,aX as oo,a0 as ye,t as ze,ag as _e,ax as to,k as no,aY as ro,an as io,ak as M,L as ve,C as U,A as T,J as L,K as Se,D as _,aZ as Ae,a_ as Ne,a$ as lo,z as X,B as $,I as E,aM as ao,b0 as co,H as so,E as re,F as Y,al as uo,b1 as vo,b2 as ae,b3 as mo,ac as ho,aB as po,v as Pe,w as fo,x as ke,y as go,am as xo,b4 as bo,aP as Co,aG as yo}from"./index-DrZMjmv9.js";import{_ as zo}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as _o,r as wo,_ as He,a as Io}from"./Dropdown-DuE7bwls.js";import{c as ie,V as Ro}from"./create-BGkfZJ4H.js";import{_ as So}from"./Avatar-DhZoxkIh.js";const Ao=F({name:"ChevronDownFilled",render(){return m("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},m("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),No=F({name:"RadioButton",props:wo,setup:_o,render(){const{mergedClsPrefix:e}=this;return m("label",{class:[`${e}-radio-button`,this.mergedDisabled&&`${e}-radio-button--disabled`,this.renderSafeChecked&&`${e}-radio-button--checked`,this.focus&&[`${e}-radio-button--focus`]]},m("input",{ref:"inputRef",type:"radio",class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur}),m("div",{class:`${e}-radio-button__state-border`}),We(this.$slots.default,r=>!r&&!this.label?null:m("div",{ref:"labelRef",class:`${e}-radio__label`},r||this.label)))}}),Po=Q("n-layout-sider"),G=Q("n-menu"),me=Q("n-submenu"),he=Q("n-menu-item-group"),we=[C("&::before","background-color: var(--n-item-color-hover);"),f("arrow",`
 color: var(--n-arrow-color-hover);
 `),f("icon",`
 color: var(--n-item-icon-color-hover);
 `),g("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[C("a",`
 color: var(--n-item-text-color-hover);
 `),f("extra",`
 color: var(--n-item-text-color-hover);
 `)])],Ie=[f("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),g("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[C("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),f("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],ko=C([g("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[I("horizontal",`
 max-width: 100%;
 width: 100%;
 display: flex;
 overflow: hidden;
 padding-bottom: 0;
 `,[g("submenu","margin: 0;"),g("menu-item","margin: 0;"),g("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[C("&::before","display: none;"),I("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),g("menu-item-content",[I("selected",[f("icon","color: var(--n-item-icon-color-active-horizontal);"),g("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[C("a","color: var(--n-item-text-color-active-horizontal);"),f("extra","color: var(--n-item-text-color-active-horizontal);")])]),I("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[g("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[C("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),f("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),f("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),V("disabled",[V("selected, child-active",[C("&:focus-within",Ie)]),I("selected",[O(null,[f("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),g("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[C("a","color: var(--n-item-text-color-active-hover-horizontal);"),f("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),I("child-active",[O(null,[f("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),g("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[C("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),f("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),O("border-bottom: 2px solid var(--n-border-color-horizontal);",Ie)]),g("menu-item-content-header",[C("a","color: var(--n-item-text-color-horizontal);")])])]),V("responsive",[g("menu-item-content-header",`
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),I("collapsed",[g("menu-item-content",[I("selected",[C("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),g("menu-item-content-header","opacity: 0;"),f("arrow","opacity: 0;"),f("icon","color: var(--n-item-icon-color-collapsed);")])]),g("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),g("menu-item-content",`
 box-sizing: border-box;
 line-height: 1.75;
 height: 100%;
 display: grid;
 grid-template-areas: "icon content arrow";
 grid-template-columns: auto 1fr auto;
 align-items: center;
 cursor: pointer;
 position: relative;
 padding-right: 18px;
 transition:
 background-color .3s var(--n-bezier),
 padding-left .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[C("> *","z-index: 1;"),C("&::before",`
 z-index: auto;
 content: "";
 background-color: #0000;
 position: absolute;
 left: 8px;
 right: 8px;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),I("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),I("collapsed",[f("arrow","transform: rotate(0);")]),I("selected",[C("&::before","background-color: var(--n-item-color-active);"),f("arrow","color: var(--n-arrow-color-active);"),f("icon","color: var(--n-item-icon-color-active);"),g("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[C("a","color: var(--n-item-text-color-active);"),f("extra","color: var(--n-item-text-color-active);")])]),I("child-active",[g("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[C("a",`
 color: var(--n-item-text-color-child-active);
 `),f("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),f("arrow",`
 color: var(--n-arrow-color-child-active);
 `),f("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),V("disabled",[V("selected, child-active",[C("&:focus-within",we)]),I("selected",[O(null,[f("arrow","color: var(--n-arrow-color-active-hover);"),f("icon","color: var(--n-item-icon-color-active-hover);"),g("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[C("a","color: var(--n-item-text-color-active-hover);"),f("extra","color: var(--n-item-text-color-active-hover);")])])]),I("child-active",[O(null,[f("arrow","color: var(--n-arrow-color-child-active-hover);"),f("icon","color: var(--n-item-icon-color-child-active-hover);"),g("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[C("a","color: var(--n-item-text-color-child-active-hover);"),f("extra","color: var(--n-item-text-color-child-active-hover);")])])]),I("selected",[O(null,[C("&::before","background-color: var(--n-item-color-active-hover);")])]),O(null,we)]),f("icon",`
 grid-area: icon;
 color: var(--n-item-icon-color);
 transition:
 color .3s var(--n-bezier),
 font-size .3s var(--n-bezier),
 margin-right .3s var(--n-bezier);
 box-sizing: content-box;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 `),f("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),g("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 color: var(--n-item-text-color);
 `,[C("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[C("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),f("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),g("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[g("menu-item-content",`
 height: var(--n-item-height);
 `),g("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[Ze({duration:".2s"})])]),g("menu-item-group",[g("menu-item-group-title",`
 margin-top: 6px;
 color: var(--n-group-text-color);
 cursor: default;
 font-size: .93em;
 height: 36px;
 display: flex;
 align-items: center;
 transition:
 padding-left .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)])]),g("menu-tooltip",[C("a",`
 color: inherit;
 text-decoration: none;
 `)]),g("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function O(e,r){return[I("hover",e,r),C("&:hover",e,r)]}const $e=F({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0},isEllipsisPlaceholder:Boolean},setup(e){const{props:r}=K(G);return{menuProps:r,style:x(()=>{const{paddingLeft:t}=e;return{paddingLeft:t&&`${t}px`}}),iconStyle:x(()=>{const{maxIconSize:t,activeIconSize:i,iconMarginRight:l}=e;return{width:`${t}px`,height:`${t}px`,fontSize:`${i}px`,marginRight:`${l}px`}})}},render(){const{clsPrefix:e,tmNode:r,menuProps:{renderIcon:t,renderLabel:i,renderExtra:l,expandIcon:a}}=this,c=t?t(r.rawNode):B(this.icon);return m("div",{onClick:v=>{var d;(d=this.onClick)===null||d===void 0||d.call(this,v)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},c&&m("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[c]),m("div",{class:`${e}-menu-item-content-header`,role:"none"},this.isEllipsisPlaceholder?this.title:i?i(r.rawNode):B(this.title),this.extra||l?m("span",{class:`${e}-menu-item-content-header__extra`}," ",l?l(r.rawNode):B(this.extra)):null),this.showArrow?m(Je,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>a?a(r.rawNode):m(Ao,null)}):null)}}),J=8;function pe(e){const r=K(G),{props:t,mergedCollapsedRef:i}=r,l=K(me,null),a=K(he,null),c=x(()=>t.mode==="horizontal"),v=x(()=>c.value?t.dropdownPlacement:"tmNodes"in e?"right-start":"right"),d=x(()=>{var u;return Math.max((u=t.collapsedIconSize)!==null&&u!==void 0?u:t.iconSize,t.iconSize)}),b=x(()=>{var u;return!c.value&&e.root&&i.value&&(u=t.collapsedIconSize)!==null&&u!==void 0?u:t.iconSize}),R=x(()=>{if(c.value)return;const{collapsedWidth:u,indent:S,rootIndent:N}=t,{root:A,isGroup:P}=e,w=N===void 0?S:N;return A?i.value?u/2-d.value/2:w:a&&typeof a.paddingLeftRef.value=="number"?S/2+a.paddingLeftRef.value:l&&typeof l.paddingLeftRef.value=="number"?(P?S/2:S)+l.paddingLeftRef.value:0}),y=x(()=>{const{collapsedWidth:u,indent:S,rootIndent:N}=t,{value:A}=d,{root:P}=e;return c.value||!P||!i.value?J:(N===void 0?S:N)+A+J-(u+A)/2});return{dropdownPlacement:v,activeIconSize:b,maxIconSize:d,paddingLeft:R,iconMarginRight:y,NMenu:r,NSubmenu:l}}const fe={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},Ho=F({name:"MenuDivider",setup(){const e=K(G),{mergedClsPrefixRef:r,isHorizontalRef:t}=e;return()=>t.value?null:m("div",{class:`${r.value}-menu-divider`})}}),Te=Object.assign(Object.assign({},fe),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),$o=de(Te),To=F({name:"MenuOption",props:Te,setup(e){const r=pe(e),{NSubmenu:t,NMenu:i}=r,{props:l,mergedClsPrefixRef:a,mergedCollapsedRef:c}=i,v=t?t.mergedDisabledRef:{value:!1},d=x(()=>v.value||e.disabled);function b(y){const{onClick:u}=e;u&&u(y)}function R(y){d.value||(i.doSelect(e.internalKey,e.tmNode.rawNode),b(y))}return{mergedClsPrefix:a,dropdownPlacement:r.dropdownPlacement,paddingLeft:r.paddingLeft,iconMarginRight:r.iconMarginRight,maxIconSize:r.maxIconSize,activeIconSize:r.activeIconSize,mergedTheme:i.mergedThemeRef,menuProps:l,dropdownEnabled:le(()=>e.root&&c.value&&l.mode!=="horizontal"&&!d.value),selected:le(()=>i.mergedValueRef.value===e.internalKey),mergedDisabled:d,handleClick:R}},render(){const{mergedClsPrefix:e,mergedTheme:r,tmNode:t,menuProps:{renderLabel:i,nodeProps:l}}=this,a=l?.(t.rawNode);return m("div",Object.assign({},a,{role:"menuitem",class:[`${e}-menu-item`,a?.class]}),m(Xe,{theme:r.peers.Tooltip,themeOverrides:r.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>i?i(t.rawNode):B(this.title),trigger:()=>m($e,{tmNode:t,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),Ee=Object.assign(Object.assign({},fe),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),Eo=de(Ee),Fo=F({name:"MenuOptionGroup",props:Ee,setup(e){D(me,null);const r=pe(e);D(he,{paddingLeftRef:r.paddingLeft});const{mergedClsPrefixRef:t,props:i}=K(G);return function(){const{value:l}=t,a=r.paddingLeft.value,{nodeProps:c}=i,v=c?.(e.tmNode.rawNode);return m("div",{class:`${l}-menu-item-group`,role:"group"},m("div",Object.assign({},v,{class:[`${l}-menu-item-group-title`,v?.class],style:[v?.style||"",a!==void 0?`padding-left: ${a}px;`:""]}),B(e.title),e.extra?m(ue,null," ",B(e.extra)):null),m("div",null,e.tmNodes.map(d=>ge(d,i))))}}});function ce(e){return e.type==="divider"||e.type==="render"}function Mo(e){return e.type==="divider"}function ge(e,r){const{rawNode:t}=e,{show:i}=t;if(i===!1)return null;if(ce(t))return Mo(t)?m(Ho,Object.assign({key:e.key},t.props)):null;const{labelField:l}=r,{key:a,level:c,isGroup:v}=e,d=Object.assign(Object.assign({},t),{title:t.title||t[l],extra:t.titleExtra||t.extra,key:a,internalKey:a,level:c,root:c===0,isGroup:v});return e.children?e.isGroup?m(Fo,ne(d,Eo,{tmNode:e,tmNodes:e.children,key:a})):m(se,ne(d,Oo,{key:a,rawNodes:t[r.childrenField],tmNodes:e.children,tmNode:e})):m(To,ne(d,$o,{key:a,tmNode:e}))}const Fe=Object.assign(Object.assign({},fe),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function,domId:String,virtualChildActive:{type:Boolean,default:void 0},isEllipsisPlaceholder:Boolean}),Oo=de(Fe),se=F({name:"Submenu",props:Fe,setup(e){const r=pe(e),{NMenu:t,NSubmenu:i}=r,{props:l,mergedCollapsedRef:a,mergedThemeRef:c}=t,v=x(()=>{const{disabled:u}=e;return i?.mergedDisabledRef.value||l.disabled?!0:u}),d=H(!1);D(me,{paddingLeftRef:r.paddingLeft,mergedDisabledRef:v}),D(he,null);function b(){const{onClick:u}=e;u&&u()}function R(){v.value||(a.value||t.toggleExpand(e.internalKey),b())}function y(u){d.value=u}return{menuProps:l,mergedTheme:c,doSelect:t.doSelect,inverted:t.invertedRef,isHorizontal:t.isHorizontalRef,mergedClsPrefix:t.mergedClsPrefixRef,maxIconSize:r.maxIconSize,activeIconSize:r.activeIconSize,iconMarginRight:r.iconMarginRight,dropdownPlacement:r.dropdownPlacement,dropdownShow:d,paddingLeft:r.paddingLeft,mergedDisabled:v,mergedValue:t.mergedValueRef,childActive:le(()=>{var u;return(u=e.virtualChildActive)!==null&&u!==void 0?u:t.activePathRef.value.includes(e.internalKey)}),collapsed:x(()=>l.mode==="horizontal"?!1:a.value?!0:!t.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:x(()=>!v.value&&(l.mode==="horizontal"||a.value)),handlePopoverShowChange:y,handleClick:R}},render(){var e;const{mergedClsPrefix:r,menuProps:{renderIcon:t,renderLabel:i}}=this,l=()=>{const{isHorizontal:c,paddingLeft:v,collapsed:d,mergedDisabled:b,maxIconSize:R,activeIconSize:y,title:u,childActive:S,icon:N,handleClick:A,menuProps:{nodeProps:P},dropdownShow:w,iconMarginRight:ee,tmNode:j,mergedClsPrefix:q,isEllipsisPlaceholder:oe,extra:W}=this,k=P?.(j.rawNode);return m("div",Object.assign({},k,{class:[`${q}-menu-item`,k?.class],role:"menuitem"}),m($e,{tmNode:j,paddingLeft:v,collapsed:d,disabled:b,iconMarginRight:ee,maxIconSize:R,activeIconSize:y,title:u,extra:W,showArrow:!c,childActive:S,clsPrefix:q,icon:N,hover:w,onClick:A,isEllipsisPlaceholder:oe}))},a=()=>m(Ye,null,{default:()=>{const{tmNodes:c,collapsed:v}=this;return v?null:m("div",{class:`${r}-submenu-children`,role:"menu"},c.map(d=>ge(d,this.menuProps)))}});return this.root?m(He,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:t,renderLabel:i}),{default:()=>m("div",{class:`${r}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},l(),this.isHorizontal?null:a())}):m("div",{class:`${r}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},l(),a())}}),Ko=Object.assign(Object.assign({},Re.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,default:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,dropdownPlacement:{type:String,default:"bottom"},responsive:Boolean,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array}),Lo=F({name:"Menu",inheritAttrs:!1,props:Ko,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:t}=eo(e),i=Re("Menu","-menu",ko,oo,e,r),l=K(Po,null),a=x(()=>{var s;const{collapsed:p}=e;if(p!==void 0)return p;if(l){const{collapseModeRef:o,collapsedRef:h}=l;if(o.value==="width")return(s=h.value)!==null&&s!==void 0?s:!1}return!1}),c=x(()=>{const{keyField:s,childrenField:p,disabledField:o}=e;return ie(e.items||e.options,{getIgnored(h){return ce(h)},getChildren(h){return h[p]},getDisabled(h){return h[o]},getKey(h){var z;return(z=h[s])!==null&&z!==void 0?z:h.name}})}),v=x(()=>new Set(c.value.treeNodes.map(s=>s.key))),{watchProps:d}=e,b=H(null);d?.includes("defaultValue")?ye(()=>{b.value=e.defaultValue}):b.value=e.defaultValue;const R=ze(e,"value"),y=_e(R,b),u=H([]),S=()=>{u.value=e.defaultExpandAll?c.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||c.value.getPath(y.value,{includeSelf:!1}).keyPath};d?.includes("defaultExpandedKeys")?ye(S):S();const N=to(e,["expandedNames","expandedKeys"]),A=_e(N,u),P=x(()=>c.value.treeNodes),w=x(()=>c.value.getPath(y.value).keyPath);D(G,{props:e,mergedCollapsedRef:a,mergedThemeRef:i,mergedValueRef:y,mergedExpandedKeysRef:A,activePathRef:w,mergedClsPrefixRef:r,isHorizontalRef:x(()=>e.mode==="horizontal"),invertedRef:ze(e,"inverted"),doSelect:ee,toggleExpand:q});function ee(s,p){const{"onUpdate:value":o,onUpdateValue:h,onSelect:z}=e;h&&M(h,s,p),o&&M(o,s,p),z&&M(z,s,p),b.value=s}function j(s){const{"onUpdate:expandedKeys":p,onUpdateExpandedKeys:o,onExpandedNamesChange:h,onOpenNamesChange:z}=e;p&&M(p,s),o&&M(o,s),h&&M(h,s),z&&M(z,s),u.value=s}function q(s){const p=Array.from(A.value),o=p.findIndex(h=>h===s);if(~o)p.splice(o,1);else{if(e.accordion&&v.value.has(s)){const h=p.findIndex(z=>v.value.has(z));h>-1&&p.splice(h,1)}p.push(s)}j(p)}const oe=s=>{const p=c.value.getPath(s??y.value,{includeSelf:!1}).keyPath;if(!p.length)return;const o=Array.from(A.value),h=new Set([...o,...p]);e.accordion&&v.value.forEach(z=>{h.has(z)&&!p.includes(z)&&h.delete(z)}),j(Array.from(h))},W=x(()=>{const{inverted:s}=e,{common:{cubicBezierEaseInOut:p},self:o}=i.value,{borderRadius:h,borderColorHorizontal:z,fontSize:Ue,itemHeight:Ge,dividerColor:qe}=o,n={"--n-divider-color":qe,"--n-bezier":p,"--n-font-size":Ue,"--n-border-color-horizontal":z,"--n-border-radius":h,"--n-item-height":Ge};return s?(n["--n-group-text-color"]=o.groupTextColorInverted,n["--n-color"]=o.colorInverted,n["--n-item-text-color"]=o.itemTextColorInverted,n["--n-item-text-color-hover"]=o.itemTextColorHoverInverted,n["--n-item-text-color-active"]=o.itemTextColorActiveInverted,n["--n-item-text-color-child-active"]=o.itemTextColorChildActiveInverted,n["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveInverted,n["--n-item-text-color-active-hover"]=o.itemTextColorActiveHoverInverted,n["--n-item-icon-color"]=o.itemIconColorInverted,n["--n-item-icon-color-hover"]=o.itemIconColorHoverInverted,n["--n-item-icon-color-active"]=o.itemIconColorActiveInverted,n["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHoverInverted,n["--n-item-icon-color-child-active"]=o.itemIconColorChildActiveInverted,n["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHoverInverted,n["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsedInverted,n["--n-item-text-color-horizontal"]=o.itemTextColorHorizontalInverted,n["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontalInverted,n["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontalInverted,n["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontalInverted,n["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontalInverted,n["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontalInverted,n["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontalInverted,n["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontalInverted,n["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontalInverted,n["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontalInverted,n["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontalInverted,n["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontalInverted,n["--n-arrow-color"]=o.arrowColorInverted,n["--n-arrow-color-hover"]=o.arrowColorHoverInverted,n["--n-arrow-color-active"]=o.arrowColorActiveInverted,n["--n-arrow-color-active-hover"]=o.arrowColorActiveHoverInverted,n["--n-arrow-color-child-active"]=o.arrowColorChildActiveInverted,n["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHoverInverted,n["--n-item-color-hover"]=o.itemColorHoverInverted,n["--n-item-color-active"]=o.itemColorActiveInverted,n["--n-item-color-active-hover"]=o.itemColorActiveHoverInverted,n["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsedInverted):(n["--n-group-text-color"]=o.groupTextColor,n["--n-color"]=o.color,n["--n-item-text-color"]=o.itemTextColor,n["--n-item-text-color-hover"]=o.itemTextColorHover,n["--n-item-text-color-active"]=o.itemTextColorActive,n["--n-item-text-color-child-active"]=o.itemTextColorChildActive,n["--n-item-text-color-child-active-hover"]=o.itemTextColorChildActiveHover,n["--n-item-text-color-active-hover"]=o.itemTextColorActiveHover,n["--n-item-icon-color"]=o.itemIconColor,n["--n-item-icon-color-hover"]=o.itemIconColorHover,n["--n-item-icon-color-active"]=o.itemIconColorActive,n["--n-item-icon-color-active-hover"]=o.itemIconColorActiveHover,n["--n-item-icon-color-child-active"]=o.itemIconColorChildActive,n["--n-item-icon-color-child-active-hover"]=o.itemIconColorChildActiveHover,n["--n-item-icon-color-collapsed"]=o.itemIconColorCollapsed,n["--n-item-text-color-horizontal"]=o.itemTextColorHorizontal,n["--n-item-text-color-hover-horizontal"]=o.itemTextColorHoverHorizontal,n["--n-item-text-color-active-horizontal"]=o.itemTextColorActiveHorizontal,n["--n-item-text-color-child-active-horizontal"]=o.itemTextColorChildActiveHorizontal,n["--n-item-text-color-child-active-hover-horizontal"]=o.itemTextColorChildActiveHoverHorizontal,n["--n-item-text-color-active-hover-horizontal"]=o.itemTextColorActiveHoverHorizontal,n["--n-item-icon-color-horizontal"]=o.itemIconColorHorizontal,n["--n-item-icon-color-hover-horizontal"]=o.itemIconColorHoverHorizontal,n["--n-item-icon-color-active-horizontal"]=o.itemIconColorActiveHorizontal,n["--n-item-icon-color-active-hover-horizontal"]=o.itemIconColorActiveHoverHorizontal,n["--n-item-icon-color-child-active-horizontal"]=o.itemIconColorChildActiveHorizontal,n["--n-item-icon-color-child-active-hover-horizontal"]=o.itemIconColorChildActiveHoverHorizontal,n["--n-arrow-color"]=o.arrowColor,n["--n-arrow-color-hover"]=o.arrowColorHover,n["--n-arrow-color-active"]=o.arrowColorActive,n["--n-arrow-color-active-hover"]=o.arrowColorActiveHover,n["--n-arrow-color-child-active"]=o.arrowColorChildActive,n["--n-arrow-color-child-active-hover"]=o.arrowColorChildActiveHover,n["--n-item-color-hover"]=o.itemColorHover,n["--n-item-color-active"]=o.itemColorActive,n["--n-item-color-active-hover"]=o.itemColorActiveHover,n["--n-item-color-active-collapsed"]=o.itemColorActiveCollapsed),n}),k=t?no("menu",x(()=>e.inverted?"a":"b"),W,e):void 0,te=ro(),xe=H(null),Me=H(null);let be=!0;const Ce=()=>{var s;be?be=!1:(s=xe.value)===null||s===void 0||s.sync({showAllItemsBeforeCalculate:!0})};function Oe(){return document.getElementById(te)}const Z=H(-1);function Ke(s){Z.value=e.options.length-s}function Le(s){s||(Z.value=-1)}const Be=x(()=>{const s=Z.value;return{children:s===-1?[]:e.options.slice(s)}}),je=x(()=>{const{childrenField:s,disabledField:p,keyField:o}=e;return ie([Be.value],{getIgnored(h){return ce(h)},getChildren(h){return h[s]},getDisabled(h){return h[p]},getKey(h){var z;return(z=h[o])!==null&&z!==void 0?z:h.name}})}),Ve=x(()=>ie([{}]).treeNodes[0]);function De(){var s;if(Z.value===-1)return m(se,{root:!0,level:0,key:"__ellpisisGroupPlaceholder__",internalKey:"__ellpisisGroupPlaceholder__",title:"···",tmNode:Ve.value,domId:te,isEllipsisPlaceholder:!0});const p=je.value.treeNodes[0],o=w.value,h=!!(!((s=p.children)===null||s===void 0)&&s.some(z=>o.includes(z.key)));return m(se,{level:0,root:!0,key:"__ellpisisGroup__",internalKey:"__ellpisisGroup__",title:"···",virtualChildActive:h,tmNode:p,domId:te,rawNodes:p.rawNode.children||[],tmNodes:p.children||[],isEllipsisPlaceholder:!0})}return{mergedClsPrefix:r,controlledExpandedKeys:N,uncontrolledExpanededKeys:u,mergedExpandedKeys:A,uncontrolledValue:b,mergedValue:y,activePath:w,tmNodes:P,mergedTheme:i,mergedCollapsed:a,cssVars:t?void 0:W,themeClass:k?.themeClass,overflowRef:xe,counterRef:Me,updateCounter:()=>{},onResize:Ce,onUpdateOverflow:Le,onUpdateCount:Ke,renderCounter:De,getCounter:Oe,onRender:k?.onRender,showOption:oe,deriveResponsiveState:Ce}},render(){const{mergedClsPrefix:e,mode:r,themeClass:t,onRender:i}=this;i?.();const l=()=>this.tmNodes.map(d=>ge(d,this.$props)),c=r==="horizontal"&&this.responsive,v=()=>m("div",io(this.$attrs,{role:r==="horizontal"?"menubar":"menu",class:[`${e}-menu`,t,`${e}-menu--${r}`,c&&`${e}-menu--responsive`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars}),c?m(Ro,{ref:"overflowRef",onUpdateOverflow:this.onUpdateOverflow,getCounter:this.getCounter,onUpdateCount:this.onUpdateCount,updateCounter:this.updateCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:l,counter:this.renderCounter}):l());return c?m(Qe,{onResize:this.onResize},{default:v}):v()}}),nt={__name:"MenuCollapse",setup(e){const r=ve();return(t,i)=>(T(),U("div",{id:"menu-collapse",class:"f-c-c cursor-pointer rounded-4 auto-bg-hover p-6 text-22 transition-all-300",onClick:i[0]||(i[0]=(...l)=>_(r).switchCollapsed&&_(r).switchCollapsed(...l))},[L("i",{class:Se(_(r).collapsed?"i-line-md-menu-unfold-left":"i-line-md-menu-fold-left")},null,2)]))}},Bo={class:"flex"},jo={__name:"RoleSelect",setup(e,{expose:r}){const t=Ae(),i=Ne(),l=H(t.roles||[]),a=H(t.currentRole?.code??l.value[0]?.code??""),[c,v]=lo();function d(y){c.value?.open({...y})}async function b(){try{v.value=!0;const{data:y}=await ae.switchCurrentRole(a.value);await i.switchCurrentRole(y),v.value=!1,$message.success("切换成功"),c.value?.handleOk()}catch(y){return console.error(y),v.value=!1,!1}}async function R(){await ae.logout(),i.logout(),c.value?.close(),$message.success("已退出登录")}return r({open:d}),(y,u)=>{const S=No,N=co,A=Io,P=uo;return T(),X(_(vo),{ref_key:"modalRef",ref:c,title:"请选择角色",width:"360px",class:"p-12"},{footer:$(()=>[L("div",Bo,[E(P,{class:"flex-1",size:"large",onClick:u[1]||(u[1]=w=>R())},{default:$(()=>[...u[2]||(u[2]=[re(" 退出登录 ",-1)])]),_:1}),E(P,{loading:_(v),class:"ml-20 flex-1",type:"primary",size:"large",disabled:_(t).currentRole?.code===_(a),onClick:b},{default:$(()=>[...u[3]||(u[3]=[re(" 确认 ",-1)])]),_:1},8,["loading","disabled"])])]),default:$(()=>[E(A,{value:_(a),"onUpdate:value":u[0]||(u[0]=w=>ao(a)?a.value=w:null),class:"cus-scroll-y max-h-420 w-full py-16"},{default:$(()=>[E(N,{vertical:"",size:24,class:"mx-12"},{default:$(()=>[(T(!0),U(ue,null,so(_(l),w=>(T(),X(S,{key:w.id,class:Se(["h-36 w-full text-center text-16 leading-36",{"bg-primary! color-white!":w.code===_(a)}]),value:w.code},{default:$(()=>[re(Y(w.name),1)]),_:2},1032,["class","value"]))),128))]),_:1})]),_:1},8,["value"])]),_:1},512)}}},Vo="/assets/isme-D6AR05SU.png",Do={},Uo={class:"h-32 w-32 rounded-4 bg-primary"};function Go(e,r){return T(),U("div",Uo,[...r[0]||(r[0]=[L("img",{src:Vo,alt:"Logo"},null,-1)])])}const qo=zo(Do,[["render",Go]]),rt={__name:"SideLogo",setup(e){const r="Vue Naive Admin",t=ve();return(i,l)=>{const a=qo,c=mo("router-link");return T(),X(c,{class:"h-60 f-c-c",to:"/"},{default:$(()=>[E(a),ho(L("h2",{class:"ml-10 max-w-140 flex-shrink-0 text-16 color-primary font-bold"},Y(_(r)),513),[[po,!_(t).collapsed]])]),_:1})}}},it={__name:"SideMenu",setup(e){const r=Pe(),t=fo(),i=ve(),l=ke(),a=x(()=>t.meta?.parentKey||t.name),c=H(null);go(t,async()=>{await xo(),c.value?.showOption()});function v(d,b){if(bo(b.originPath))$dialog.confirm({type:"info",title:"请选择打开方式",positiveText:"外链打开",negativeText:"在本站内嵌打开",confirm(){window.open(b.originPath)},cancel:()=>{r.push(b.path)}});else{if(!b.path)return;r.push(b.path)}}return(d,b)=>{const R=Lo;return T(),X(R,{ref_key:"menu",ref:c,class:"side-menu",accordion:"",indent:18,"collapsed-icon-size":22,"collapsed-width":64,collapsed:_(i).collapsed,options:_(l).menus,value:_(a),"onUpdate:value":v},null,8,["collapsed","options","value"])}}},Wo={id:"user-dropdown",class:"flex cursor-pointer items-center"},Zo={key:0,class:"ml-12 flex-col flex-shrink-0 items-center"},Jo={class:"text-14"},Xo={class:"text-12 opacity-50"},lt={__name:"UserAvatar",setup(e){const r=Pe(),t=Ae(),i=Ne(),l=ke(),a=Co([{label:"个人资料",key:"profile",icon:()=>m("i",{class:"i-material-symbols:person-outline text-14"}),show:x(()=>l.accessRoutes?.some(d=>d.path==="/profile"))},{label:"切换角色",key:"toggleRole",icon:()=>m("i",{class:"i-basil:exchange-solid text-14"}),show:x(()=>t.roles.length>1)},{label:"退出登录",key:"logout",icon:()=>m("i",{class:"i-mdi:exit-to-app text-14"})}]),c=H(null);function v(d){switch(d){case"profile":r.push("/profile");break;case"toggleRole":c.value?.open({onOk(){location.reload()}});break;case"logout":$dialog.confirm({title:"提示",type:"info",content:"确认退出？",async confirm(){try{await ae.logout()}catch(b){console.error(b)}i.logout(),$message.success("已退出登录")}});break}}return(d,b)=>{const R=So,y=He;return T(),U(ue,null,[E(y,{options:_(a),onSelect:v},{default:$(()=>[L("div",Wo,[E(R,{round:"",size:36,src:_(t).avatar},null,8,["src"]),_(t).userInfo?(T(),U("div",Zo,[L("span",Jo,Y(_(t).nickName??_(t).username),1),L("span",Xo,"["+Y(_(t).currentRole?.name)+"]",1)])):yo("",!0)])]),_:1},8,["options"]),E(_(jo),{ref_key:"roleSelectRef",ref:c},null,512)],64)}}};export{nt as _,lt as a,rt as b,it as c};
