# Keylogue
A customisable on screen display of `keyup` and `keydown` events - available in any page and browser via a bookmarklet.

The bookmarklet:

[Keylogue](javascript:(function(){let t=[];for(e=97;e<123;e++){const n=String.fromCharCode(e);t[e-32]=n}for(var e=48;e<58;e++)t[e]=e-48;for(e=1;e<13;e++)t[e+111]="f"+e;for(e=0;e<10;e++)t[e+96]=""+e;t[8]="backspace",t[9]="tab",t[13]="enter",t[16]="shift",t[17]="ctrl",t[18]="alt",t[19]="pause / break",t[20]="caps lock",t[27]="esc",t[32]="space",t[33]="page up",t[34]="page down",t[35]="end",t[36]="home",t[37]="⮜",t[38]="⮝",t[39]="⮞",t[40]="⮟",t[45]="insert",t[46]="delete",t[91]="command",t[93]="command",t[106]="*",t[107]="+",t[109]="-",t[110]=".",t[111]="/",t[144]="num lock",t[145]="scroll lock",t[182]="my computer",t[183]="my calculator",t[186]=";",t[187]="=",t[188]=";",t[189]="-",t[190]=".",t[191]="/",t[192]="`",t[219]="[",t[220]="\\",t[221]=" ]",t[222]="";const n=["ctrl","shift","space","backspace","tab","alt","caps lock","esc","pause / break","command","enter"];class i{constructor(){this.addKey=this.addKey.bind(this),this.keyDown=this.keyDown.bind(this),this.keyUp=this.keyUp.bind(this),this.onDrag=this.onDrag.bind(this),this.onDragOver=this.onDragOver.bind(this),this.onDragStart=this.onDragStart.bind(this),this.onDragEnd=this.onDragEnd.bind(this),this.addEvents=this.addEvents.bind(this),this.rotateList=this.rotateList.bind(this),this.showSettingsPanel=this.showSettingsPanel.bind(this),this.onTransitionEnd=this.onTransitionEnd.bind(this),this.keysActive=[],this.drag={isDragging:!1,offsetX:0,offsetY:0},this.rotateOptions=["top","right","bottom","left"],this.settings={color:"white",backgroundColor:"rgba( 0, 0, 0, 0.5)",scale:2.8,fontScale:2.8,position:{top:"80px",left:"553px"},rotateIndex:3},this.initContainer(),this.initContainerUI(),this.initStyles(),this.initSettings(),this.refreshKeyStyles(),this.addEvents()}initContainer(){this.container=document.createElement("div"),this.container.classList.add("kl-container"),this.keysList=document.createElement("div"),this.keysList.classList.add("kl-container__keys-list"),this.container.appendChild(this.keysList),document.addEventListener("dragover",this.onDragOver),this.container.addEventListener("dragstart",this.onDragStart),this.container.addEventListener("dragend",this.onDragEnd),this.container.draggable=!0,document.body.appendChild(this.container)}initContainerUI(){this.containerUI=document.createElement("div"),this.containerUI.classList.add("kl-container__ui"),this.container.prepend(this.containerUI),this.settingsButton=document.createElement("button"),this.settingsButton.classList.add("kl-container__settings-button"),this.settingsButton.appendChild(document.createTextNode("Settings")),this.settingsButton.addEventListener("click",this.showSettingsPanel),this.containerUI.appendChild(this.settingsButton),this.rotateButton=document.createElement("div"),this.rotateButton.classList.add("kl-container__rotate-button"),this.rotateButton.appendChild(document.createTextNode("Rotate")),this.rotateButton.addEventListener("click",this.rotateList),this.containerUI.appendChild(this.rotateButton),this.dragHandle=document.createElement("div"),this.dragHandle.classList.add("kl-container__drag-handle"),this.dragHandle.appendChild(document.createTextNode("Move")),this.dragHandle.addEventListener("click",this.showSettingsPanel),this.containerUI.appendChild(this.dragHandle)}rotateList(){this.settings.rotateIndex++,this.settings.rotateIndex>=this.rotateOptions.length&&(this.settings.rotateIndex=0),this.refreshStyles(),console.log("updating rotation: ",this.settings.rotateIndex)}getRotation(){return this.rotateOptions[this.settings.rotateIndex]}onDrag(t){console.log("on drag",{x:t.clientX,y:t.clientY})}onDragStart(t){const e=document.createElement("div");t.dataTransfer.setDragImage(e,0,0),this.drag.isDragging=!0,this.drag.offsetX=t.offsetX,this.drag.offsetY=t.offsetY,this.container.classList.add("kl-container--dragging"),console.log("on drag start",t,{x:t.clientX,y:t.clientY}),console.log(this)}onDragEnd(t){this.drag.isDragging=!1,this.drag.offsetX=0,this.drag.offsetY=0,this.container.classList.remove("kl-container--dragging")}onDragOver(t){if(!0===this.drag.isDragging){const e=parseInt(this.drag.offsetX),n=parseInt(this.drag.offsetY);this.container.style.top=parseInt(t.clientY)-n+"px",this.container.style.left=parseInt(t.clientX)-e+"px"}}initSettings(){this.settingsPanel=document.createElement("div"),this.settingsPanel.classList.add("kl-settings"),document.body.appendChild(this.settingsPanel);const t=this.getSettingRow();t.appendChild(document.createTextNode("Settings")),t.classList.add("kl-row__heading"),this.settingsPanel.append(t);const e=[{type:"number",name:"scale",label:"Scale",value:this.settings.scale},{type:"number",name:"fontScale",label:"Font Scale",value:this.settings.fontScale},{type:"text",name:"color",label:"Color",value:this.settings.color},{type:"text",name:"backgroundColor",label:"Background Color",value:this.settings.backgroundColor}];console.log("INIT SETTINGS: ",this.settings,e);const n=this;e.forEach((t=>{this.addSetting(t,(e=>{n.onUpdateSetting(t.name,e)}))}))}onUpdateSetting(t,e){this.settings[t]=e,console.log("onUpdateSetting, ",t,e),console.log("refresh key styles"),this.refreshKeyStyles()}showSettingsPanel(){}getStyles(){const t=this.getRotation();let e="",n="row";return"top"===t?(n="column",e="top: 80px; left: 15px;"):"right"===t?(n="row-reverse",e="top: 80px; right: 15px;"):"bottom"===t?(n="column-reverse",e="bottom: 80px; left: 15px;"):"left"===t&&(n="row",e="top: 80px; left: 15px;"),console.log("git fkex durectuib: "+n,t),`\n\t\t.kl-container {\n\t\t\topacity: 1;\n\t\t\tposition: fixed;\n\t\t\t/* cursor: move; */\n\t\t\tz-index: 2000;\n\t\t\ttop: 80px;\n\t\t\tleft: 553px;\n\t\t\tborder-radius: 10px;\n\t\t\tpadding: 15px;\n\t\t\tcolor: white;\n\t\t\tdisplay: inline-flex;\n\t\t\tflex-direction: column;\n\t\t}\n\t\t.kl-container__keys-list {\n\t\t\tdisplay: inline-flex;\n\t\t\tflex-direction: ${n};\n\t\t\tposition: absolute;\n\t\t\t${e}\n\t\t}\n\t\t\n\t\t.kl-container__ui {\n\t\t\tcursor: move;\n\t\t\tdisplay:block;\n\t\t\topacity: 0;\n\t\t\tflex: 0;\n\t\t\talign-self: flex-start;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: row;\n\t\t\tpadding: 10px;\n\t\t\tborder-radius: 10px;\n\t\t\tmargin-left: -10px;\n\n\t\t\ttransition-property: opacity;\n\t\t\ttransition-duration: 0.15s;\n\t\t\ttransition-timing-function: ease-in;\n\n\t\t}\n\t\t.kl-container__settings-button, .kl-container__rotate-button, .kl-container__drag-handle {\n\t\t\tdisplay: block;\n\t\t\theight: inherit;\n\t\t\talign-self: center;\n\t\t\tborder: none;\n\t\t\tbackground: #666;\n\t\t\tcolor: #fff;\n\t\t\tpadding: 10px 15px;\n\t\t\tmargin: 4px;\n\t\t\tcolor: #fff;\n\t\t\ttext-shadow: rgba( 0, 0, 0, 0.8 ) 0px 0 6px;\n\t\t\tfont-size: 13px;\n\t\t\tline-height: 13px;\n\t\t}\n\t\t.kl-container__settings-button, .kl-container__rotate-button {\n\t\t\tborder-radius: 5px;\n\t\t\tbackground-color: #968ffc;\n\t\t\tcursor: pointer;\n\t\t}\n\t\t.kl-container__drag-handle {\n\t\t\tbackground: transparent;\n\t\t\tborder: 0;\n\t\t\tcursor: move;\n\t\t}\n\t\t.kl-container__ui:hover, .kl-container--dragging .kl-container__ui {\n\t\t\tbackground-color: rgba( 0, 0, 0, 0.7 );\n\t\t}\n\t\t.kl-container:hover .kl-container__ui,\n\t\t.kl-container--dragging .kl-container__ui {\n\t\t\t/* backdrop-filter: blur( 13.0px );\n\t\t\t-webkit-backdrop-filter: blur( 13.0px ); */\n\t\t\topacity: 1;\n\t\t}\n\t\t.kl-settings {\n\t\t\tmargin: 10px auto;\n\t\t\theight: 300px;\n\t\t\twidth: 600px;\n\t\t\toverflow-y: auto;\n\t\t\tpadding: 20px;\n\t\t\tbackground: rgba(60, 60, 60, 0.7);\n\t\t\tborder-radius: 3px;\n\t\t\tcolor: #fff;\n\t\t\tz-index: 2000;\n\t\t}\n\t\t.kl-settings:hover {\n\t\t\topacity: 1;\n\t\t}\n\t\t/* .kl-settings input {\n\t\t\topacity: 1;\n\t\t\tcolor: #fff;\n\t\t\tbackground: transparent;\n\t\t\tborder: none;\n\t\t\toutline: none;\n\t\t\tdrop:shadow: none;\n\t\t\tborder: 1px solid #fff;\n\t\t} */\n\t\t.kl-row {\n\t\t\tflex: 1;\n\t\t\tflex-direction: row;\n\t\t\tdisplay: flex;\n\t\t\t/* padding: 5px 0; */\n\t\t}\n\t\t.kl-row__heading {\n\t\t\tfont-size: 14px;\n\t\t\tfont-weight: bold;\n\t\t}\n\t\t.kl-col {\n\t\t\tflex: 1;\n\t\t\tfont-size: 14px;\n\t\t\tdisplay: flex;\n\t\t}\n\t\t.kl-col--right {\n\t\t\tflex-direction: row-reverse;\n\t\t}\n\t\t.kl-fade-out {\n\t\t\ttransition-property: opacity;\n\t\t\ttransition-duration: 1.2s;\n\t\t\ttransition-delay: 0.1s;\n\t\t\ttransition-timing-function: ease-in-out;\n\t\t\topacity: 0;\n\t\t}\n\n\t`}initStyles(){this.styleElement=document.createElement("style"),this.styleElement.appendChild(document.createTextNode(this.getStyles())),document.body.appendChild(this.styleElement)}refreshStyles(){this.styleElement.replaceChildren(document.createTextNode(this.getStyles()))}getSizeCss(t,e){const n=6*(e||t);return`\n\t\t\tmargin: ${1.2*t}px;\n\t\t\tpadding: ${3*t}px;\n\t\t\twidth: ${20*t}px;\n\t\t\theight: ${20*t}px;\n\t\t\tfont-size: ${n}px;\n\t\t\tline-height: ${n+.1*n}px;\n\t\t`}getKeyStyles(){return`\n\t\t\tdisplay: flex;\n\t\t\tflex-grow: 0;\n\t\t\tflex-shrink: 0;\n\t\t\talign-content: center;\n\t\t\talign-items: center;\n\t\t\ttext-align: center;\n\t\t\tborder-radius: 10px;\n\t\t\tbackground-color: ${this.settings.backgroundColor};\n\t\t\tcolor: ${this.settings.color};\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\ttext-transform: capitalize;\n\t\t`}refreshKeyStyles(){console.log("refresh key styles: "),this.wideWidth=40*this.settings.scale+"px",this.keyStyles=this.getKeyStyles()+this.getSizeCss(this.settings.scale)}addEvents(){document.addEventListener("keydown",this.keyDown),document.addEventListener("keyup",this.keyUp);const t=this;document.addEventListener("visibilitychange",(function(){"visible"===(null==document?void 0:document.visibilityState)&&(t.keysActive.forEach((t=>{var e;null==(e=t.dom)||e.remove()})),t.keysActive=[])}))}findKey(t){return this.keysActive.findIndex((e=>e.which===t&&!1===e.isLeaving))}findLastKey(t){return this.keysActive.map((t=>t.which)).lastIndexOf(t)}addKey(t){{const e=this.findKey(t);if(-1===e)return this.keysActive.push(this.createKeyObject(t)),this.keysActive[this.keysActive.length-1];this.keysActive[e].dom.classList.remove("kl-fade-out")}return null}keyDown(t){const e=this.addKey(t.which);e&&this.keysList.prepend(e.dom)}createKeyObject(e){const i=document.createElement("div");i.style.cssText=this.keyStyles;const s=t[e];return(t=>n.includes(t))(s)&&(i.style.width=this.wideWidth),i.textContent=s||"",i.addEventListener("transitionend",this.onTransitionEnd),{which:e,isLeaving:!1,dom:i}}onTransitionEnd(t){this.keysActive=this.removeByDom(this.keysActive,t.target)}keyUp(t){const e=t.which,n=this.findLastKey(e);-1!==n&&this.setLeaving(this.keysActive[n])}setLeaving(t){t.dom.classList.add("kl-fade-out"),t.isLeaving=!0}removeByDom(t,e){const n=t.findIndex((t=>t.dom===e));return-1!==n&&(t[n].dom.removeEventListener("transitionend",this.onTransitionEnd),this.keysList.removeChild(t[n].dom),t.splice(n,1)),t}addSetting(t,e){var n;const i=document.createElement("input");i.type=null!=(n=null==t?void 0:t.type)?n:"text",i.addEventListener("input",(t=>{const n=t.target.value;e(n)})),"number"===i.type&&(i.step=.1,i.min=.1,i.max=10),i.value=t.value;const s=this.getSettingRow(),o=this.getSettingColumn();o.appendChild(document.createTextNode(t.label)),s.appendChild(o);const a=this.getSettingColumn();a.classList.add("kl-col--right"),a.appendChild(i),s.appendChild(a),this.settingsPanel.appendChild(s)}getSettingRow(){const t=document.createElement("label");return t.classList.add("kl-row"),t}getSettingColumn(){const t=document.createElement("div");return t.classList.add("kl-col"),t}}const s=()=>{new i};"loading"!==document.readyState?s():window.addEventListener("DOMContentLoaded",(t=>{s()}));})();)

## How to use a bookmarklet?