/**
 * @class Ext.lib.Container
 * @extends Ext.Component
 * 共有コンテナクラス
 */
Ext.lib.Container = Ext.extend(Ext.Component, {
    /**
     * @cfg {String/Object} layout
     * <p><b>*重要</b>：コンテナ内に配置するコンポーネント（{@link items}）が正しいサイズで
		 * 正しい位置に配置されるためには、この<code>layout</code>オプションを介してレイアウト
		 * マネージャが設定されている必要があります。</p>
     * <br><p>{@link items}で指定されたコンポーネントのサイズ設定や配置は、コンテナに設定された
		 * レイアウトマネージャの責任であるため、開発者が意図した形に各コンポーネントをレイアウトす
		 * るためにはレイアウトマネージャが正しく設定されている必要があります。例えば：</p>
     * <p>{@link #layout}が明示的に設定されていない場合、ContainerやPanelといった汎用のコンテナ
		 * では{@link Ext.layout.AutoContainerLayout デフォルトのレイアウトマネージャ}が設定されます。
		 * ただし、このデフォルト設定では、itemsは単に順番にContainer内に描画されるだけです（サイズ
		 * 設定や配置は行われません）。</p>
     * <br><p><b><code>layout</code></b>はオブジェクトか文字列として指定できます：</p>
		 * <div><ul class="mdetail-params">
     * <li><u>オブジェクトとして指定</u></li>
     * <div><ul class="mdetail-params">
     * <li>利用例：</li>
     * <pre><code>
layout: {
    type: 'vbox',
    align: 'left'
}
       </code></pre>
     *
     * <li><code><b>type</b></code></li>
     * <br/><p>このコンテナに適用するレイアウトの種類を指定します。指定しない場合、デフォルト値として
     * {@link Ext.layout.ContainerLayout}が生成されます。</p>
     * <br/><p><code>type</code>に設定可能なレイアウト値は下記の通り：</p>
     * <div class="sub-desc"><ul class="mdetail-params">
     * <li><code><b>{@link Ext.layout.ContainerLayout auto}</b></code> &nbsp;&nbsp;&nbsp; <b>デフォルト</b></li>
     * <li><code><b>{@link Ext.layout.CardLayout card}</b></code></li>
     * <li><code><b>{@link Ext.layout.FitLayout fit}</b></code></li>
     * <li><code><b>{@link Ext.layout.HBoxLayout hbox}</b></code></li>
     * <li><code><b>{@link Ext.layout.VBoxLayout vbox}</b></code></li>
     * </ul></div>
     *
     * <li>レイアウト別のコンフィグオプション</li>
     * <br><p>レイアウト毎に設定可能なコンフィグオプションも同時に設定できます。
		 * 設定可能なオプションの詳細については<code>type</code>に対応するレイアウトクラスを参照して
		 * ください</p>
     *
     * </ul></div>
     *
     * <li><u>文字列として指定</u></li>
     * <div><ul class="mdetail-params">
     * <li>利用例：</li>
     * <pre><code>
layout: 'vbox'
       </code></pre>
     * <li><code><b>layout</b></code></li>
     * <br><p>このコンテナに適用するレイアウトの種類を指定します（指定可能な値については上記参照）。</p><br>
     * </ul></div></ul></div>
     */
     
    /**
     * @cfg {String/Number} activeItem
		 * コンテナが描画された際にレイアウトの中で最初に有効化されるコンポーネントをid（文字列）、またはコンポーネント
		 * の位置を表すインデックス（数字）で指定。例としては「activeItem: 'item-1'」または「activeItem: 0」（コンテナの
		 * itemsの中の最初のコンポーネントのインデックスが0）。activeItemはコンテナのitemsの中から同時に1つのコンポーネント
		 * のみ表示するレイアウトで有効です（例えば{@link Ext.layout.CardLayout}、{@link Ext.layout.FitLayout}など）。
		 * {@link Ext.layout.ContainerLayout#activeItem}も合わせて参照してください。
     */
    /**
     * @cfg {Object/Array} items
     * <pre><b>** 重要</b>: 必要に応じて<b>{@link #layout <code>layout</code>を指定}するようにしてください。 **</b></pre>
		 * <p>このコンテナに組み込むコンポーネント、またはコンポーネントの配列をしていします。例えば、</p>
     * <pre><code>
// コンポーネントを1つだけ組み込み
items: {...},
layout: 'fit',    // レイアウトの指定を忘れずに！

// 複数のコンポーネントを組み込み
items: [{...}, {...}],
layout: 'hbox', // レイアウトの指定を忘れずに！
       </code></pre>
     * <p>それぞれのitemは下記のいずれかの方法で指定可能です：</p>
     * <div><ul class="mdetail-params">
     * <li>{@link Ext.Component}を継承した任意のオブジェクト</li>
     * <li>インスタンス化されたオブジェクト</li>
     * <li>オブジェクトリテラル：</li>
     * <div><ul class="mdetail-params">
     * <li><code>{@link Ext.Component#xtype xtype}</code>が設定されている必要があります。</li>
     * <li>{@link Ext.Component#xtype}は生成したいコンポーネントのxtypeを{@link Ext.Component}に掲載されている
		 * 一覧等から探して設定します。</li>
     * <li><code>{@link Ext.Component#xtype xtype}</code>が明示的に指定されていない場合には、このコンテナの
     * {@link #defaultType}が設定されます。</li>
     * <li>コンポーネントのインスタンス化は遅延実行されます。これによりコンポーネントオブジェクトを生成する際の
		 * オーバーヘッドを避けることができます。</li>
     * </ul></div></ul></div>
     * <p><b>注意</b>：</p>
     * <div><ul class="mdetail-params">
     * <li>Sencha Touchでは遅延レンダリング処理を取り入れています。itemsに設定されたコンポーネントは、表示が必要
		 * になったタイミングで初めて描画されます。レイアウト処理はitemsが表示される際、または{@link #doLayout}メソッド
		 * が呼ばれた際に行われます（非表示の間はサイズ設定は行われません）。</li>
     * <li>itemsを指定する場合には<code>{@link Ext.Panel#contentEl contentEl}</code>や<code>{@link Ext.Panel#html html}</code>
		 * は指定しないでください（逆も同じ）</code>.</li>
     * </ul></div>
     */
    /**
     * @cfg {Object|Function} defaults
     * <p>このオプションはコンテナのitems内の全てのコンポーネントに適用するデフォルトプロパティを設定します。
		 * defaultsで指定した値は{@link #items}を介して組み込まれたコンポーネントだけでなく、{@link #add} および
		 * {@link #insert}メソッドで追加されたコンポーネントにも適用されます。</p>
		 * <p>追加されるコンポーネントがオブジェクトリテラル形式の場合（インスタンス化されたコンポーネントでは<b>ない</b>
		 * 場合）、defaultsで指定されたプロパティは無条件で全て適用されます。追加されるコンポーネントがインスタンス化
		 * されている場合には、そのインスタンスで設定済みのプロパティを上書きしないものだけが適用されます。</p>
     * <p>defaultsに関数が指定された場合、その関数は追加されるコンポーネントを第一引数としてして受け取り、このコンテナの
		 * スコープ内で実行され（コンテナを<code>this</code>として実行され）ます。この関数の実行結果（オブジェクト）が
		 * そのまま追加対象のオブジェクトにデフォルトプロパティとして適用されます。</p>
     * <p>例えば、itemsで追加される{@link Ext.Panel}のbodyに対して自動的にパディングを適用したい場合は：<code>defaults: 
		 * {bodyStyle:'padding:15px'}</code>となります。</p>
     * <p>利用方法:</p><pre><code>
defaults: {               // defaultsはコンテナではなくitems内のコンポーネント対して適用されます。
    autoScroll:true
},
items: [
    {
        xtype: 'panel',   // defaultsで指定したプロパティがコンフィグオブジェクトでも指定され
        id: 'panel1',     // いる場合は、コンフィグオブジェクトの値が優先されます。
        autoScroll: false // 従って、ここでは autoScroll:false となります。
    },
    new Ext.Panel({       // defaultsで指定したプロパティがインスタンス化されたコンポーネントの場合は
        id: 'panel2',     // defaultsの値が優先されます。
        autoScroll: false // 従って、ここでは autoScroll:true となります。
    })
]
       </code></pre>
     */


    /** @cfg {Boolean} autoDestroy
		 * trueを設定すると、コンテナから削除されたコンポーネントは自動的に破壊されます。falseの場合は削除した
		 * コンポーネントの破壊処理を実装する必要があります（デフォルト値はtrue）。
     */
    autoDestroy : true,

     /** @cfg {String} defaultType
			* <p>itemsに追加するコンポーネントがコンフィグオブジェクトで指定されていて、かつxtypeが明示されていない
			* 場合に適用するデフォルトの{@link Ext.Component xtype}です。</p>
			* <p>デフォルト値は'panel'です。</p>
      */
    defaultType: 'panel',

    isContainer : true,

    baseCls: 'x-container',

    /**
     * @cfg {Array} bubbleEvents
		 * <p>バブルアップする対象となるイベント名を配列で指定します。
     * {@link Ext.util.Observable#enableBubble}も参照してください。
     * デフォルト値は<code>['add', 'remove']</code>。</p>
     */
    bubbleEvents: ['add', 'remove'],

    // @private
    initComponent : function(){
        this.addEvents(
            /**
             * @event afterlayout
						 * イベント終了後に発生します。
             * Fires when the components in this container are arranged by the associated layout manager.
             * @param {Ext.Container} this
             * @param {ContainerLayout} layout The ContainerLayout implementation for this container
             */
            'afterlayout',
            /**
             * @event beforeadd
             * Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being added
             * @param {Number} index The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was added
             * @param {Number} index The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was removed
             */
            'remove',
            /**
             * @event beforecardswitch
             * Fires before this container switches the active card. This event
             * is only available if this container uses a CardLayout. Note that
             * TabPanel and Carousel both get a CardLayout by default, so both
             * will have this event.
             * A handler can return false to cancel the card switch.
             * @param {Ext.Container} this
             * @param {Ext.Component} newCard The card that will be switched to
             * @param {Ext.Component} oldCard The card that will be switched from
             * @param {Number} index The index of the card that will be switched to
             * @param {Boolean} animated True if this cardswitch will be animated
             */
            'beforecardswitch',
            /**
             * @event cardswitch
             * Fires after this container switches the active card. If the card
             * is switched using an animation, this event will fire after the
             * animation has finished. This event is only available if this container
             * uses a CardLayout. Note that TabPanel and Carousel both get a CardLayout
             * by default, so both will have this event.
             * @param {Ext.Container} this
             * @param {Ext.Component} newCard The card that has been switched to
             * @param {Ext.Component} oldCard The card that has been switched from
             * @param {Number} index The index of the card that has been switched to
             * @param {Boolean} animated True if this cardswitch was animated
             */
            'cardswitch'
        );

        // layoutOnShow stack
        this.layoutOnShow = new Ext.util.MixedCollection();
        Ext.lib.Container.superclass.initComponent.call(this);
        this.initItems();
    },

    // @private
    initItems : function() {
        var items = this.items;
        
        /**
         * The MixedCollection containing all the child items of this container.
         * @property items
         * @type Ext.util.MixedCollection
         */
        this.items = new Ext.util.MixedCollection(false, this.getComponentId);

        if (items) {
            if (!Ext.isArray(items)) {
                items = [items];
            }

            this.add(items);
        }
    },

    // @private
    afterRender : function() {
        this.getLayout();
        Ext.lib.Container.superclass.afterRender.apply(this, arguments);
    },

    // @private
    setLayout : function(layout) {
        var currentLayout = this.layout;
        
        if (currentLayout && currentLayout.isLayout && currentLayout != layout) {
            currentLayout.setOwner(null);
        }
        
        this.layout = layout;
        layout.setOwner(this);
    },

    /**
     * Returns the {@link Ext.layout.ContainerLayout layout} instance currently associated with this Container.
     * If a layout has not been instantiated yet, that is done first
     * @return {Ext.layout.ContainerLayout} The layout
     */
    getLayout : function() {
        if (!this.layout || !this.layout.isLayout) {
            this.setLayout(Ext.layout.LayoutManager.create(this.layout, 'autocontainer'));
        }
        
        return this.layout;
    },

    /**
     * Force this container's layout to be recalculated. A call to this function is required after adding a new component
     * to an already rendered container, or possibly after changing sizing/position properties of child components.
     * @return {Ext.Container} this
     */
    doLayout : function() {
        var layout = this.getLayout();
        
        if (this.rendered && layout) {
            layout.layout();
        }
        
        return this;
    },

    // @private
    afterLayout : function(layout) {
        this.fireEvent('afterlayout', this, layout);
    },

    // @private
    prepareItems : function(items, applyDefaults) {
        if (!Ext.isArray(items)) {
            items = [items];
        }
        
        // Make sure defaults are applied and item is initialized
        var item, i, ln;
        
        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            
            if (applyDefaults) {
                item = this.applyDefaults(item);
            }
            
            items[i] = this.lookupComponent(item);
        }
        
        return items;
    },

    // @private
    applyDefaults : function(config) {
        var defaults = this.defaults;
        
        if (defaults) {
            if (Ext.isFunction(defaults)) {
                defaults = defaults.call(this, config);
            }
            
            if (Ext.isString(config)) {
                config = Ext.ComponentMgr.get(config);
                Ext.apply(config, defaults);
            } else if (!config.isComponent) {
                Ext.applyIf(config, defaults);
            } else {
                Ext.apply(config, defaults);
            }
        }
        
        return config;
    },

    // @private
    lookupComponent : function(comp) {
        if (Ext.isString(comp)) {
            return Ext.ComponentMgr.get(comp);
        } else {
            return this.createComponent(comp);
        }
        return comp;
    },

    // @private
    createComponent : function(config, defaultType) {
        if (config.isComponent) {
            return config;
        }

        // // add in ownerCt at creation time but then immediately
        // // remove so that onBeforeAdd can handle it
        // var component = Ext.create(Ext.apply({ownerCt: this}, config), defaultType || this.defaultType);
        //
        // delete component.initialConfig.ownerCt;
        // delete component.ownerCt;

        return Ext.create(config, defaultType || this.defaultType);
    },

    // @private - used as the key lookup function for the items collection
    getComponentId : function(comp) {
        return comp.getItemId();
    },

    /**
     * <p>Adds {@link Ext.Component Component}(s) to this Container.</p>
     * <br><p><b>Description</b></u> :
     * <div><ul class="mdetail-params">
     * <li>Fires the {@link #beforeadd} event before adding</li>
     * <li>The Container's {@link #defaults default config values} will be applied
     * accordingly (see <code>{@link #defaults}</code> for details).</li>
     * <li>Fires the {@link #add} event after the component has been added.</li>
     * </ul></div>
     * <br><p><b>Notes</b></u> :
     * <div><ul class="mdetail-params">
     * <li>If the Container is <i>already rendered</i> when <code>add</code>
     * is called, you may need to call {@link #doLayout} to refresh the view which causes
     * any unrendered child Components to be rendered. This is required so that you can
     * <code>add</code> multiple child components if needed while only refreshing the layout
     * once. For example:<pre><code>
var tb = new {@link Ext.Toolbar}();
tb.render(document.body);  // toolbar is rendered
tb.add({text:'Button 1'}); // add multiple items ({@link #defaultType} for {@link Ext.Toolbar Toolbar} is 'button')
tb.add({text:'Button 2'});
tb.{@link #doLayout}();             // refresh the layout
     * </code></pre></li>
     * <li><i>Warning:</i> Containers directly managed by the BorderLayout layout manager
     * may not be removed or added.  See the Notes for {@link Ext.layout.BorderLayout BorderLayout}
     * for more details.</li>
     * </ul></div>
     * @param {...Object/Array} component
     * <p>Either one or more Components to add or an Array of Components to add.  See
     * <code>{@link #items}</code> for additional information.</p>
     * @return {Ext.Component/Array} The Components that were added.
     */
    add : function() {
        var args = Array.prototype.slice.call(arguments),
            index = -1;

        if (typeof args[0] == 'number') {
            index = args.shift();
        }

        var hasMultipleArgs = args.length > 1;
        
        if (hasMultipleArgs || Ext.isArray(args[0])) {
            var items = hasMultipleArgs ? args : args[0],
                results = [],
                i, ln, item;

            for (i = 0, ln = items.length; i < ln; i++) {
                item = items[i];
                if (!item) {
                    throw "Trying to add a null item as a child of Container with itemId/id: " + this.getItemId();
                }
                
                if (index != -1) {
                    item = this.add(index + i, item);
                } else {
                    item = this.add(item);
                }
                results.push(item);
            }

            return results;
        }

        var cmp = this.prepareItems(args[0], true)[0];
        index = (index !== -1) ? index : this.items.length;

        if (this.fireEvent('beforeadd', this, cmp, index) !== false && this.onBeforeAdd(cmp) !== false) {
            this.items.insert(index, cmp);
            cmp.onAdded(this, index);
            this.onAdd(cmp, index);
            this.fireEvent('add', this, cmp, index);
        }

        return cmp;
    },

    onAdd : Ext.emptyFn,
    onRemove : Ext.emptyFn,

    /**
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add} event after the
     * Component has been inserted.
     * @param {Number} index The index at which the Component will be inserted
     * into the Container's items collection
     * @param {Ext.Component} component The child Component to insert.<br><br>
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.<br><br>
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this 'lazy instantiation', set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @return {Ext.Component} component The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp){
        return this.add(index, comp);
    },

    // @private
    onBeforeAdd : function(item) {
        if (item.ownerCt) {
            item.ownerCt.remove(item, false);
        }
        
        if (this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    /**
     * Removes a component from this container.  Fires the {@link #beforeremove} event before removing, then fires
     * the {@link #remove} event after the component has been removed.
     * @param {Component/String} component The component reference or id to remove.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component} component The Component that was removed.
     */
    remove : function(comp, autoDestroy) {
        var c = this.getComponent(comp);
        //<debug>
			if (!c) {
            	console.warn("Attempted to remove a component that does not exist. Ext.Container: remove takes an argument of the component to remove. cmp.remove() is incorrect usage.");				
			}
        //</debug>
        
        if (c && this.fireEvent('beforeremove', this, c) !== false) {
            this.doRemove(c, autoDestroy);
            this.fireEvent('remove', this, c);
        }
        
        return c;
    },

    // @private
    doRemove : function(component, autoDestroy) {
        var layout = this.layout,
            hasLayout = layout && this.rendered;

        this.items.remove(component);
        component.onRemoved();
        
        if (hasLayout) {
            layout.onRemove(component);
        }
        
        this.onRemove(component, autoDestroy);

        if (autoDestroy === true || (autoDestroy !== false && this.autoDestroy)) {
            component.destroy();
        }

        if (hasLayout && !autoDestroy) {
            layout.afterRemove(component);
        }
    },

    /**
     * Removes all components from this container.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Array} Array of the destroyed components
     */
    removeAll : function(autoDestroy) {
        var item,
            removeItems = this.items.items.slice(),
            items = [],
            ln = removeItems.length,
            i;
        
        for (i = 0; i < ln; i++) {
            item = removeItems[i];
            this.remove(item, autoDestroy);
            
            if (item.ownerCt !== this) {
                items.push(item);
            }
        }
        
        return items;
    },

    // Used by ComponentQuery to retrieve all of the items
    // which can potentially be considered a child of this Container.
    // This should be overriden by components which have child items
    // that are not contained in items. For example dockedItems, menu, etc
    getRefItems : function(deep) {
        var items = this.items.items.slice(),
            ln = items.length,
            i, item;

        if (deep) {
            for (i = 0; i < ln; i++) {
                item = items[i];
                
                if (item.getRefItems) {
                    items = items.concat(item.getRefItems(true));
                }
            }
        }

        return items;
    },

    /**
     * Examines this container's <code>{@link #items}</code> <b>property</b>
     * and gets a direct child component of this container.
     * @param {String/Number} comp This parameter may be any of the following:
     * <div><ul class="mdetail-params">
     * <li>a <b><code>String</code></b> : representing the <code>{@link Ext.Component#itemId itemId}</code>
     * or <code>{@link Ext.Component#id id}</code> of the child component </li>
     * <li>a <b><code>Number</code></b> : representing the position of the child component
     * within the <code>{@link #items}</code> <b>property</b></li>
     * </ul></div>
     * <p>For additional information see {@link Ext.util.MixedCollection#get}.
     * @return Ext.Component The component (if found).
     */
    getComponent : function(comp) {
        if (Ext.isObject(comp)) {
            comp = comp.getItemId();
        }
        
        return this.items.get(comp);
    },

    /**
     * Retrieves all descendant components which match the passed selector.
     * Executes an Ext.ComponentQuery.query using this container as its root.
     * @param {String} selector Selector complying to an Ext.ComponentQuery selector
     * @return {Array} Ext.Component's which matched the selector
     */
    query : function(selector) {
        return Ext.ComponentQuery.query(selector, this);
    },

    /**
     * Retrieves the first direct child of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} selector An Ext.ComponentQuery selector
     * @return Ext.Component
     */
    child : function(selector) {
        return this.query('> ' + selector)[0] || null;
    },
    
    
    /**
     * Retrieves the first descendant of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} selector An Ext.ComponentQuery selector
     * @return Ext.Component
     */
    down : function(selector) {
        return this.query(selector)[0] || null;
    },

    // inherit docs
    show : function() {
        Ext.lib.Container.superclass.show.apply(this, arguments);
        
        var layoutCollection = this.layoutOnShow,
            ln = layoutCollection.getCount(),
            i = 0,
            needsLayout,
            item;
            
        for (; i < ln; i++) {
            item = layoutCollection.get(i);
            needsLayout = item.needsLayout;
            
            if (Ext.isObject(needsLayout)) {
                item.doComponentLayout(needsLayout.width, needsLayout.height, needsLayout.isSetSize);
            }
        }
        
        layoutCollection.clear();
    },

    // @private
    beforeDestroy : function() {
        var items = this.items,
            c;
            
        if (items) {
            while ((c = items.first())) {
                this.doRemove(c, true);
            }
        }
        
        Ext.destroy(this.layout);
        Ext.lib.Container.superclass.beforeDestroy.call(this);
    }
});

// Declare here so we can test
Ext.Container = Ext.extend(Ext.lib.Container, {});
Ext.reg('container', Ext.Container);
