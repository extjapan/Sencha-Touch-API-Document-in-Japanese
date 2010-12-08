/**
 * @class Ext.Component
 * @extends Ext.lib.Component
 * <p>全てのExtコンポーネントの親となるクラスです。Componentクラスを継承するクラス（以下、コンポーネント）は、
 * {@link Ext.Container Container}によって提供される自動化されたコンポーネントライフサイクル（生成、描画、破壊）に
 * 組み込まれます。コンポーネントはContainerの生成時の{@link Ext.Container#items items}オプションを介してContainer
 * に組み込みます。あるいは、Containerの{@link Ext.Container#add add}メソッドを使って動的に組み込むこともできます。</p>
 * <p>Componentクラスには「表示/非表示」および「利用可/不可」をサポートするための基本的な機能が実装されています</p>
 * <p>全てのコンポーネントはその生成時に{@link Ext.ComponentMgr}に登録され、プログラムのどこからでもその{@link #id}を
 * {@link Ext#getCmp}メソッドに渡すことで取得することができます。</p>
 * <p>独自のUI部品を開発する際、自動化されたコンポーネントサイクルやサイズ管理が必要なものについては、Component（あるいは
 * そのサブクラス）を継承するようにしてください。</p>
 * <p>独自のUI部品の開発にあたって、Sencha Touchが提供するクラスを継承するのか、それとも改造するのか、その他の詳細について
 * は「<a href="http://www.sencha.com/learn/Tutorial:Creating_new_UI_controls">Creating new UI controls</a>」（英語）を
 * 参照してください。</p>
 * <p>全てのコンポーネントには、それを特定するためのxtypeというものが設定されています。また、xtypeを調べるための
 * {@link #getXType}や{@link #isXType}といったメソッドも用意されています。予め定義されているxtypeは以下の通りです：</p>
 * <h2>便利なプロパティ</h2>
 * <ul class="list">
 *   <li>{@link #fullscreen}</li>
 * </ul>
 * <pre>
xtype            クラス
-------------    ------------------
button           {@link Ext.Button}
component        {@link Ext.Component}
container        {@link Ext.Container}
dataview         {@link Ext.DataView}
panel            {@link Ext.Panel}
slider           {@link Ext.form.Slider}
toolbar          {@link Ext.Toolbar}
spacer           {@link Ext.Spacer}
tabpanel         {@link Ext.TabPanel}

フォームコンポーネント
---------------------------------------
formpanel        {@link Ext.form.FormPanel}
checkboxfield    {@link Ext.form.Checkbox}
selectfield      {@link Ext.form.Select}
field            {@link Ext.form.Field}
fieldset         {@link Ext.form.FieldSet}
hiddenfield      {@link Ext.form.Hidden}
numberfield      {@link Ext.form.Number}
radiofield       {@link Ext.form.Radio}
textareafield    {@link Ext.form.TextArea}
textfield        {@link Ext.form.Text}
togglefield      {@link Ext.form.Toggle}
</pre>
 * @constructor
 * @param {Ext.Element/String/Object} config コンフィグオプションには以下のいずれかが指定できます：
 * <div class="mdetail-params"><ul>
 * <li><b>Element</b> :
 * <p class="sub-desc">渡されたElementは内部要素として取り込まれ、Elementのidがコンポーネントのidとして設定されます。</p></li>
 * <li><b>文字列</b> :
 * <p class="sub-desc">生成済みのElementのidとして解釈され、同時にコンポーネントのidとして設定されます。</p></li>
 * <li><b>その他</b> :
 * <p class="sub-desc">コンフィグオブジェクトとして解釈され、オブジェクトのプロパティと値がコンポーネントにコピーされます。</p></li>
 * </ul></div>
 * @xtype component
 */
