/**
 * @class Ext.util.Observable
 * イベントを発行するための共通のインターフェースを提供する基底クラス。このクラスを継承するクラスは
 * 定義された全てのイベントを保持するための「events」プロパティが必要です。また、設定されたイベント
 * リスナーを保持するための「listeners」プロパティについては任意です。<br>
 * コード例：
 * <pre><code>
Employee = Ext.extend(Ext.util.Observable, {
    constructor: function(config){
        this.name = config.name;
        this.addEvents({
            "fired" : true,
            "quit" : true
        });

        // 親クラスのコンストラクタでlistenersプロパティが設定されるように、渡された
				// listenersをthisオブジェクトにコピー
        this.listeners = config.listeners;

        // 親クラス（スーパークラス）のコンストラクタを呼び出し生成プロセスを完了
        Employee.superclass.constructor.call(this, config)
    }
});
</code></pre>
 * 上記のように設定することで、下記のような書き方が可能になります：<pre><code>
var newEmployee = new Employee({
    name: employeeName,
    listeners: {
        quit: function() {
            // thisはデフォルトではイベントを発行したオブジェクトを指します。
            alert(this.name + " has quit!");
        }
    }
});
</code></pre>
 */

Ext.util.Observable = Ext.extend(Object, {
    /**
    * @cfg {Object} listeners (オプション) <p>オブジェクトの初期化時に追加されるイベントリスナーを1つ以上含むコンフィグオブジェクト。
		* このオブジェクトは{@link #addListener}で複数のリスナーを一度に追加する例で示されているオブジェクトと同じ形式である必要があります。</p> 
    * <br><p><b><u>ExtJs {@link Ext.Component コンポーネント}が発行するDOMイベント</u></b></p>
    * <br><p><i>一部の</i>ExtJsコンポーネントクラスでは特定のDOMイベント（例：click、mouseoverなど）を発行しますが、これは付加情報をあわせて
		* 渡したい場合に限られています。例えば、 {@link Ext.DataView DataView}クラスの <b><code>{@link Ext.DataView#click click}</code></b>イベント
		* ではクリックされたノードの情報が渡されます。コンポーネントを構成するエレメントそのもののDOMイベントを拾いたい場合は、明示的に指定する必要
		* があります：

    * <pre><code>
new Ext.Panel({
    width: 400,
    height: 200,
    dockedItems: [{
        xtype: 'toolbar'
    }],
    listeners: {
        click: {
            element: 'el', // パネルの構成要素「el」のイベントを拾う
            fn: function(){ console.log('click el'); }
        },
        dblclick: {
            element: 'body', // パネルの構成要素「body」のイベントを拾う
            fn: function(){ console.log('dblclick body'); }
        }
    }
});
</code></pre>
    * </p>
    */
    // @private
    isObservable: true,

    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);
        if (me.listeners) {
            me.on(me.listeners);
            delete me.listeners;
        }
        me.events = me.events || {};
        
        if (this.bubbleEvents) {
            this.enableBubble(this.bubbleEvents);
        }
    },

    // @private
    eventOptionsRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|element|vertical|horizontal)$/,

    /**
     * <p>任意のObservableオブジェクト（あるいはElement)に対してイベントリスナーを追加します。このメソッドで追加されたリスナーは
		 * 対象のオブジェクトが破壊される際に自動的に削除されます。
     * @param {Observable|Element} item リスナーを追加する対象。
     * @param {Object|String} ename イベント名、またはイベント名をプロパティとしても持つオブジェクト。
     * @param {Function} fn オプション。<code>ename</code>がイベント名の場合、この第3引数にリスナーを設定。
     * @param {Object} scope オプション。<code>ename</code>がイベント名の場合、この第4引数にリスナー実行時のスコープ（<code>this</code>）を設定。
     * @param {Object} opt オプション。 <code>ename</code>がイベント名の場合、この第5引数に{@link Ext.util.Observable#addListener addListener}
		 * のoptionsと同じオブジェクトを設定。
     */
    addManagedListener : function(item, ename, fn, scope, options) {
        var me = this,
            managedListeners = me.managedListeners = me.managedListeners || [],
            config;
        
        if (Ext.isObject(ename)) {
            options = ename;
            for (ename in options) {
                if (!options.hasOwnProperty(ename)) {
                    continue;
                }
                config = options[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.addManagedListener(item, ename, config.fn || config, config.scope || options.scope, config.fn ? config : options);
                }
            }
        }
        else {
            managedListeners.push({
                item: item,
                ename: ename,
                fn: fn,
                scope: scope,
                options: options
            });
    
            item.on(ename, fn, scope, options);
        }
    },
    
    /**
     * {@link #addManagedListener}メソッドで追加されたリスナーを削除するためのメソッド。
     * @param {Observable|Element} item リスナーを削除する対象
     * @param {Object|String} ename イベント名、またはイベント名をプロパティとしても持つオブジェクト。
     * @param {Function} fn オプション。<code>ename</code>がイベント名の場合、この第3引数にリスナーを設定。
     * @param {Object} scope オプション。<code>ename</code>がイベント名の場合、この第4引数にリスナー実行時のスコープ（<code>this</code>）を設定。
     */
     removeManagedListener : function(item, ename, fn, scope) {
        var me = this,
            o,
            config,
            managedListeners,
            managedListener,
            length,
            i;
            
        if (Ext.isObject(ename)) {
            o = ename;
            for (ename in o) {
                if (!o.hasOwnProperty(ename)) {
                    continue;
                }
                config = o[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.removeManagedListener(item, ename, config.fn || config, config.scope || o.scope);
                }
            }
        }

        managedListeners = this.managedListeners ? this.managedListeners.slice() : [];
        length = managedListeners.length;
            
        for (i = 0; i < length; i++) {
            managedListener = managedListeners[i];
            if (managedListener.item === item && managedListener.ename === ename && (!fn || managedListener.fn === fn) && (!scope || managedListener.scope === scope)) {
                this.managedListeners.remove(managedListener);
                item.un(managedListener.ename, managedListener.fn, managedListener.scope);
            }
        }
    },
    
    /**
     * <p>指定されたイベントを発行し、渡された引数からイベント名を除いたものをリスナーに渡します。
     * <p>イベントは{@link #enableBubble}メソッドを呼び出すことで、Observableオブジェクト間の階層構造を
		 * 登っていくことも可能です（イベントバブル）。詳しくは{@link Ext.Component#getBubbleTarget}を参照し
		 * てください。</p>
     * @param {String} eventName 発行するイベント名
     * @param {Object...} args リスナーに渡すパラメーター（任意の数のパラメーターを指定可能）
     * @return {Boolean} リスナーのどれか1つでもfalseを返した場合はfalse。それ以外はtrue
     */
    fireEvent: function() {
        var me = this,
            a = Ext.toArray(arguments),
            ename = a[0].toLowerCase(),
            ret = true,
            ev = me.events[ename],
            queue = me.eventQueue,
            parent;

        if (me.eventsSuspended === true) {
            if (queue) {
                queue.push(a);
            }
            return false;
        }
        else if (ev && Ext.isObject(ev) && ev.bubble) {
            if (ev.fire.apply(ev, a.slice(1)) === false) {
                return false;
            }
            parent = me.getBubbleTarget && me.getBubbleTarget();
            if (parent && parent.isObservable) {
                if (!parent.events[ename] || !Ext.isObject(parent.events[ename]) || !parent.events[ename].bubble) {
                    parent.enableBubble(ename);
                }
                return parent.fireEvent.apply(parent, a);
            }
        }
        else if (ev && Ext.isObject(ev)) {
            a.shift();
            ret = ev.fire.apply(ev, a);
        }
        return ret;
    },

    /**
     * イベントリスナーをこのオブジェクトに追加。
     * @param {String}   eventName リスナーの対象となるイベント名
     * @param {Function} handler イベント発行時に実行されるイベントリスナー関数
     * @param {Object}   scope オプション。イベントリスナーの実行時のスコープ（(<code><b>this</b></code>が参照するオブジェクト）。
     * <b>省略した場合、イベントを発行するオブジェクトがデフォルト値。</b>
     * @param {Object}   options オプション。イベントリスナー実行に関する各種設定を格納するオブジェクト。下記のプロパティが指定
		 * 可能：<ul>
     * <li><b>scope</b> : Object<div class="sub-desc">イベントリスナーの実行時のスコープ（(<code><b>this</b></code>が参照するオブジェクト）。
     * <b>省略した場合、イベントを発行するオブジェクトがデフォルト値。</b></div></li>
     * <li><b>delay</b> : Number<div class="sub-desc">イベントリスナーの実行を、イベント発行時より指定した時間（単位：ミリ秒）だけ遅らせる。</div></li>
     * <li><b>single</b> : Boolean<div class="sub-desc">イベントリスナーの実行は次にイベントが発行するときのみに限定、実行後リスナーは自分自身を削除</div></li>
     * <li><b>buffer</b> : Number<div class="sub-desc">イベントリスナーの実行を {@link Ext.util.DelayedTask}で管理。指定した時間（単位：ミリ秒）遅れて
		 * 実行されるが、その時間内に同じイベントが再度発生した場合、最初のイベントリスナーは<em>実行されず</em>に、新しいイベントリスナーが指定時間経過後に
		 * 実行される。</div></li>
     * <li><b>target</b> : Observable<div class="sub-desc">ここで指定したオブジェクト上で発行された場合にのみイベントリスナーを実行。内包するObservable
		 * オブジェクトから上がってきたイベントは無視。</div></li>
     * <li><b>element</b> : String<div class="sub-desc">The element reference on the component to bind the event to. This is used to bind DOM events to underlying elements on {@link Ext.Component Components}. - This option is only valid for listeners bound to {@link Ext.Component Components}</div></li>
     * </ul><br>
     * <p>
     * <b>オプションの組み合わせ</b><br>
		 * 上記オプションを組み合わせることで、様々なタイプのリスナーの設定が可能です：<br>
     * <br>
     * 遅延実行、一度だけ実行されるリスナー。
     * <pre><code>
myPanel.on('hide', this.onClick, this, {
single: true,
delay: 100
});</code></pre>
     * <p>
     * <b>複数のイベントリスナーを1度に追加</b><br>
     * このメソッドではイベント名をプロパティとして持つオブジェクトを引数として受け取り、一度に複数のイベントリスナーを設定することも可能です。
     * <p>
     */
    addListener: function(ename, fn, scope, o) {
        var me = this,
            config,
            ev;

        if (Ext.isObject(ename)) {
            o = ename;
            for (ename in o) {
                if (!o.hasOwnProperty(ename)) {
                    continue;
                }
                config = o[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.addListener(ename, config.fn || config, config.scope || o.scope, config.fn ? config : o);
                }
            }
        }
        else {
            ename = ename.toLowerCase();
            me.events[ename] = me.events[ename] || true;
            ev = me.events[ename] || true;
            if (Ext.isBoolean(ev)) {
                me.events[ename] = ev = new Ext.util.Event(me, ename);
            }
            ev.addListener(fn, scope, Ext.isObject(o) ? o: {});
        }
    },

     /**
     * イベントリスナーを削除。
     * @param {String}   eventName イベントリスナーが設定されているイベント名
     * @param {Function} handler   削除するリスナー。<b> {@link #addListener}メソッドに渡した関数への参照を渡す必要があります。</b>
     * @param {Object}   scope     オプション。リスナーに設定されたスコープ。
     */
    removeListener: function(ename, fn, scope) {
        var me = this,
            config,
            ev;

        if (Ext.isObject(ename)) {
            var o = ename;
            for (ename in o) {
                if (!o.hasOwnProperty(ename)) {
                    continue;
                }
                config = o[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.removeListener(ename, config.fn || config, config.scope || o.scope);
                }
            }
        }
        else {
            ename = ename.toLowerCase();
            ev = me.events[ename];
            if (ev.isEvent) {
                ev.removeListener(fn, scope);
            }
        }
    },

    /**
     * 全てのイベントリスナーを削除（{@link #addManagedListener}で設定されたリスナーも含む）
     */
    clearListeners: function() {
        var events = this.events,
            ev,
            key;

        for (key in events) {
            if (!events.hasOwnProperty(key)) {
                continue;
            }
            ev = events[key];
            if (ev.isEvent) {
                ev.clearListeners();
            }
        }
        
        this.clearManagedListeners();
    },
    
    //<debug>
    purgeListeners : function() {
        console.warn('MixedCollection: purgeListeners has been deprecated. Please use clearListeners.');
        return this.clearListeners.apply(this, arguments);
    },
    //</debug>

   /**
     * {@link #addManagedListener}で追加されたイベントリスナーを削除
     */
    clearManagedListeners : function() {
        var managedListeners = this.managedListeners || [],
            ln = managedListeners.length,
            i, managedListener;

        for (i = 0; i < ln; i++) {
            managedListener = managedListeners[i];
            managedListener.item.un(managedListener.ename, managedListener.fn, managedListener.scope);
        }

        this.managedListener = [];
    },
    
    //<debug>
    purgeManagedListeners : function() {
        console.warn('MixedCollection: purgeManagedListeners has been deprecated. Please use clearManagedListeners.');
        return this.clearManagedListeners.apply(this, arguments);
    },
    //</debug>
    
    /**
     * このObservableオブジェクトが発行するイベントに、新たなイベントを追加するメソッド。
     * @param {Object|String} o イベント名をプロパティ（値はtrue）として持つオブジェクトかイベント名（複数のイベントを追加する場合は、
		 * 複数の引数として渡すことも可能）
     * @param {string} Optional オプション。複数のイベントを同時に追加する場合は、任意の数のイベント名を引数として指定。
     * 利用方法：<pre><code>
this.addEvents('storeloaded', 'storecleared');
</code></pre>
     */
    addEvents: function(o) {
        var me = this;
            me.events = me.events || {};
        if (Ext.isString(o)) {
            var a = arguments,
            i = a.length;
            while (i--) {
                me.events[a[i]] = me.events[a[i]] || true;
            }
        } else {
            Ext.applyIf(me.events, o);
        }
    },

    /**
		 * このオブジェクトが特定のイベントについてリスナーが設定されているかをチェックするメソッド。
     * @param {String} eventName チェックの対象となるイベント名
     * @return {Boolean} リスナーが設定されている場合true、されていなければfalse
     */
    hasListener: function(ename) {
        var e = this.events[ename];
        return e.isEvent === true && e.listeners.length > 0;
    },

    /**
     * 全てのイベント発行を停止。（{@link #resumeEvents}も参照）
     * @param {Boolean} queueSuspended trueを渡すことで、停止中に発生したイベントを捨てずにキューに
		 * 保存しておき{@link #resumeEvents}が呼ばれた際に発行されるように設定。
     */
    suspendEvents: function(queueSuspended) {
        this.eventsSuspended = true;
        if (queueSuspended && !this.eventQueue) {
            this.eventQueue = [];
        }
    },

    /**
     * イベントの発行を再開（{@link #suspendEvents}も参照）
     * イベントが<tt><b>queueSuspended</b></tt>として停止されていた場合、停止期間中に発生したイベントは
		 * このメソッドの呼び出し後に改めてイベントリスナーに渡されます。
     */
    resumeEvents: function() {
        var me = this,
            queued = me.eventQueue || [];

        me.eventsSuspended = false;
        delete me.eventQueue;

        Ext.each(queued,
        function(e) {
            me.fireEvent.apply(me, e);
        });
    },

    /**
     * 指定したオブジェクトの特定のイベントを自分自身（<tt><b>this</b></tt>）が発行したイベントのようにリレーさせるメソッド。
     * @param {Object} o イベントをリレーする対象となるObservableオブジェクト。
     * @param {Array} events リレーする対象となるイベント名の配列。
     */
    relayEvents : function(origin, events, prefix) {
        prefix = prefix || '';
        var me = this,
            len = events.length,
            i, ename;
            
        function createHandler(ename){
            return function(){
                return me.fireEvent.apply(me, [prefix + ename].concat(Array.prototype.slice.call(arguments, 0, -1)));
            };
        }
        
        for(i = 0, len = events.length; i < len; i++){
            ename = events[i].substr(prefix.length);
            me.events[ename] = me.events[ename] || true;
            origin.on(ename, createHandler(ename), me);
        }
    },
    
    /**
		 * <p>このObservableオブジェクト内で発生したイベントをオブジェクトの階層構造を登って行かせるためのメソッド
		 * （イベントバブル。ただし<code>this.getBubbleTarget()</code>メソッドの実装が必要。Observableクラス自体には実装され
		 * ていません）。このメソッドは通常Ext.Componentオブジェクトで発生したイベントを、そのオブジェクトを内包しているコンテナ
		 * オブジェクトに伝えるために使われています。詳しくは{@link Ext.Component.getBubbleTarget}を参照してください。
		 * Ext.ComponentでのgetBubbleTargetのデフォルトの戻り値は、そのコンポーネントの直接のオーナーコンテナとなっています。
		 * ただし、イベントを伝えるターゲットが予め分かっている場合は、getBubbleTargetメソッドをオーバーライドすることで、その
		 * ターゲットにより速くアクセスすることが可能です。</p>
     * <p>コード例：</p><pre><code>
Ext.override(Ext.form.Field, {
//  FieldクラスがchangeイベントをバブルアップするようにinitComponentに機能を追加
initComponent : Ext.createSequence(Ext.form.Field.prototype.initComponent, function() {
    this.enableBubble('change');
}),

//  イベントはFormPanelに直接伝えるように設定。
getBubbleTarget : function() {
    if (!this.formPanel) {
        this.formPanel = this.findParentByType('form');
    }
    return this.formPanel;
}
});

var myForm = new Ext.formPanel({
title: 'User Details',
items: [{
    ...
}],
listeners: {
    change: function() {
        // フォームのフィールドが変更されるとタイトル文字を赤く変更
        myForm.header.setStyle('color', 'red');
    }
}
});
</code></pre>
     * @param {String/Array} events バブルアップさせるイベント名、またはイベント名の配列
     */
    enableBubble: function(events) {
        var me = this;
        if (!Ext.isEmpty(events)) {
            events = Ext.isArray(events) ? events: Ext.toArray(arguments);
            Ext.each(events,
            function(ename) {
                ename = ename.toLowerCase();
                var ce = me.events[ename] || true;
                if (Ext.isBoolean(ce)) {
                    ce = new Ext.util.Event(me, ename);
                    me.events[ename] = ce;
                }
                ce.bubble = true;
            });
        }
    }
});

