Ext.gesture.Manager = new Ext.AbstractManager({
    startEventName: 'touchstart',
    moveEventName: 'touchmove',
    endEventName: 'touchend',
    
    init: function() {
        this.targets = []; 

        if (!Ext.supports.Touch) {
            Ext.apply(this, {
                startEventName: 'mousedown',
                moveEventName: 'mousemove',
                endEventName: 'mouseup'
            });
        }
        
        this.followTouches = [];
        this.currentGestures = [];
        this.currentTargets = [];
        
        document.addEventListener(this.startEventName, Ext.createDelegate(this.onTouchStart, this), true);
        document.addEventListener(this.endEventName, Ext.createDelegate(this.onTouchEnd, this), true);
    },

    onTouchStart: function(e) {
        // There's already a touchstart without any touchend!
        // This used to happen on HTC Desire and HTC Incredible
        // We have to clean it up
        if (this.startEvent) {
            this.onTouchEnd(e);
        }

        var targets = [],
            target = e.target;
        
        this.locks = {};
        
        this.currentTargets = [target];
        
        while (target) {
            if (this.targets.indexOf(target) != -1) {
                targets.unshift(target);
            }
            
            target = target.parentNode;
            this.currentTargets.push(target);
        }
        
        this.startEvent = e;
        this.startPoint = Ext.util.Point.fromEvent(e);
        this.handleTargets(targets, e);
    },
    
    /**
     * This listener is here to always ensure we stop all current gestures
     * @private
     */    
    onTouchEnd: function(e) {
        var gestures = this.currentGestures.slice(0),
            ln = gestures.length,
            i, gesture, endPoint,
            hasMoved = false,
            touch = e.changedTouches ? e.changedTouches[0] : e;

        if (this.startPoint) {
            endPoint = Ext.util.Point.fromEvent(e);

            // The point has changed, we should execute another onTouchMove before onTouchEnd
            // to deal with the problem of missing events on Androids and alike
            // This significantly improves scrolling experience on Androids! Yeah!
            if (!this.startPoint.equals(endPoint)) {
                hasMoved = true;
            }
        }
        
        this.followTouches = [];
        this.startedChangedTouch = false;
        this.currentTargets = [];
        this.startEvent = null;
        this.startPoint = null;
        
        for (i = 0; i < ln; i++) {
            gesture = gestures[i];

            if (!e.stopped && gesture.listenForEnd) {
                if (hasMoved) {
                    gesture.onTouchMove(e, touch);
                }

                gesture.onTouchEnd(e, touch);
            }

            this.stopGesture(gesture);
        }
    },

    startGesture: function(gesture) {
        var me = this;

        gesture.started = true;
        
        if (gesture.listenForMove) {
            gesture.onTouchMoveWrap = function(e) {
                if (!e.stopped) {
                    gesture.onTouchMove(e, e.changedTouches ? e.changedTouches[0] : e);
                }
            };
            
            gesture.target.addEventListener(me.moveEventName, gesture.onTouchMoveWrap, !!gesture.capture);
        }
        
        this.currentGestures.push(gesture);
    },

    stopGesture: function(gesture) {
        gesture.started = false;
        if (gesture.listenForMove) {
            gesture.target.removeEventListener(this.moveEventName, gesture.onTouchMoveWrap, !!gesture.capture);
        }
        this.currentGestures.remove(gesture);
    },
    
    handleTargets: function(targets, e) {
        // In handle targets we have to first handle all the capture targets,
        // then all the bubble targets.
        var ln = targets.length,
            i, target;
        
        this.startedChangedTouch = false;
        this.startedTouches = Ext.supports.Touch ? e.touches : [e];

        for (i = 0; i < ln; i++) {
            if (e.stopped) {
                break;
            }
            target = targets[i];
            this.handleTarget(target, e, true);
        }
        
        for (i = ln - 1; i >= 0; i--) {
            if (e.stopped) {
                break;
            }
            target = targets[i];
            this.handleTarget(target, e, false);
        }
        
        if (this.startedChangedTouch) {
            this.followTouches = this.followTouches.concat((Ext.supports.Touch && e.targetTouches) ? Ext.toArray(e.targetTouches) : [e]);
        }
    },
    
    handleTarget: function(target, e, capture) {
        var gestures = Ext.Element.data(target, 'x-gestures') || [],
            ln = gestures.length,
            i, gesture;

        for (i = 0; i < ln; i++) {
            gesture = gestures[i];
            if (
                (!!gesture.capture === !!capture) &&
                (this.followTouches.length < gesture.touches) && 
                ((Ext.supports.Touch && e.targetTouches) ? (e.targetTouches.length === gesture.touches) : true)
            ) {
                this.startedChangedTouch = true;
                this.startGesture(gesture);

                if (gesture.listenForStart) {
                    gesture.onTouchStart(e, e.changedTouches ? e.changedTouches[0] : e);
                }
                                
                if (e.stopped) {
                    break;
                }                
            }
        }
    },
        
    addEventListener: function(target, eventName, listener, options) {
        target = Ext.getDom(target);

        var targets = this.targets,
            name = this.getGestureName(eventName),
            gestures = Ext.Element.data(target, 'x-gestures') || [],
            gesture;
        
        // <debug>
        if (!name) {
            throw new Error('Trying to subscribe to unknown event ' + eventName);
        }
        // </debug>
        
        if (targets.indexOf(target) == -1) {
            this.targets.push(target);
        }
        
        gesture = this.get(target.id + '-' + name);
        
        if (!gesture) {
            gesture = this.create(Ext.apply({}, options || {}, {
                target: target,
                type: name
            }));

            gestures.push(gesture);

            Ext.Element.data(target, 'x-gestures', gestures);
        }
        
        gesture.addListener(eventName, listener);
        // If there is already a finger down, then instantly start the gesture
        if (this.startedChangedTouch && this.currentTargets.contains(target) && !gesture.started) {
            this.startGesture(gesture);
            if (gesture.listenForStart) {
                gesture.onTouchStart(this.startEvent, this.startedTouches[0]);                
            }
        }
    },
    
    removeEventListener: function(target, eventName, listener) {
        target = Ext.getDom(target);
        
        var name = this.getGestureName(eventName),
            gestures = Ext.Element.data(target, 'x-gestures') || [],
            gesture;
            
        gesture = this.get(target.id + '-' + name);
        
        if (gesture) {
            gesture.removeListener(eventName, listener);

            for (name in gesture.listeners) {
                return;
            }
            gesture.destroy();
            gestures.remove(gesture);
            Ext.Element.data(target, 'x-gestures', gestures);
        }
    },
    
    getGestureName: function(ename) {
        return this.names && this.names[ename];
    },
        
    registerType: function(type, cls) {
        var handles = cls.prototype.handles,
            i, ln;

        this.types[type] = cls;

        cls[this.typeName] = type;
        
        if (!handles) {
            handles = cls.prototype.handles = [type];
        }
        
        this.names = this.names || {};
        
        for (i = 0, ln = handles.length; i < ln; i++) {
            this.names[handles[i]] = type;
        }
    }
});

Ext.regGesture = function() {
    return Ext.gesture.Manager.registerType.apply(Ext.gesture.Manager, arguments);
};