Ext.Component = Ext.extend(Ext.lib.Component, {
    /**
    * @cfg {Object/String/Boolean} showAnimation
		* このコンポーネントを表示する際に利用するアニメーションの種類を指定します。このオプションを
		* 設定すると、非表示にする場合のアニメーションは、ここで設定したものが反転したものに自動的に
		* 設定されます。
    */
    showAnimation: null,

    /**
     * @cfg {Boolean} monitorOrientation
		 * 画面の回転を監視します。
     */
    monitorOrientation: false,

    /**
     * @cfg {Boolean} floatingCls
		 * このコンポーネントがフロート状態の場合に追加されるCSSクラスを指定します（デフォルト値は
		 * x-floating）。
     */
    floatingCls: 'x-floating',

    /**
    * @cfg {Boolean} hideOnMaskTap
		* trueを設定すると、このコンポーネントがモーダル状態で表示されている際、同時に表示されている
		* マスクをタップすることで自動的にコンポーネントが非表示になります。デフォルト値はtrue。
		* 注意：falseに設定した場合には、このコンポーネントを隠す処理を別途記述する必要があります。
    */
    hideOnMaskTap: true,
    
    /**
    * @cfg {Boolean} stopMaskTapEvent
		* trueを設定すると、このコンポーネントががモーダル状態で表示されている際、同時に表示されている
		* マスクをタップすることで発行されるイベントを止めることができます。デフォルト値はtrue。
    */    
    stopMaskTapEvent: true,

    /**
     * @cfg {Boolean} centered
		 * コンポーネントを中心に配置します。デフォルトはfalse。
     */
    centered: false,

    /**
     * @cfg {Boolean} modal
		 * trueを設定すると、このコンポーネントがされた際にモーダル状態（その他の全ての部品にマスクをかけて、
		 * このコンポーネントを最上位に表示）にします。falseにすると、その他のUI部品へのアクセスが制限されません。
		 * デフォルト値はfalse。
     */
    modal: false,

    /**
     * @cfg {Mixed} scroll
		 * コンポーネントをスクロール可能なように設定します。設定可能な値は：
     * <ul>
     * <li>'horizontal'（横方向）、'vertical'（縦方向）、'both'（両方向）のいずれかを設定することで設定した方向にスクロール可能となります</li>
     * <li>{@link Ext.util.Scroller Scroller}クラスのコンフィグオプション</li>
     * <li>falseを渡すことで明示的にスクロールを不可に設定できます</li>
     * </ul>
     *
		 * スクロールを可能にするとmonitorOrieantaionオプションは自動的にtrueに設定されます（{@link Ext.Panel Panel}クラス）
     */
     
     /**
      * @cfg {Boolean} fullscreen
			* 画面の全ての幅と高さをこのコンポーネントで占有します。デフォルト値はfalse。
			* このオプションをtrueに設定するとmonitorOrientationも自動的にtrueになります。
			* また、このオプションtrueに設定すると、コンポーネントは即時に描画されます。
      */
    fullscreen: false,

    /**
     * @cfg {Boolean} layoutOnOrientationChange
		 * このオプションをtrueに設定することで、端末の向きが変わった際に自動的に再レイアウトを行います。
		 * コンポーネントがfloatingの場合は明示的にfalseに設定しない限り、このオプションのデフォルト値は
		 * trueです。また、コンポーネントがfullscreen設定されたコンテナに内包されている場合は、このオプ
		 * ションを設定する必要はありません。fullscreenのコンポーネントは端末の向きの変化に合わせて
		 * 自動的に再レイアウトされるようになっています。
     * デフォルト値は<code>null</code>
     */
    layoutOnOrientationChange: null,
    
    // @private
    initComponent : function() {
        this.addEvents(
            /**
             * @event beforeorientationchange
						 * monitorOrienationがtrueに設定されていると、画面の回転に伴いこのコンポーネントが回転する前に
						 * このイベントが発行されます。イベントリスナーがfalseを返すことでコンポーネントの回転を中止
						 * することができます。
             * @param {Ext.Panel} this
             * @param {String} orientation 'landscape'または'portrait'
             * @param {Number} width
             * @param {Number} height
             */
            'beforeorientationchange',
            /**
             * @event orientationchange
						 * monotorOrientationがtrueに設定されていると、画面の回転に伴いこのコンポーネントが回転した後に発行されます。
             * @param {Ext.Panel} this
             * @param {String} orientation 'landscape'または'portrait'
             * @param {Number} width
             * @param {Number} height
             */
            'orientationchange'
        );

        if (this.fullscreen || this.floating) {
            this.monitorOrientation = true;
            this.autoRender = true;
        }

        if (this.fullscreen) {
            var viewportSize = Ext.Viewport.getSize();
            this.width = viewportSize.width;
            this.height = viewportSize.height;
            this.cls = (this.cls || '') + ' x-fullscreen';
            this.renderTo = document.body;
        }
    },

    onRender : function() {
        Ext.Component.superclass.onRender.apply(this, arguments);

        if (this.monitorOrientation) {
            this.el.addCls('x-' + Ext.Viewport.orientation);
        }

        if (this.floating) {
            this.setFloating(true);
        }

        if (this.draggable) {
            this.setDraggable(this.draggable);
        }

        if (this.scroll) {
            this.setScrollable(this.scroll);
        }
    },

    afterRender : function() {
        if (this.fullscreen) {
            this.layoutOrientation(Ext.Viewport.orientation, this.width, this.height);
        }
        Ext.Component.superclass.afterRender.call(this);
    },

    initEvents : function() {
        Ext.Component.superclass.initEvents.call(this);

        if (this.monitorOrientation) {
            Ext.EventManager.onOrientationChange(this.setOrientation, this);
        }
    },

    // Template method that can be overriden to perform logic after the panel has layed out itself
    // e.g. Resized the body and positioned all docked items.
    afterComponentLayout : function() {
        var scrollEl = this.scrollEl,
            scroller = this.scroller,
            parentEl;

        if (scrollEl) {
            parentEl = scrollEl.parent();

            if (scroller.horizontal) {
                scrollEl.setStyle('min-width', parentEl.getWidth(true) + 'px');
                scrollEl.setHeight(parentEl.getHeight(true) || null);
            }
            if (scroller.vertical) {
                scrollEl.setStyle('min-height', parentEl.getHeight(true) + 'px');
                scrollEl.setWidth(parentEl.getWidth(true) || null);
            }
            scroller.updateBoundary(true);
        }

        if (this.fullscreen && Ext.is.iPad) {
            Ext.repaint();
        }
    },

    layoutOrientation: Ext.emptyFn,

    // Inherit docs
    update: function(){
        // We override this here so we can call updateBoundary once the update happens.
        Ext.Component.superclass.update.apply(this, arguments);
        var scroller = this.scroller;
        if (scroller && scroller.updateBoundary){
            scroller.updateBoundary(true);
        }
    },

    /**
     * コンポーネントを表示します。
     * @param {Object/String/Boolean} animation オプション。デフォルト値はfalse。
     */
    show : function(animation) {
        var rendered = this.rendered;
        if ((this.hidden || !rendered) && this.fireEvent('beforeshow', this) !== false) {
            if (this.anchorEl) {
                this.anchorEl.hide();
            }
            if (!rendered && this.autoRender) {
                this.render(Ext.isBoolean(this.autoRender) ? Ext.getBody() : this.autoRender);
            }
            this.hidden = false;
            if (this.rendered) {
                this.onShow(animation);
                this.fireEvent('show', this);
            }
        }
        return this;
    },

    /**
		 * コンポーネントは他のコンポーネントまたは要素の近くに表示します。表示位置は自動的に決定されます。
     * @param {Mixed} alignTo ElementまたはComponent
     * @param {Object/String/Boolean} animation
     * @param {Boolean} allowOnSide alignToで指定した対象の左右に配置を許可するかを指定
     * @param {Boolean} anchor trueを指定すると、アンカー要素を表示 
     * @returns {Ext.Component} this
     */
    showBy : function(alignTo, animation, allowSides, anchor) {
        if (!this.floating) {
            return this;
        }
        
        if (alignTo.isComponent) {
            alignTo = alignTo.el;
        }
        else {
            alignTo = Ext.get(alignTo);
        }

        this.x = 0;
        this.y = 0;

        this.show(animation);

        if (anchor !== false) {
            if (!this.anchorEl) {
                this.anchorEl = this.el.createChild({
                    cls: 'x-anchor'
                });
            }
            this.anchorEl.show();            
        }
        
        this.alignTo(alignTo, allowSides, 20);
    },
    
    alignTo : function(alignTo, allowSides, offset) {
        // We are going to try and position this component to the alignTo element.
        var alignBox = alignTo.getPageBox(),
            constrainBox = {
                width: window.innerWidth,
                height: window.innerHeight
            },
            size = this.getSize(),
            newSize = {
                width: Math.min(size.width, constrainBox.width),
                height: Math.min(size.height, constrainBox.height)
            },
            position,
            index = 2,
            positionMap = [
                'tl-bl',
                't-b',
                'tr-br',
                'l-r',
                'l-r',
                'r-l',
                'bl-tl',
                'b-t',
                'br-tr'
            ],
            anchorEl = this.anchorEl,
            offsets = [0, offset],
            targetBox, cls,
            onSides = false,
            arrowOffsets = [0, 0],
            alignCenterX = alignBox.left + (alignBox.width / 2),
            alignCenterY = alignBox.top + (alignBox.height / 2);

        if (alignCenterX <= constrainBox.width * (1/3)) {
            index = 1;
            arrowOffsets[0] = 25;
        }
        else if (alignCenterX >= constrainBox.width * (2/3)) {
            index = 3;
            arrowOffsets[0] = -30;
        }
        
        if (alignCenterY >= constrainBox.height * (2/3)) {
            index += 6;
            offsets = [0, -offset];
            arrowOffsets[1] = -10;
        }
        // If the alignTo element is vertically in the middle part of the screen
        // we position it left or right.
        else if (allowSides !== false && alignCenterY >= constrainBox.height * (1/3)) {
            index += 3;
            offsets = (index <= 5) ? [offset, 0] : [-offset, 0];
            arrowOffsets = (index <= 5) ? [10, 0] : [-10, 0];
            onSides = true;
        }
        else {
            arrowOffsets[1] = 10;
        }
        
        position = positionMap[index-1];
        targetBox = this.el.getAlignToXY(alignTo, position, offsets);

        // If the window is going to be aligned on the left or right of the alignTo element
        // we make sure the height is smaller then the window height, and the width
        if (onSides) {
            if (targetBox[0] < 0) {
                newSize.width = alignBox.left - offset;
            }
            else if (targetBox[0] + newSize.width > constrainBox.width) {
                newSize.width = constrainBox.width - alignBox.right - offset;
            }
        }
        else {
            if (targetBox[1] < 0) {
                newSize.height = alignBox.top - offset;
            }
            else if (targetBox[1] + newSize.height > constrainBox.height) {
                newSize.height = constrainBox.height - alignBox.bottom - offset;
            }
        }
        
        if (newSize.width != size.width) {
            this.setSize(newSize.width);
        }
        else if (newSize.height != size.height) {
            this.setSize(undefined, newSize.height);
        }

        targetBox = this.el.getAlignToXY(alignTo, position, offsets);                
        this.setPosition(targetBox[0], targetBox[1]);
        
        if (anchorEl) {
            // we are at the top
            anchorEl.removeCls(['x-anchor-bottom', 'x-anchor-left', 'x-anchor-right', 'x-anchor-top']);
            if (offsets[1] == offset) {
                cls = 'x-anchor-top';
            }
            else if (offsets[1] == -offset) {
                cls = 'x-anchor-bottom';
            }
            else if (offsets[0] == offset) {
                cls = 'x-anchor-left';
            }
            else {
                cls = 'x-anchor-right';
            }
            targetBox = anchorEl.getAlignToXY(alignTo, position, arrowOffsets);
            anchorEl.setXY(targetBox);
            anchorEl.addCls(cls);
        }
        
        return position;
    },

    /**
		 * このコンポーネントをそのコンテナあるいはウィンドウの中心に配置します。
		 * このメソッドはコンポーネントがフロート状態のときのみ有効です。
     * @param {Boolean} centered trueで中心に配置、falseで中心配置を解除
     * @param {Boolean} update trueを設定することで、コンポーネントをすぐに中心に配置 
     * @returns {Ext.Component} this
     */
    setCentered : function(centered, update) {
        this.centered = centered;

        if (this.rendered && update) {
            var x, y;
            if (!this.ownerCt) {
                x = (Ext.Element.getViewportWidth() / 2) - (this.getWidth() / 2);
                y = (Ext.Element.getViewportHeight() / 2) - (this.getHeight() / 2);
            }
            else {
                x = (this.ownerCt.getTargetEl().getWidth() / 2) - (this.getWidth() / 2);
                y = (this.ownerCt.getTargetEl().getHeight() / 2) - (this.getHeight() / 2);
            }
            this.setPosition(x, y);
        }

        return this;
    },

    /**
		 * コンポーネントを非表示にします。
     * @param {Object/String/Boolean} animation オプション。デフォルト値はfalse。
     */
    hide : function(animation) {
        if (!this.hidden && this.fireEvent('beforehide', this) !== false) {
            this.hidden = true;
            if (this.rendered) {
                this.onHide(animation, true);
            }
        }
        return this;
    },

    // @private
    onShow : function(animation) {
        this.el.show();
        
        Ext.Component.superclass.onShow.call(this, animation);
        
        if (animation === undefined || animation === true) {
            animation = this.showAnimation;
        }

        if (this.floating) {
            this.el.dom.parentNode || this.el.appendTo(document.body);

            if (animation) {
                this.el.setStyle('opacity', 0.01);
            }

            if (this.centered) {
                this.setCentered(true, true);
            }
            else {
                this.setPosition(this.x, this.y);
            }

            if (this.modal) {
                this.el.parent().mask(null, 'x-mask-gray');
            }

            if (this.hideOnMaskTap) {
                Ext.getDoc().on('touchstart', this.onFloatingTouchStart, this, {capture: true, subsequent: true});
            }
        }
        
        if (animation) {
            //this.el.setStyle('opacity', 0.01);

            Ext.Anim.run(this, animation, {
                out: false,
                autoClear: true
            });

            this.showAnimation = animation;
        }
    },

    // @private
    onFloatingTouchStart: function(e) {
        if (!this.el.contains(e.target)) {
            this.hide();
            if (this.stopMaskTapEvent || Ext.fly(e.target).hasCls('x-mask')) {
                e.stopEvent();
            }
        }
    },

    // @private
    onHide : function(animation, fireHideEvent) {
        if (animation === undefined || animation === true) {
            animation = this.showAnimation;
        }

        if (this.hideOnMaskTap && this.floating) {
            Ext.getDoc().un('touchstart', this.onFloatingTouchStart, this, {capture: true, subsequent: true});
        }

        if (animation) {
            Ext.Anim.run(this, animation, {
                out: true,
                reverse: true,
                autoClear: true,
                scope: this,
                fireHideEvent: fireHideEvent,
                after: this.doHide
            });
        } else {
            this.doHide(null, {fireHideEvent: fireHideEvent});
        }
    },

    // private
    doHide : function(el, options) {
        var parent = this.el.parent();

        this.el.hide();
        
        if (parent && this.floating && this.modal) {
            parent.unmask();
        }
        if (options && options.fireHideEvent) {
            this.fireEvent('hide', this);
        }
    },

    /**
		 * このコンポーネントをスクロール可能にします。
     * @param {Mixed} config
		 * 指定可能な値は、Ext.Scrollerのコンフィグオプション、'horizontal'（横方向）、'vertical'（縦方向）、
		 * 'both'（両方向）、そしてfalseです。
     */
    setScrollable : function(config) {
        if (!this.rendered) {
            this.scroll = config;
            return;
        }

        Ext.destroy(this.scroller);
        this.scroller = null;
        
        if (config !== false) {
            var direction = Ext.isObject(config) ? config.direction: config;
            config = Ext.apply({},
            Ext.isObject(config) ? config: {}, {
//                momentum: true,
                direction: direction
            });

            if (!this.scrollEl) {
                this.scrollEl = this.getTargetEl().createChild();
                this.originalGetTargetEl = this.getTargetEl;
                this.getTargetEl = function() {
                    return this.scrollEl;
                };
            }

            this.scroller = (new Ext.util.ScrollView(this.scrollEl, config)).scroller;
        }
        else {
            this.getTargetEl = this.originalGetTargetEl;
        }
    },

    /**
		 * コンポーネントをフロート状態にします
     * @param {Boolean} floating
     * @param {Boolean} autoShow
     */
    setFloating : function(floating, autoShow) {
        this.floating = !!floating;
        this.hidden = true;
        if (this.rendered) {
            if (floating !== false) {
                this.el.addCls(this.floatingCls);
                if (autoShow) {
                    this.show();
                }
            }
            else {
                this.el.removeCls(this.floatingCls);
                Ext.getDoc().un('touchstart', this.onFloatingTouchStart, this);
            }
        }
        else if (floating !== false) {
            if (this.layoutOnOrientationChange !== false) {
                this.layoutOnOrientationChange = true;
            }
            this.autoRender = true;
        }
    },

    /**
		 * コンポーネントをドラッグ可能にします。
     * @param {Boolean/Mixed} draggable 最初にこのメソッドを呼ぶ場合には、trueまたは{@link Ext.util.Draggable}のコンフィグ
		 * オプションが指定可能です。二回目以降はtrueまたはfalseを指定します。
     * @param {Boolean} autoShow
     */
    setDraggable : function(draggable, autoShow) {
        this.isDraggable = draggable;

        if (this.rendered) {
            if (draggable === false) {
                if (this.dragObj) {
                    this.dragObj.disable();
                }
            } else {
                if (autoShow) {
                    this.show();
                }
                if (this.dragObj) {
                    this.dragObj.enable();
                } else {
                    this.dragObj = new Ext.util.Draggable(this.el, Ext.apply({}, this.draggable || {}));
                    this.relayEvents(this.dragObj, ['dragstart', 'beforedragend' ,'drag', 'dragend']);
                }
            }
        }
    },

    /**
		 * このコンポーネントの回転状態を設定します。
     * @param {String} orientation 'landscape'または'portrait'
     * @param {Number/String} width 回転後の幅
     * @param {Number/String} height 回転後の高さ
     */
    setOrientation : function(orientation, w, h) {
        if (this.fireEvent('beforeorientationchange', this, orientation, w, h) !== false) {
            if (this.orientation != orientation) {
                this.el.removeCls('x-' + this.orientation);
                this.el.addCls('x-' + orientation);
            }

            this.orientation = orientation;
            this.layoutOrientation(orientation, w, h);

            if (this.fullscreen) {
                this.setSize(w, h);
            }
            else if (this.layoutOnOrientationChange) {
                this.doComponentLayout();
            }

            if (this.floating && this.centered) {
                this.setCentered(true, true);
            }

            this.onOrientationChange(orientation, w, h);
            this.fireEvent('orientationchange', this, orientation, w, h);
        }
    },

    // @private
    onOrientationChange : Ext.emptyFn,

    beforeDestroy : function() {
        if (this.floating && this.modal && !this.hidden) {
            this.el.parent().unmask();
        }
        Ext.destroy(this.scroller);
        Ext.Component.superclass.beforeDestroy.call(this);
    },
    
    onDestroy : function() {
        if (this.monitorOrientation && Ext.EventManager.orientationEvent) {
            Ext.EventManager.orientationEvent.removeListener(this.setOrientation, this);
        }
        
        Ext.Component.superclass.onDestroy.call(this);
    }
});

// @xtype box
Ext.BoxComponent = Ext.Component;

Ext.reg('component', Ext.Component);
Ext.reg('box', Ext.BoxComponent);
