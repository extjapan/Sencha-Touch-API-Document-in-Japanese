/**
 * @class Ext.lib.Component
 * @extends Ext.util.Observable
 * 共有コンポーネントクラス
 */
Ext.lib.Component = Ext.extend(Ext.util.Observable, {
    isComponent: true,

    /**
     * @cfg {Mixed} renderTpl
     * <p>このコンポーネントを覆う{@link #getEl Element}の内側の構造を生成するための{@link Ext.XTemplate XTemplate}。</p>
     * <p>通常はこのオプションを直接設定することはありません。{@link Ext.Component}や{@link Ext.Container}などの基底
		 * クラスでは、このプロパティのデフォルト値は<b><tt>null</tt></b>となっています。つまり、これらの基底クラスは内部構造
		 * 無しで生成されるということです（これらの{@link #getEl Element}は空っぽのまま生成されます）。もっと複雑なクラスでは、
		 * より複雑なDOM構造が使われていて、それぞれ独自のテンプレートが定義されています。</p>
		 * <p>このプロパティは、開発者がアプリケーション特有の内部構造を持つコンポーネントを開発する際に便利な用に用意されて
		 * います。</>p>
     * <p>描画後であれば、生成された子要素は{@link #renderSelectors}オプションを使ってオブジェクトのプロパティとして自動的に
		 * 取り込むことができます。</p>
     */
    renderTpl: null,

    /**
     * @cfg {Object} renderSelectors
     * <p>コンポーネントを構成するDOM要素を特定するためのプロパティ名と{@link Ext.DomQuery DomQuery}セレクタを組み合わせたオブジェクト。
		 * を設定します。</p>
     * <p>{@link renderTpl}に従ってコンポーネントの内部構造が描画されたあと、ここで設定されたオブジェクトの中身が走査され、指定された
		 * セレクタにマッチしたDOM要素がコンポーネントのプロパティとして追加されます（プロパティ名は<code>renderSelectors</code>のプロパティ
		 * 名に一致）。</p>
     * <p>例えば、画像と説明文が次の<code>renderTpl</code>を使ってコンポーネント内に描画されていた場合、下記のような<code>renderSelectors</code>
		 * を指定することができます：<pre><code>
renderTpl: '<img src="{imageUrl}" class="x-image-component-img"><div class="x-image-component-desc">{description}</div>',

renderSelectors: {
    image: 'img.x-image-component-img',
    descEl: 'div.x-image-component-desc'
}
</code></pre>
     * <p>上記の指定によって、コンポーネントが描画された後、<code>img</code>要素を参照する<code>image</code>というプロパティと、説明文を含む
		 * <code>div</code>要素を参照する<code>descEl</code>というプロパティがコンポーネントに追加されることになります。</p>
     */

    /**
     * @cfg {Mixed} renderTo
     * <p>このコンポーネントを描画する対象となるElementのID、DOM要素、またはElementそのものを設定します。</p><div><ul>
     * <li><b>備考</b>：<ul>
     * <div class="sub-desc">このコンポーネントが別の{@link Ext.Container Container}オブジェクトに内包される場合、
		 * このオプションは<u>設定しない</u>でください。この場合{@link Ext.Container Container}の
		 * {@link Ext.Container#layout レイアウトマネージャー}が内包される全てのコンポーネントの描画処理を担当します。</div>
     * <div class="sub-desc">また、このオプションを設定した場合renderメソッドの呼び出しは必要ありません。</div>
     * </ul></li>
     * </ul></div>
     * <p><code>{@link #render}</code>メソッドも参照してください。</p>
     */

    /**
     * @cfg {String/Object} componentLayout
     * <br><p>コンポーネントを構成するElementのサイズや配置についてはコンポーネントのレイアウトマネージャーが司っています。
		 * レイアウトマネージャーはコンポーネント毎のレイアウトを生成し管理してくれます。
     * <p>{@link #layout}が明示的に設定されていない一般的なコンポーネントの場合、
		 * {@link Ext.layout.AutoComponentLayout}がデフォルトのレイアウトマネージャーとなります。</p>
     */

    /**
     * @cfg {Mixed} tpl
     * <bold>{@link Ext.Template}</bold>、<bold>{@link Ext.XTemplate}</bold>、または
     * Ext.XTemplateを生成するための文字列の配列を設定。
     * <code>{@link #data}</code>および<code>{@link #tplWriteMode}</code>オプションと合わせて設定されます。
     */

    /**
     * @cfg {Mixed} data
		 * <code>{@link #tpl}</code>と組み合わされ、コンポーネントのコンテンツ領域に描画されるデータセット。
     */

    /**
     * @cfg {String} tplWriteMode コンポーネントのコンテンツ領域を描画する際の{@link Ext.Template}、{@link Ext.XTemplate}
		 * のモード。デフォルト値は<code>'overwrite'</code>（上書き）。詳しくは<code>{@link Ext.XTemplate#overwrite}</code>を参照。
     */
    tplWriteMode: 'overwrite',

    /**
     * @cfg {String} baseCls
     * このコンポーネントの{@link #getElement Element}に適用される最もベースとなるCSSクラス。
		 * このCSSクラス名はこのコンポーネントを構成する全てのDOM要素のCSSクラス名の「接頭辞」としても利用されます。
		 * 例えば、Panelクラスのbodyにはx-panel-bodyといったCSSクラス名が適用されます。つまり、
		 * 例えばPanelを継承したクラスで、単にスタイル設定だけを行ないたいのであれば、baseClsのx-panelには触れずに、
		 * {@link #componentCls}を介してスタイル設定を行う方が簡単ということです。
     */
    baseCls: 'x-component',

    /**
     * @cfg {String} componentCls
     * コンポーネントの{@link #getElement Element}に適用されるCSSクラス。このクラスを介してコンポーネントのスタイル
		 * 設定を行ってください。
     */

    /**
     * @cfg {String} cls
     * このコンポーネントの{@link #getElement Element}に適用される追加のCSSクラス（デフォルトは''）。このオプションは
		 * コンポーネントそのものや、その内包するDOM要素のスタイルをカスタマイズしたい場合に便利なオプションです。
     */

    /**
     * @cfg {String} disabledCls
     * コンポーネントが利用不可状態の時に適用するCSSクラス。デフォルト値は'x-item-disabled'。
     */
    disabledCls: 'x-item-disabled',

    /**
     * @cfg {String} ui
     * 個々のコンポーネント毎に予め定義されたUIのスタイル。
     *
     * lightとdarkはほとんどのコンポーネントで利用可能です。
     *
     * uiで指定された文字列はbaseClsの値に連結（'-'で連結）されて、CSSクラスとして{@link #getElement Element}に追加されます。
     * <pre><code>
      new Ext.Panel({
          title: 'Some Title',
          baseCls: 'x-component'
          ui: 'green'
      });
       </code></pre>
     * <p>上記のケースではx-component-greenというCSSクラスが追加されます。</p>
     */

   /**
     * @cfg {String} style
     * このコンポーネントの{@link #getElement Element}にインラインスタイルとして適用されます。
		 * 書式は{@link Ext.Element#applyStyles}メソッドで利用可能なものである必要があります。
     * <pre><code>
        new Ext.Panel({
            title: 'Some Title',
            renderTo: Ext.getBody(),
            width: 400, height: 300,
            layout: 'form',
            items: [{
                xtype: 'textareafield',
                style: {
                    width: '95%',
                    marginBottom: '10px'
                }
            },
            new Ext.Button({
                text: 'Send',
                minWidth: '100',
                style: {
                    marginBottom: '10px'
                }
            })
            ]
        });
     </code></pre>
     */
    
    /**
     * @cfg {Number} width
     * このコンポーネントの幅。単位はピクセル。
     */
    
    /**
     * @cfg {Number} height
     * このコンポーネントの高さ。単位はピクセル。
     */
    
    /**
     * @cfg {Number/String} border
		 * このコンポーネントの枠線幅を設定。枠線幅は全ての辺（上下左右）に適用する1個の数字、あるいは
		 * CSS方式で各辺の幅を指定する文字列（例：'10 5 3 10'）で指定。
     */
    
    /**
     * @cfg {Number/String} padding
		 * このコンポーネントのパディングを設定。パディングは全ての枠線（上下左右）に適用する1個の数字、あるいは
		 * CSS方式で各辺のパディングを指定する文字列（例：'10 5 3 10'）で指定。
     */
    
    /**
     * @cfg {Number/String} margin
		 * このコンポーネントのマージンを設定。マージンは全ての枠線（上下左右）に適用する1個の数字、あるいは
		 * CSS方式で各辺のマージンを指定する文字列（例：'10 5 3 10'）で指定。
     */

    /**
     * @cfg {Boolean} hidden
     * デフォルトはfalse。
     */
    hidden: false,

    /**
     * @cfg {Boolean} disabled
     * デフォルトはfalse。
     */
    disabled: false,

    /**
     * @cfg {Boolean} draggable
		 * タッチイベントでのコンポーネントのドラッグの可否を設定。
     */

    /**
     * コンポーネントがドラッグ可能かどうかを表すプロパティ。読み取り専用。
     * @property draggable
     * @type {Boolean}
     */
    draggable: false,

    /**
     * @cfg {Boolean} floating
		 * コンポーネントをフロート状態で生成。positionはabsolute設定。
     * デフォルトはfalse。
     */
    floating: false,

    /**
     * @cfg {String} contentEl
     * <p>オプション。描画済みのHTML要素またはHTML要素の<code>id</code>をコンポーネントのコンテンツとして設定。</p>
     * <ul>
     * <li><b>解説</b>： 
     * <div class="sub-desc">このオプションは描画済みのHTML要素を新しく生成するコンポーネントのレイアウト要素に
		 * 取り込む際に利用します（実際には<i>コンポーネントが描画された後で</i>指定されたDOM要素をコンポーネント内に移動
		 * させているだけです）。</div></li>
     * <li><b>備考</b>：
     * <div class="sub-desc">ここで指定されたHTML要素は、コンポーネント{@link #html HTML}オプションで設定されたものの追加が完了してから
		 * 初めてレイアウト要素に追加されます。従って、コンポーネントの{@link #render}イベント発行時には、このHTML要素はまだコンポーネント
		 * 内には存在していません。</div>
     * <div class="sub-desc">また、ここで指定されたHTML要素はコンポーネントが利用する<code><b>{@link Ext.Container#layout レイアウト}</b></code>
     * とは一切関わりを持ちません。単なる普通のHTMLだと考えてください。レイアウトはあくまでもコンテナの
		 * <code><b>{@link Ext.Container#items items}</b></code>に対して適用されるものです。</div>
     * <div class="sub-desc">このオプションを利用する際にはHTML要素が描画される際のチラツキを抑えるために、CSSクラスの<code>x-hidden</code>
		 * または<code>x-hide-display</code>を追加してください。</div></li>
     * </ul>
     */

    /**
     * @cfg {String/Object} html
		 * コンポーネントのレイアウト要素にコンテンツとして追加するHTMLフラグメント、あるいは{@link Ext.DomHelper DomHelper}書式の
		 * オブジェクトを設定（デフォルトは''）。HTMLコンテンツはコンポーネントの描画後に追加されるため、コンポーネントの{@link #render}
		 * イベント発行時には、このHTML要素はまだコンポーネント内には存在していません。
		 * ここで指定したコンテンツは{@link #contentEl}で指定したコンテンツより<i>先に</i>追加されます。
     */

    /**
     * @cfg {String} styleHtmlContent
		 * このコンポーネントの内部（Panelであればbody）に追加されるHTMLにスタイルを自動的に設定するかを指定。
     * デフォルトはfalse。
     */
    styleHtmlContent: false,

    /**
     * @cfg {String} styleHtmlCls
		 * styleHtmlContentをtrueに設定した場合に、HTMLコンテンツを内包するDOM要素に追加されるCSSクラス。
     * デフォルトはx-html。
     */
    styleHtmlCls: 'x-html',

    /**
     * @cfg {Number} minHeight
     * <p>このコンポーネントの最小の高さ。単位はピクセル。</p>
     * <p><b>注意：</b>これを設定するとレイアウトマネージャーによるサイズ管理をオーバーライドします。</p>
     */
    /**
     * @cfg {Number} minWidth
     * <p>このコンポーネントの最小幅。単位はピクセル。</p>
     * <p><b>注意：</b>これを設定するとレイアウトマネージャーによるサイズ管理をオーバーライドします。</p>
     */
    /**
     * @cfg {Number} maxHeight
     * <p>このコンポーネントの最大の高さ。単位はピクセル。</p>
     * <p><b>注意：</b>これを設定するとレイアウトマネージャーによるサイズ管理をオーバーライドします。</p>
     */
    /**
     * @cfg {Number} maxWidth
     * <p>このコンポーネントの最大幅。単位はピクセル。</p>
     * <p><b>注意：</b>これを設定するとレイアウトマネージャーによるサイズ管理をオーバーライドします。</p>
     */

     // @private
     allowDomMove: true,
     autoShow: false,
     
     autoRender: false,

     needsLayout: false,

    /**
     * @cfg {Object/Array} plugins
		 * このコンポーネントに対して、カスタマイズされた機能を追加するためのオブジェクト、またはオブジェクトの配列。
		 * プラグインの要件はExt.Componentへの参照を引数とするinitメソッドを備えていることです。
		 * コンポーネント生成時にプラグインが設定されていると、コンポーネントはそれぞれのプラグインのinitメソッドを
		 * 自分自身を引数として呼び出します。プラグインはそのタイミングで自分自身の別のメソッドを呼び出したり、イベント
		 * リスナーの設定を行ったり、必要な処理を行うことになります。
     */

    /**
     * コンポーネントが描画済みがどうかを表すプロパティ。読み取り専用。
     * @property rendered
     * @type {Boolean}
     */
    rendered: false,

    constructor : function(config) {
        config = config || {};
        this.initialConfig = config;
        Ext.apply(this, config);

        this.addEvents(
            /**
             * @event beforeactivate
						 * コンポーネントが有効化される前に発行されます。
						 * イベントリスナーがfalseを返すことでactivateイベントの発行を
						 * 中止することができます。
             * @param {Ext.Component} this
             */
             'beforeactivate',
            /**
             * @event activate
						 * コンポーネントが有効化された後に発行されます。
             * @param {Ext.Component} this
             */
             'activate',
            /**
             * @event beforedeactivate
						 * コンポーネントが無効化される前に発行されます。
						 * イベントリスナーがfalseを返すことでdeactivateイベントの発行を
						 * 中止することができます。
             * @param {Ext.Component} this
             */
             'beforedeactivate',
            /**
             * @event deactivate
						 * コンポーネントが無効化された後に発行されます。
             * @param {Ext.Component} this
             */
             'deactivate',
            /**
             * @event added
						 * コンポーネントがコンテナ（Container)に追加された際に発行されます。
             * @param {Ext.Component} this
             * @param {Ext.Container} container 親となるコンテナ
             * @param {Number} pos コンテナのitemsの中での位置
             */
             'added',
            /**
             * @event disable
						 * コンポーネントが利用不可状態になった際に発行されます。
             * @param {Ext.Component} this
             */
             'disable',
            /**
             * @event enable
						 * コンポーネントが利用可能状態になった際に発行されます。
             * @param {Ext.Component} this
             */
             'enable',
            /**
             * @event beforeshow
						 * {@link #show}メソッドを使ってコンポーネントを表示する直前に発行されます。
						 * イベントリスナーがfalseを返すことでshowイベントを中止することができます。
             * @param {Ext.Component} this
             */
             'beforeshow',
            /**
             * @event show
						 * {@link #show}メソッドを使ってコンポーネントを表示した後に発行されます。
             * @param {Ext.Component} this
             */
             'show',
            /**
             * @event beforehide
						 * {@link #hide}メソッドを使ってコンポーネントを非表示にする直前に発行されます。
						 * イベントリスナーがfalseを返すことでhideイベントを中止することができます。
             * @param {Ext.Component} this
             */
             'beforehide',
            /**
             * @event hide
						 * {@link #hide}メソッドを使ってコンポーネントを非表示にした後に発行されます。
             * @param {Ext.Component} this
             */
             'hide',
            /**
             * @event removed
						 * コンポーネントがコンテナ（Container)から削除された際に発行されます。
             * @param {Ext.Component} this
             * @param {Ext.Container} ownerCt コンポーネントを保持していたコンテナ
             */
             'removed',
            /**
             * @event beforerender
						 * コンポーネントの要素が描画される直前に発行されます。
						 * イベントリスナーがfalseを返すことでrederイベントを中止することができます。
             * @param {Ext.Component} this
             */
             'beforerender',
            /**
             * @event render
						 * コンポーネントの要素が描画されたあとに発行されます。
             * @param {Ext.Component} this
             */
             'render',
            /**
             * @event afterrender
						 * <p>コンポーネントの描画処理が終了したあとに発行されます。</p>
						 * <p>このイベントはコンポーネントのrenderイベントが発行され、afterRenderメソッドが終了し、そして
						 * {@link #stateful}状態である場合、状態復帰が完了した後に発行されます。</p>
             * <p>Fires after the component rendering is finished.</p>
             * @param {Ext.Component} this
             */
             'afterrender',
            /**
             * @event beforedestroy
						 * コンポーネントが破壊される直前に発行されます。イベントリスナーがfalseを返すことでdestroyイベントを
						 * 中止することができます。
             * @param {Ext.Component} this
             */
             'beforedestroy',
            /**
             * @event destroy
						 * コンポーネントが破壊された後に発行されます。
             * @param {Ext.Component} this
             */
             'destroy',
            /**
             * @event resize
						 * コンポーネントのサイズが変更された後に発行されます。
             * @param {Ext.Component} this
             * @param {Number} adjWidth ボックスモデルにより修正された実際の幅
             * @param {Number} adjHeight ボックスモデルにより修正された実際の高さ
             * @param {Number} rawWidth 幅として元々指定された値
             * @param {Number} rawHeight 高さとして元々指定された値
             */
             'resize',
            /**
             * @event move
             * コンポーネントが移動した後に発行されます。
             * @param {Ext.Component} this
             * @param {Number} x 新しいx座標
             * @param {Number} y 新しいy座標
             */
             'move',

             'beforestaterestore',
             'staterestore',
             'beforestatesave',
             'statesave'
        );

        this.getId();

        this.mons = [];
        this.additionalCls = [];
        this.renderData = this.renderData || {};
        this.renderSelectors = this.renderSelectors || {};

        this.initComponent();

        // ititComponent gets a chance to change the id property before registering
        Ext.ComponentMgr.register(this);

        // Dont pass the config so that it is not applied to 'this' again
        Ext.lib.Component.superclass.constructor.call(this);

        // Move this into Observable?
        if (this.plugins) {
            this.plugins = [].concat(this.plugins);
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i] = this.initPlugin(this.plugins[i]);
            }
        }

        // This won't work in Touch
        if (this.applyTo) {
            this.applyToMarkup(this.applyTo);
            delete this.applyTo;
        }
        else if (this.renderTo) {
            this.render(this.renderTo);
            delete this.renderTo;
        }
        
        //<debug>
        if (Ext.isDefined(this.disabledClass)) {
            throw "Component: disabledClass has been deprecated. Please use disabledCls.";
        }
        //</debug>
    },

    initComponent: Ext.emptyFn,
    applyToMarkup: Ext.emptyFn,
    
    show: Ext.emptyFn,

    onShow : function() {
        // Layout if needed
        var needsLayout = this.needsLayout;
        if (Ext.isObject(needsLayout)) {
            this.doComponentLayout(needsLayout.width, needsLayout.height, needsLayout.isSetSize);
        }
    },
    
    // @private
    initPlugin : function(plugin) {
        if (plugin.ptype && typeof plugin.init != 'function') {
            plugin = Ext.PluginMgr.create(plugin);
        }
        else if (typeof plugin == 'string') {
            plugin = Ext.PluginMgr.create({
                ptype: plugin
            });
        }

        plugin.init(this);

        return plugin;
    },

    // @private
    render : function(container, position) {
        if (!this.rendered && this.fireEvent('beforerender', this) !== false) {
            // If this.el is defined, we want to make sure we are dealing with
            // an Ext Element.
            if (this.el) {
                this.el = Ext.get(this.el);
            }

            container = this.initContainer(container);

            this.onRender(container, position);
            this.fireEvent('render', this);

            this.initContent();

            this.afterRender(container);
            this.fireEvent('afterrender', this);

            this.initEvents();

            if (this.autoShow) {
                this.show();
            }

            if (this.hidden) {
                // call this so we don't fire initial hide events.
                this.onHide(false); // no animation after render
            }

            if (this.disabled) {
                // pass silent so the event doesn't fire the first time.
                this.disable(true);
            }
        }

        return this;
    },

    // @private
    onRender : function(container, position) {
        var el = this.el,
            renderTpl,
            renderData;

        position = this.getInsertPosition(position);

        if (!el) {
            if (position) {
                el = Ext.DomHelper.insertBefore(position, this.getElConfig(), true);
            }
            else {
                el = Ext.DomHelper.append(container, this.getElConfig(), true);
            }
        }
        else if (this.allowDomMove !== false) {
            container.dom.insertBefore(el.dom, position);
        }

        el.addCls(this.initCls());
        el.setStyle(this.initStyles());

        // Here we check if the component has a height set through style or css.
        // If it does then we set the this.height to that value and it won't be
        // considered an auto height component
        // if (this.height === undefined) {
        //     var height = el.getHeight();
        //     // This hopefully means that the panel has an explicit height set in style or css
        //     if (height - el.getPadding('tb') - el.getBorderWidth('tb') > 0) {
        //         this.height = height;
        //     }
        // }

        renderTpl = this.initRenderTpl();
        if (renderTpl) {
            renderData = this.initRenderData();
            renderTpl.append(el, renderData);
        }

        this.el = el;
        this.applyRenderSelectors();
        this.rendered = true;
    },

    /**
     * <p>Creates an array of class names from the configurations to add to this Component's <code>el</code> on render.</p>
     * <p>Private, but (possibly) used by ComponentQuery for selection by class name if Component is not rendered.</p>
     * @return {Array} An array of class names with which the Component's element will be rendered.
     * @private
     */
    initCls: function() {
        var cls = [ this.baseCls ];

        //<deprecated since=0.99>
        if (Ext.isDefined(this.cmpCls)) {
            throw "Ext.Component: cmpCls renamed to componentCls";
        }
        //</deprecated>
        if (this.componentCls) {
            cls.push(this.componentCls);
        }
        else {
            this.componentCls = this.baseCls;
        }
        if (this.cls) {
            cls.push(this.cls);
            delete this.cls;
        }
        if (this.ui) {
            cls.push(this.componentCls + '-' + this.ui);
        }
        return cls.concat(this.additionalCls);
    },

    // @private
    afterRender : function() {
        this.getComponentLayout();

        if (this.x || this.y) {
            this.setPosition(this.x, this.y);
        }

        if (this.styleHtmlContent) {
            this.getTargetEl().addCls(this.styleHtmlCls);
        }

        // If there is a width or height set on this component we will call
        // which will trigger the component layout
        if (!this.ownerCt) {
            this.setSize(this.width, this.height);
        }
    },

    getElConfig : function() {
        return {tag: 'div', id: this.id};
    },

    /**
		 * このメソッドはonRenderメソッドに渡されるpositionを引数として受け取り、
		 * insertBeforeメソッドで利用できるDOM要素を返します。
     * @param {String/Number/Element/HTMLElement} position インデックス値、要素のid、あるいはこのコンポーネントを
		 * その直前に挿入したい要素そのもの。
     * @return {HTMLElement} DOM insertBeforeで利用できる要素
     */
    getInsertPosition: function(position) {
        // Convert the position to an element to insert before
        if (position !== undefined) {
            if (Ext.isNumber(position)) {
                position = this.container.dom.childNodes[position];
            }
            else {
                position = Ext.getDom(position);
            }
        }

        return position;
    },

    /**
     * Adds ctCls to container.
     * @return {Ext.Element} The initialized container
     * @private
     */
    initContainer: function(container) {
        // If you render a component specifying the el, we get the container
        // of the el, and make sure we dont move the el around in the dom
        // during the render
        if (!container && this.el) {
            container = this.el.dom.parentNode;
            this.allowDomMove = false;
        }

        this.container = Ext.get(container);

        if (this.ctCls) {
            this.container.addCls(this.ctCls);
        }

        return this.container;
    },

    /**
     * Initialized the renderData to be used when rendering the renderTpl.
     * @return {Object} Object with keys and values that are going to be applied to the renderTpl
     * @private
     */
    initRenderData: function() {
        return Ext.applyIf(this.renderData, {
            baseCls: this.baseCls,
            componentCls: this.componentCls
        });
    },

    /**
     * Initializes the renderTpl.
     * @return {Ext.XTemplate} The renderTpl XTemplate instance.
     * @private
     */
    initRenderTpl: function() {
        var renderTpl = this.renderTpl;
        if (renderTpl) {
            if (this.proto.renderTpl !== renderTpl) {
                if (Ext.isArray(renderTpl) || typeof renderTpl === "string") {
                    renderTpl = new Ext.XTemplate(renderTpl);
                }
            }
            else if (Ext.isArray(this.proto.renderTpl)){
                renderTpl = this.proto.renderTpl = new Ext.XTemplate(renderTpl);
            }
        }
        return renderTpl;
    },

    /**
     * Function description
     * @return {String} A CSS style string with style, padding, margin and border.
     * @private
     */
    initStyles: function() {
        var style = {},
            Element = Ext.Element,
            i, ln, split, prop;

        if (Ext.isString(this.style)) {
            split = this.style.split(';');
            for (i = 0, ln = split.length; i < ln; i++) {
                if (!Ext.isEmpty(split[i])) {
                    prop = split[i].split(':');
                    style[Ext.util.Format.trim(prop[0])] = Ext.util.Format.trim(prop[1]);
                }
            }
        } else {
            style = Ext.apply({}, this.style);
        }

        // Convert the padding, margin and border properties from a space seperated string
        // into a proper style string
        if (this.padding != undefined) {
            style.padding = Element.unitizeBox((this.padding === true) ? 5 : this.padding);
        }

        if (this.margin != undefined) {
            style.margin = Element.unitizeBox((this.margin === true) ? 5 : this.margin);
        }

        if (this.border != undefined) {
            style.borderWidth = Element.unitizeBox((this.border === true) ? 1 : this.border);
        }

        delete this.style;
        return style;
    },

    /**
     * Initializes this components contents. It checks for the properties
     * html, contentEl and tpl/data.
     * @private
     */
    initContent: function() {
        var target = this.getTargetEl();

        if (this.html) {
            target.update(Ext.DomHelper.markup(this.html));
            delete this.html;
        }

        if (this.contentEl) {
            var contentEl = Ext.get(this.contentEl);
            contentEl.show();
            target.appendChild(contentEl.dom);
        }

        if (this.tpl) {
            // Make sure this.tpl is an instantiated XTemplate
            if (!this.tpl.isTemplate) {
                this.tpl = new Ext.XTemplate(this.tpl);
            }

            if (this.data) {
                this.tpl[this.tplWriteMode](target, this.data);
                delete this.data;
            }
        }
    },

    // @private
    initEvents : function() {
        var afterRenderEvents = this.afterRenderEvents,
            property, listeners;
        if (afterRenderEvents) {
            for (property in afterRenderEvents) {
                if (!afterRenderEvents.hasOwnProperty(property)) {
                    continue;
                }
                listeners = afterRenderEvents[property];
                if (this[property] && this[property].on) {
                    this.mon(this[property], listeners);
                }
            }
        }
    },

    /**
     * Sets references to elements inside the component. E.g body -> x-panel-body
     * @private
     */
    applyRenderSelectors: function() {
        var selectors = this.renderSelectors || {},
            el = this.el.dom,
            selector;

        for (selector in selectors) {
            if (!selectors.hasOwnProperty(selector)) {
                continue;
            }
            this[selector] = Ext.get(Ext.DomQuery.selectNode(selectors[selector], el));
        }
    },

    is: function(selector) {
        return Ext.ComponentQuery.is(this, selector);
    },

    /**
     * <p>指定されたセレクタにマッチするコンテナオブジェクトを<code>ownerCt</code>方向に探索します。</p>
     * <p>例：<pre><code>
var owningTabContainer = grid.up('tabcontainer');
</code></pre>
     * @param {String} selector オプション。マッチさせるセレクタ。
     * @return {Ext.Container} マッチしたコンテナ（見つからなかった場合<code>undefined</code>）
     */
    up: function(selector) {
        var result = this.ownerCt;
        if (selector) {
            for (; result; result = result.ownerCt) {
                if (Ext.ComponentQuery.is(result, selector)) {
                    return result;
                }
            }
        }
        return result;
    },

    /**
		 * <p>このコンポーネントと同じ階層で一つ次に位置するコンポーネントを返します。</p>
     * <p>指定された{@link Ext.ComponentQuery ComponentQuery}セレクタにマッチするコンポーネントを同じ階層を進む方向に探索します。</p>
     * <p>短縮形として<code>next()</code>としてメソッドを呼び出すこともできます。</p>
     * @param selector オプション。{@link Ext.ComponentQuery ComponentQuery}セレクタを指定して結果をフィルター
     * @returns 同じ階層で一つ次に位置する（またはセレクタにマッチする最初の）コンポーネント。マッチするものがない場合はnull。
     */
    nextSibling: function(selector) {
        var o = this.ownerCt, it, last, idx, c; 
        if (o) {
            it = o.items;
            idx = it.indexOf(this) + 1;
            if (idx) {
                if (selector) {
                    for (last = it.getCount(); idx < last; idx++) {
                        if ((c = it.getAt(idx)).is(selector)) {
                            return c;
                        }
                    }
                } else {
                    if (idx < it.getCount()) {
                        return it.getAt(idx);
                    }
                }
            }
        }
        return null;
    },

    /**
		 * <p>このコンポーネントと同じ階層で一つ前に位置するコンポーネントを返します。</p>
     * <p>指定された{@link Ext.ComponentQuery ComponentQuery}セレクタにマッチするコンポーネントを同じ階層を戻る方向に探索します。</p>
     * <p>短縮形として<code>prev()</code>としてメソッドを呼び出すこともできます。</p>
     * @param selector オプション。{@link Ext.ComponentQuery ComponentQuery}セレクタを指定して結果をフィルター
     * @returns 同じ階層で一つ前に位置する（またはセレクタにマッチする最初の）コンポーネント。マッチするものがない場合はnull。
     */
    previousSibling: function(selector) {
        var o = this.ownerCt, it, idx, c; 
        if (o) {
            it = o.items;
            idx = it.indexOf(this);
            if (idx != -1) {
                if (selector) {
                    for (--idx; idx >= 0; idx--) {
                        if ((c = it.getAt(idx)).is(selector)) {
                            return c;
                        }
                    }
                } else {
                    if (idx) {
                        return it.getAt(--idx);
                    }
                }
            }
        }
        return null;
    },

    /**
		 * コンポーネントのidを取得します。
		 * コンポーネントにidが設定されていない場合は自動生成したidが設定されます。
     */
    getId : function() {
        return this.id || (this.id = 'ext-comp-' + (++Ext.lib.Component.AUTO_ID));
    },

    getItemId : function() {
        return this.itemId || this.id;
    },

    /**
		 * このコンポーネントのトップレベル要素を取得します。
     */
    getEl : function() {
        return this.el;
    },

    /**
     * This is used to determine where to insert the 'html', 'contentEl' and 'items' in this component.
     * @private
     */
    getTargetEl: function() {
        return this.el;
    },

    /**
     * <p>このコンポーネントが指定したxtypeかどうかを確認します。このメソッドでは、コンポーネントが指定したxtypeを継承した
		 * ものなのか（デフォルトの挙動）、指定したxtypeそのものなのか（shallow = true指定時）の確認ができます。</p>
     * <p><b>独自に作成したクラスの継承関係を確認する場合は、そのクラスのxtypeが登録されている必要があります。</b></p>
     * <p>定義済みのxtypeについては{@link Ext.Component}の説明文を参照してください。</p>
     * <p>利用例：</p>
     * <pre><code>
var t = new Ext.form.Text();
var isText = t.isXType('textfield');        // true
var isBoxSubclass = t.isXType('field');       // true, Ext.form.Fieldクラスを継承
var isBoxInstance = t.isXType('field', true); // false, Ext.form.Fieldのインスタンスではない 
</code></pre>
     * @param {String} xtype 確認するxtype
     * @param {Boolean} shallow (optional) 継承関係上の親クラスにもマッチさせる場合にはfalseと設定（デフォルト値）。trueと
		 * 設定することで、コンポーネントがxtypeのインスタンスかどうかを確認。
     * @return {Boolean} True xtypeにマッチした場合はtrue、しない場合はfalse
     */
    isXType: function(xtype, shallow) {
        //assume a string by default
        if (Ext.isFunction(xtype)) {
            xtype = xtype.xtype;
            //handle being passed the class, e.g. Ext.Component
        } else if (Ext.isObject(xtype)) {
            xtype = xtype.constructor.xtype;
            //handle being passed an instance
        }

        return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1: this.constructor.xtype == xtype;
    },

    /**
		 * <p>コンポーネントの継承関係上の全ての親クラスのxtypeを「/」で区切った文字列として返します。定義済みの
		 * xtypeについては{@link Ext.Component}の説明文を参照してください。</p>
		 * <p><b>独自に作成したサブクラスにこのメソッドを使う場合は、そのクラスのxtypeが登録されている必要があります。</b></p>
     * <p>利用例：</p>
     * <pre><code>
var t = new Ext.form.Text();
alert(t.getXTypes());  // 'component/field/textfield'と出力
</code></pre>
     * @return {String} xtypeの継承関係を表す文字列
     */
    getXTypes: function() {
        var constructor = this.constructor,
            xtypes      = [],
            superclass  = this,
            xtype;

        if (!constructor.xtypes) {
            while (superclass) {
                xtype = superclass.constructor.xtype;

                if (xtype != undefined) {
                    xtypes.unshift(xtype);
                }

                superclass = superclass.constructor.superclass;
            }

            constructor.xtypeChain = xtypes;
            constructor.xtypes = xtypes.join('/');
        }

        return constructor.xtypes;
    },

    /**
     * コンポーネントのコンテンツ領域を更新します。
     * @param {Mixed} htmlOrData
		 * このコンポーネントにtplオプションが設定されている場合は、このメソッドは引数をtplに入力するdata
		 * として扱います。テンプレートが設定されていない場合には、引数はコンテンツ領域（Ext.Element）の
		 * updateメソッドに渡され処理されます。
     * @param {Boolean} loadScripts
     * オプション。第一引数がhtmlの場合にのみ有効。デフォルト値はfalse。
     * @param {Function} callback
		 * オプション。第一引数がhtmlの場合にのみ有効。スクリプト完了時に呼び出されるコールバック関数
     */
    update : function(htmlOrData, loadScripts, cb) {
        if (this.tpl && !Ext.isString(htmlOrData)) {
            this.data = htmlOrData;
            if (this.rendered) {
                this.tpl[this.tplWriteMode](this.getTargetEl(), htmlOrData || {});
            }
        }
        else {
            this.html = Ext.isObject(htmlOrData) ? Ext.DomHelper.markup(htmlOrData) : htmlOrData;
            if (this.rendered) {
                this.getTargetEl().update(this.html, loadScripts, cb);
            }
        }

        if (this.rendered) {
            this.doComponentLayout();
        }
    },

    /**
		 * このコンポーネントの表示・非表示を設定
     * @param {Boolean} visible 表示する場合はtrue、非表示にする場合はfalse
     * @return {Ext.Component} this
     */
    setVisible : function(visible) {
        return this[visible ? 'show': 'hide']();
    },

    /**
		 * このコンポーネントが表示されている場合にtrueを返します
     * @return {Boolean} コンポーネントが表示されてい場合はtrue、非表示の場合はfalse
     */
    isVisible: function() {
        var visible = !this.hidden,
            cmp     = this.ownerCt;

        // Clear hiddenOwnerCt property
        this.hiddenOwnerCt = false;
        if (this.destroyed) {
            return false;
        };

        if (visible && this.rendered && cmp) {
            while (cmp) {
                if (cmp.hidden || cmp.collapsed) {
                    // Store hiddenOwnerCt property if needed
                    this.hiddenOwnerCt = cmp;
                    visible = false;
                    break;
                }
                cmp = cmp.ownerCt;
            }
        }
        return visible;
    },

    /**
		 * コンポーネントを利用可能にします。
     * @param {Boolean} silent
		 * falseを渡すことでenableイベントを発行しないようにします。
     */
    enable : function(silent) {
        if (this.rendered) {
            this.el.removeCls(this.disabledCls);
            this.el.dom.disabled = false;
            this.onEnable();
        }

        this.disabled = false;

        if (silent !== true) {
            this.fireEvent('enable', this);
        }

        return this;
    },

    /**
     * コンポーネントを利用不可にします。
     * @param {Boolean} silent
		 * falseを渡すことでdisableイベントを発行しないようにします。
     */
    disable : function(silent) {
        if (this.rendered) {
            this.el.addCls(this.disabledCls);
            this.el.dom.disabled = true;
            this.onDisable();
        }

        this.disabled = true;

        if (silent !== true) {
            this.fireEvent('disable', this);
        }

        return this;
    },

    /**
		 * このコンポーネントが現在利用不可かどうかを判定します。
     * @return {Boolean} コンポーネントが利用不可の場合はtrue、そうじゃない場合はfalse
     */
    isDisabled : function() {
        return this.disabled;
    },
    
    /**
		 * このコンポーネントの利用可・不可を設定します。
     * @param {Boolean} disabled
     */
    setDisabled : function(disabled) {
        return this[disabled ? 'disable': 'enable']();
    },

    /**
		 * このコンポーネントが現在非表示かどうかを判定します。
     * @return {Boolean} コンポーネントが非表示の場合はtrue、そうじゃない場合はfalse
     */
    isHidden : function() {
        return this.hidden;
    },
    
    /**
		 * このコンポーネントのトップレベル要素にCSSクラスを付加します。
     * @returns {Ext.Component} コンポーネント自身を返します。
     */
    addCls : function() {
        var me = this,
            args = Ext.toArray(arguments);
        if (me.rendered) {
            me.el.addCls(args);
        }
        else {
            me.additionalCls = me.additionalCls.concat(args);
        }
        return me;
    },

    //<debug>
    addClass : function() {
        throw "Component: addClass has been deprecated. Please use addCls.";
    },
    //</debug>
    
    /**
		 * このコンポーネントのトップレベル要素からCSSクラスを削除します。
     * @returns {Ext.Component} コンポーネント自身を返します。
     */
    removeCls : function() {
        var me = this,
            args = Ext.toArray(arguments);
        if (me.rendered) {
            me.el.removeCls(args);
        }
        else if (me.additionalCls.length) {
            Ext.each(args, function(cls) {
                me.additionalCls.remove(cls);
            });
        }
        return me;
    },
    
    //<debug>
    removeClass : function() {
        throw "Component: removeClass has been deprecated. Please use removeCls.";
    },
    //</debug>

    addListener : function(element, listeners, scope, options) {
        if (Ext.isString(element) && (Ext.isObject(listeners) || options && options.element)) {
            if (options.element) {
                var fn = listeners,
                    option;

                listeners = {};
                listeners[element] = fn;
                element = options.element;
                if (scope) {
                    listeners.scope = scope;
                }

                for (option in options) {
                    if (!options.hasOwnProperty(option)) {
                        continue;
                    }
                    if (this.eventOptionsRe.test(option)) {
                        listeners[option] = options[option];
                    }
                }
            }

            // At this point we have a variable called element,
            // and a listeners object that can be passed to on
            if (this[element] && this[element].on) {
                this.mon(this[element], listeners);
            }
            else {
                this.afterRenderEvents = this.afterRenderEvents || {};
                this.afterRenderEvents[element] = listeners;
            }
        }

        return Ext.lib.Component.superclass.addListener.apply(this, arguments);
    },

    // @TODO: implement removelistener to support the dom event stuff

    /**
		 * fireEventで発行されたイベントがバブルアップするためのターゲットを取得します。
     * @return {Ext.Container} このコンポーネントを保持するコンテナを返します。
     */
    getBubbleTarget : function() {
        return this.ownerCt;
    },

    /**
		 * このコンポーネントがフロート状態かどうかを判定します。
     * @return {Boolean} このコンポーネントがフローと状態の場合はtrue、そうじゃない場合はfalse
     */
    isFloating : function() {
        return this.floating;
    },

    /**
		 * このコンポーネントがドラッグ可能かどうかを判定します。
     * @return {Boolean} このコンポーネントがドラッグ可能であればtrue、そうじゃない場合はfalse
     */    
    isDraggable : function() {
        return !!this.draggable;
    },
    
    /**
		 * このコンポーネントがドロップ可能かどうかを判定します。
     * @return {Boolean} このコンポーネントがドロップ可能であればtrue、そうじゃない場合はfalse
     */
    isDroppable : function() {
        return !!this.droppable;
    },

    /**
     * @private
     * Method to manage awareness of when components are added to their
     * respective Container, firing an added event.
     * References are established at add time rather than at render time.
     * @param {Ext.Container} container Container which holds the component
     * @param {number} pos Position at which the component was added
     */
    onAdded : function(container, pos) {
        this.ownerCt = container;
        this.fireEvent('added', this, container, pos);
    },

    /**
     * @private
     * Method to manage awareness of when components are removed from their
     * respective Container, firing an removed event. References are properly
     * cleaned up after removing a component from its owning container.
     */
    onRemoved : function() {
        this.fireEvent('removed', this, this.ownerCt);
        delete this.ownerCt;
    },

    // @private
    onEnable : Ext.emptyFn,
    // @private
    onDisable : Ext.emptyFn,
    // @private
    beforeDestroy : Ext.emptyFn,
    // @private
    // @private
    onResize : Ext.emptyFn,

    /**
		 * コンポーネントの幅と高さを設定します。このメソッドは{@link #resize}を発行します。このメソッドは幅と高さ別々の
		 * 引数として取ることもできますし、サイズを表すオブジェクト（例：<code>{width:10, height:20}</code>）を取ることも
		 * できます。
     * @param {Mixed} width 新しく設定する幅の値。この値には下記のいずれかが指定できます：<div class="mdetail-params"><ul>
     * <li>このコンポーネントの{@link #getEl トップレベル要素}の{@link Ext.Element#defaultUnit}メソッド指定された単位の数値（デフォルトはピクセル）。</li>
     * <li>CSSでwidthを設定する際に利用可能な文字列</li>
     * <li>サイズオブジェクト（フォーマットは次の通り：<code>{width: widthValue, height: heightValue}</code>）</li>
     * <li>幅を変更しない場合は<code>undefined</code></li>
     * </ul></div>
     * @param {Mixed} height 新しく設定する高さの値（第一引数がサイズオブジェクトの場合は省略可能）
     * この値には下記のいずれかが指定できます：<div class="mdetail-params"><ul>
     * <li>このコンポーネントの{@link #getEl トップレベル要素}の{@link Ext.Element#defaultUnit}メソッド指定された単位の数値（デフォルトはピクセル）。</li>
     * <li>CSSでheightを設定する際に利用可能な文字列</li>
     * <li>高さを変更しない場合は<code>undefined</code></li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setSize : function(width, height) {
        // support for standard size objects
        if (Ext.isObject(width)) {
            height = width.height;
            width  = width.width;
        }
        if (!this.rendered || !this.isVisible()) {
            // If an ownerCt is hidden, add my reference onto the layoutOnShow stack.  Set the needsLayout flag.
            if (this.hiddenOwnerCt) {
                var layoutCollection = this.hiddenOwnerCt.layoutOnShow;
                layoutCollection.remove(this);
                layoutCollection.add(this);
            }
            this.needsLayout = {
                width: width,
                height: height,
                isSetSize: true
            };
            if (!this.rendered) {
                this.width  = (width !== undefined) ? width : this.width;
                this.height = (height !== undefined) ? height : this.height;
            }
            return this;
        }
        this.doComponentLayout(width, height, true);

        return this;
    },

    setCalculatedSize : function(width, height) {
        // support for standard size objects
        if (Ext.isObject(width)) {
            height = width.height;
            width  = width.width;
        }
        if (!this.rendered || !this.isVisible()) {
            // If an ownerCt is hidden, add my reference onto the layoutOnShow stack.  Set the needsLayout flag.
            if (this.hiddenOwnerCt) {
                var layoutCollection = this.hiddenOwnerCt.layoutOnShow;
                layoutCollection.remove(this);
                layoutCollection.add(this);
            }
            this.needsLayout = {
                width: width,
                height: height,
                isSetSize: false
            };
            return this;
        }
        this.doComponentLayout(width, height);

        return this;
    },

    /**
		 * このコンポーネント内のレイアウトを再計算する必要がある操作を行った場合には必ずこのメソッドを呼び出してください。
		 * 例えば、PanelのdockedItemを表示・非表示・追加したり、フォームフィールドのラベルを変更したような場合です。
		 * コンポーネントがレイアウトされた後に、コンテナのレイアウトは自動的に行われます。従って、レイアウトに影響を
		 * 与えるような操作の後にはdoLayoutではなくdoComponentLayoutを呼び出した方が大抵の場合安全です。
     * @return {Ext.Container} this
     */
    doComponentLayout : function(width, height, isSetSize) {
        var componentLayout = this.getComponentLayout();
        if (this.rendered && componentLayout) {
            width = (width !== undefined || this.collapsed === true) ? width : this.width;
            height = (height !== undefined || this.collapsed === true) ? height : this.height;
            if (isSetSize) {
                this.width = width;
                this.height = height;
            }

            componentLayout.layout(width, height);
        }
        return this;
    },

    // @private
    setComponentLayout : function(layout) {
        var currentLayout = this.componentLayout;
        if (currentLayout && currentLayout.isLayout && currentLayout != layout) {
            currentLayout.setOwner(null);
        }
        this.componentLayout = layout;
        layout.setOwner(this);
    },
    
    getComponentLayout : function() {
        if (!this.componentLayout || !this.componentLayout.isLayout) {
            this.setComponentLayout(Ext.layout.LayoutManager.create(this.componentLayout, 'autocomponent'));
        }
        return this.componentLayout;
    },

    afterComponentLayout: Ext.emptyFn,

    /**
		 * コンポーネントのleftとtopの値を設定します。ページ内での座標を設定したい場合は{@link #setPagePosition}メソッド
		 * を使ってください。このメソッドは{@link #move}イベントを発行します。
     * @param {Number} left 新しく設定するleftの値
     * @param {Number} top 新しく設定するtopの値
     * @return {Ext.Component} this
     */
    setPosition : function(x, y) {
        if (Ext.isObject(x)) {
            y = x.y;
            x = x.x;
        }

        if (!this.rendered) {

            return this;
        }

        if (x !== undefined || y !== undefined) {
            this.el.setBox(x, y);
            this.onPosition(x, y);
            this.fireEvent('move', this, x, y);
        }
        return this;
    },

    /* @private
     * Called after the component is moved, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a move occurs.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     */
    onPosition: Ext.emptyFn,

    /**
     * Sets the width of the component.  This method fires the {@link #resize} event.
     * @param {Number} width The new width to setThis may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new width in the {@link #getEl Element}'s {@link Ext.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS width style.</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setWidth : function(width) {
        return this.setSize(width);
    },

    /**
     * Sets the height of the component.  This method fires the {@link #resize} event.
     * @param {Number} height The new height to set. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new height in the {@link #getEl Element}'s {@link Ext.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS height style.</li>
     * <li><i>undefined</i> to leave the height unchanged.</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setHeight : function(height) {
        return this.setSize(undefined, height);
    },

    /**
     * Gets the current size of the component's underlying element.
     * @return {Object} An object containing the element's size {width: (element width), height: (element height)}
     */
    getSize : function() {
        return this.el.getSize();
    },

    /**
     * Gets the current width of the component's underlying element.
     * @return {Number}
     */
    getWidth : function() {
        return this.el.getWidth();
    },

    /**
     * Gets the current height of the component's underlying element.
     * @return {Number}
     */
    getHeight : function() {
        return this.el.getHeight();
    },

    /**
    /**
		 * コンポーネントの幅を設定します。このメソッドは{@link #resize}イベント発行します。
     * @param {Number} width コンポーネントの幅として設定する値。この引数は以下のいずれかが指定できます：<div class="mdetail-params"><ul>
    * <li>このコンポーネントの{@link #getEl トップレベル要素}の{@link Ext.Element#defaultUnit}メソッド指定された単位の数値（デフォルトはピクセル）。</li>
     * <li>CSSでwidthを設定する際に利用可能な文字列</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setWidth : function(width) {
        return this.setSize(width);
    },

    /**
		 * コンポーネントの高さを設定します。このメソッドは{@link #resize}イベント発行します。
     * @param {Number} height コンポーネントの高さとして設定する値。この引数は以下のいずれかが指定できます：<div class="mdetail-params"><ul>
    * <li>このコンポーネントの{@link #getEl トップレベル要素}の{@link Ext.Element#defaultUnit}メソッド指定された単位の数値（デフォルトはピクセル）。</li>
     * <li>CSSでheightを設定する際に利用可能な文字列</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setHeight : function(height) {
        return this.setSize(undefined, height);
    },

    /**
		 * コンポーネントのトップレベル要素のサイズを取得します。
     * @return {Object} コンポーネントのサイズを表すオブジェクト（{width: (要素の幅), height: (要素の高さ)}）
     */
    getSize : function() {
        return this.el.getSize();
    },

    /**
		 * コンポーネントのトップレベル要素の幅を取得します。
     * @return {Number}
     */
    getWidth : function() {
        return this.el.getWidth();
    },

    /**
		 * コンポーネントのトップレベル要素の高さを取得します。
     * @return {Number}
     */
    getHeight : function() {
        return this.el.getHeight();
    },

    /**
		 * このコンポーネントに重なるようにLoadMaskwo表示します。
     * @param {Boolean/Object} load trueを渡すことでデフォルトのLoadMaskを表示。LoadMaskを生成するためのコンフィグ
		 * オプションを指定することも可能です。falseを渡すことでLoadMaskを消します。
     * @param {Boolean} targetEl trueを渡すことで、このコンポーネントのトップレベル要素（this.el）ではなく、targetElを
		 * マスクします。例えば、この引数をtrueにした場合、Panelではbody部分のみがマスクされます（デフォルト値はfalse）。
     * @return {Ext.LoadMask} 表示されたLoadMaskのインスタンを返します。
     */    
    setLoading : function(load, targetEl) {
        if (this.rendered) {
            if (load) {
                this.loadMask = this.loadMask || new Ext.LoadMask(targetEl ? this.getTargetEl() : this.el, Ext.applyIf(Ext.isObject(load) ? load : {}));
                this.loadMask.show();
            }
            else {
								Ext.destroy(this.loadMask);
                this.loadMask = null;
            }
        }
        
        return this.loadMask;
    },

    /**
		 * このコンポーネントのドック位置を設定します。このメソッドは、このコンポーネントが
		 * DockLayoutを持つコンポーネントのdockedItemsの中にある場合にのみ有効となります（
		 * PanelとそのサブクラスはDockLayoutを持っています）。
     * @return {Component} this
     */
    setDocked : function(dock, layoutParent) {
        this.dock = dock;
        if (layoutParent && this.ownerCt && this.rendered) {
            this.ownerCt.doComponentLayout();
        }
        return this;
    },

    onDestroy : function() {
        if (this.monitorResize && Ext.EventManager.resizeEvent) {
            Ext.EventManager.resizeEvent.removeListener(this.setSize, this);
        }
        Ext.destroy(this.componentLayout, this.loadMask);
    },

    /**
		 * コンポーネント破壊します。
     */
    destroy : function() {
        if (!this.isDestroyed) {
            if (this.fireEvent('beforedestroy', this) !== false) {
                this.destroying = true;
                this.beforeDestroy();

                if (this.ownerCt && this.ownerCt.remove) {
                    this.ownerCt.remove(this, false);
                }

                if (this.rendered) {
                    this.el.remove();
                }

                this.onDestroy();

                Ext.ComponentMgr.unregister(this);
                this.fireEvent('destroy', this);

                this.clearListeners();
                this.destroying = false;
                this.isDestroyed = true;
            }
        }
    }
});

Ext.lib.Component.prototype.on = Ext.lib.Component.prototype.addListener;
Ext.lib.Component.prototype.prev = Ext.lib.Component.prototype.previousSibling;
Ext.lib.Component.prototype.next = Ext.lib.Component.prototype.nextSibling;

// @private
Ext.lib.Component.AUTO_ID = 1000;

// Declare here so we can test
Ext.Component = Ext.extend(Ext.lib.Component, {});
Ext.reg('component', Ext.Component);
