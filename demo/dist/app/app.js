define("app/app",["exports","marionette","backbone","app/view/layout","app/controller/page"],function(a,b,c,d,e){Object.defineProperty(a,"__esModule",{value:!0});var f=babelHelpers.interopRequireDefault(b),g=babelHelpers.interopRequireDefault(c),h=babelHelpers.interopRequireDefault(d),i=babelHelpers.interopRequireDefault(e),j=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:"initialize",value:function(){this.layout=null,this.pageRouter=new f["default"].AppRouter({controller:new i["default"],appRoutes:{"page/index":"index","page/editor":"editor","page/forms":"forms","page/charts":"charts","page/sortable":"sortable"}})}},{key:"getLayout",value:function(){if(null===this.layout)throw new Error("Layout is not initialized");return this.layout}},{key:"initLayout",value:function(a){if(null!==this.layout)throw new Error("Layout is already initialized");this.layout=new h["default"]({el:$("body")});var b=this.layout.getRegion("content");this.layout.render(),a&&b.show(a),this.layout.showMenu(this.pageRouter)}}]),b}(f["default"].Application),k=new j;k.on("start",function(){g["default"].history.start()}),a["default"]=k});