Ext.override(Ext.util.Observable, {
    /**
     * イベントリスナーをこのオブジェクトに追加。（{@link #addListener}の短縮形）
     * @param {String}   eventName リスナーの対象となるイベント名
     * @param {Function} handler イベント発行時に実行されるイベントリスナー関数
     * @param {Object}   scope オプション。イベントリスナーの実行時のスコープ（(<code><b>this</b></code>が参照するオブジェクト）。
     * <b>省略した場合、イベントを発行するオブジェクトがデフォルト値。</b>
     * @param {Object}   options オプション。イベントリスナー実行に関する各種設定を格納するオブジェクト。
     * @method
     */
    on: Ext.util.Observable.prototype.addListener,
    /**
     * イベントリスナーを削除。（{@link #removeListener}の短縮形）
     * @param {String}   eventName イベントリスナーが設定されているイベント名
     * @param {Function} handler   削除するリスナー。<b> {@link #addListener}メソッドに渡した関数への参照を渡す必要があります。</b>
     * @param {Object}   scope     オプション。リスナーに設定されたスコープ。
     * @method
     */
    un: Ext.util.Observable.prototype.removeListener,
    
    mon: Ext.util.Observable.prototype.addManagedListener,
    mun: Ext.util.Observable.prototype.removeManagedListener
});

/**
 * Observableに設定された<b>全ての</b>{@link #Observable.capture Ext.util.Observable.capture}を解除します。
 * @param {Observable} o 解除対象のObservableオブジェクト
 * @static
 */
Ext.util.Observable.releaseCapture = function(o) {
    o.fireEvent = Ext.util.Observable.prototype.fireEvent;
};

/**
 * 指定したObservableオブジェクトが発行するイベントを補足するためのメソッド。全てのイベントは
 * その<b>発行前</b>に、このメソッドの引数に指定された関数に、イベント名に通常のパラメーターが
 * 追加された形で渡されます。この関数がfalseを返した場合、イベントは発行されません。
 * @param {Observable} o イベントを補足する対象のObservableオブジェクト。
 * @param {Function} fn イベント発生時に呼び出す関数。
 * @param {Object} scope オプション。上記関数を呼び出すときのスコープ（<code>this</code>が参照するオブジェクト）を指定。デフォルトはイベントを
 * 発生させているObservableオブジェクト
 * @static
 */
Ext.util.Observable.capture = function(o, fn, scope) {
    o.fireEvent = Ext.createInterceptor(o.fireEvent, fn, scope);
};

/**
 * <p>指定したクラスのコンストラクタを監視するためのメソッド。</p>
 * <p>このメソッドを利用することで、多数のインスタンスで発生するイベントを、クラスで発生する一つのイベントとして
 * 一元管理することが可能となります</p>
 * <p>利用方法：</p><pre><code>
Ext.util.Observable.observe(Ext.data.Connection);
Ext.data.Connection.on('beforerequest', function(con, options) {
    console.log('Ajax request made to ' + options.url);
});</code></pre>
 * @param {Function} c 監視する対象となるクラスのコンストラクタ
 * @param {Object} listeners 対象に追加するリスナーが設定されたオブジェクト。{@link #addListener}を参照。
 * @static
 */
Ext.util.Observable.observe = function(cls, listeners) {
    if (cls) {
        if (!cls.isObservable) {
            Ext.applyIf(cls, new Ext.util.Observable());
            Ext.util.Observable.capture(cls.prototype, cls.fireEvent, cls);
        }
        if (typeof listeners == 'object') {
            cls.on(listeners);
        }
        return cls;
    }
};

//deprecated, will be removed in 5.0
Ext.util.Observable.observeClass = Ext.util.Observable.observe;

Ext.util.Event = Ext.extend(Object, (function() {
    function createBuffered(handler, listener, o, scope) {
        listener.task = new Ext.util.DelayedTask();
        return function() {
            listener.task.delay(o.buffer, handler, scope, Ext.toArray(arguments));
        };
    };

    function createDelayed(handler, listener, o, scope) {
        return function() {
            var task = new Ext.util.DelayedTask();
            if (!listener.tasks) {
                listener.tasks = [];
            }
            listener.tasks.push(task);
            task.delay(o.delay || 10, handler, scope, Ext.toArray(arguments));
        };
    };

    function createSingle(handler, listener, o, scope) {
        return function() {
            listener.ev.removeListener(listener.fn, scope);
            return handler.apply(scope, arguments);
        };
    };

    return {
        isEvent: true,

        constructor: function(observable, name) {
            this.name = name;
            this.observable = observable;
            this.listeners = [];
        },

        addListener: function(fn, scope, options) {
            var me = this,
                listener;
                scope = scope || me.observable;

            if (!me.isListening(fn, scope)) {
                listener = me.createListener(fn, scope, options);
                if (me.firing) {
                    // if we are currently firing this event, don't disturb the listener loop
                    me.listeners = me.listeners.slice(0);
                }
                me.listeners.push(listener);
            }
        },

        createListener: function(fn, scope, o) {
            o = o || {};
            scope = scope || this.observable;

            var listener = {
                    fn: fn,
                    scope: scope,
                    o: o,
                    ev: this
                },
                handler = fn;

            if (o.delay) {
                handler = createDelayed(handler, listener, o, scope);
            }
            if (o.buffer) {
                handler = createBuffered(handler, listener, o, scope);
            }
            if (o.single) {
                handler = createSingle(handler, listener, o, scope);
            }

            listener.fireFn = handler;
            return listener;
        },

        findListener: function(fn, scope) {
            var listeners = this.listeners,
            i = listeners.length,
            listener,
            s;

            while (i--) {
                listener = listeners[i];
                if (listener) {
                    s = listener.scope;
                    if (listener.fn == fn && (s == scope || s == this.observable)) {
                        return i;
                    }
                }
            }

            return - 1;
        },

        isListening: function(fn, scope) {
            return this.findListener(fn, scope) !== -1;
        },

        removeListener: function(fn, scope) {
            var me = this,
                index,
                listener,
                k;
            index = me.findListener(fn, scope);
            if (index != -1) {
                listener = me.listeners[index];

                if (me.firing) {
                    me.listeners = me.listeners.slice(0);
                }

                // cancel and remove a buffered handler that hasn't fired yet
                if (listener.task) {
                    listener.task.cancel();
                    delete listener.task;
                }

                // cancel and remove all delayed handlers that haven't fired yet
                k = listener.tasks && listener.tasks.length;
                if (k) {
                    while (k--) {
                        listener.tasks[k].cancel();
                    }
                    delete listener.tasks;
                }

                // remove this listener from the listeners array
                me.listeners.splice(index, 1);
                return true;
            }

            return false;
        },

        // Iterate to stop any buffered/delayed events
        clearListeners: function() {
            var listeners = this.listeners,
                i = listeners.length;

            while (i--) {
                this.removeListener(listeners[i].fn, listeners[i].scope);
            }
        },

        fire: function() {
            var me = this,
                listeners = me.listeners,
                count = listeners.length,
                i,
                args,
                listener;

            if (count > 0) {
                me.firing = true;
                for (i = 0; i < count; i++) {
                    listener = listeners[i];
                    args = arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                    if (listener.o) {
                        args.push(listener.o);
                    }
                    if (listener && listener.fireFn.apply(listener.scope || me.observable, args) === false) {
                        return (me.firing = false);
                    }
                }
            }
            me.firing = false;
            return true;
        }
    };
})());
