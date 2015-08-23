window.getHotkey = (function(){

    var Helper = {
        stopBubbling: function(e){
            console.debug('stop Propagation');
            e.stopPropagation(); //Останавливает передачу события родителю (всплытие)
            e.stopImmediatePropagation(); // Останавливает всплытие и прекращает работу других обработчиков этого события на этом элементе
        }
    }

    var getHotkeyHandler = function (elemNode, hotkey, action) {
        var constructor ;
        constructor = SimpleHotkey;

        if(hotkey.indexOf('+') > 0){
            constructor = CombinationHotKey;
        }

        if(typeof hotkey == 'array'){
            constructor = AliasHotKey
        }

        return new constructor(elemNode, hotkey, action);
    };

    var AliasHotKey = function (elemNode, keyCodes, action){
        this.elem = elemNode;
        this.keyCodes = keyCodes;
        this.event = isFunction(action) ? action : function(){};
        this.elem.addEventListener('keyup', this.onKeyDown.bind(this));
    };

    AliasHotKey.prototype.isValidKey = function(key){
        return this.keyCodes.indexOf(key);
    };


    var CombinationHotKey = function (elemNode, keyCodes, action){
        this.elem = elemNode;
        this.keyCodes = keyCodes.split('+');
        this.keyMap = CombinationHotKey.getKeyMap(this.keyCodes);
        this.event = isFunction(action) ? action : function(){};
        this.elem.addEventListener('keydown', this.onKeyDown.bind(this)); // Регистрируем нажатие
        this.elem.addEventListener('keyup', this.onKeyUp.bind(this)); // Проверяем карту, и если все нужные клавиши нажаты, то запускаем евент
    };

    CombinationHotKey.prototype.onKeyDown = function(e){
        if(typeof this.keyMap[e.which] !== 'undefined'){
            this.keyMap[e.which] = true;
        }
    };

    CombinationHotKey.prototype.isAllPressed = function(){
        for(var i in this.keyMap){
            if(!this.keyMap[i]){
                return false;
            }
        }
        return true;
    }

    CombinationHotKey.prototype.onKeyUp = function(e){
        if(this.isAllPressed()){
            Helper.stopBubbling();
            this.event();
        }
        this.clearMap();
    };

    CombinationHotKey.prototype.clearMap = function(){
        for(var i in this.keyMap){
            this.keyMap[i] = false;
        }
    };

    CombinationHotKey.getKeyMap = function(keys){
        var a = {};
        for(var i = 0; i <= keys.length; i++){
            a[keys[i]] = false;
        }
        return a;
    };

    var SimpleHotkey = function(elemNode, keyCode, action){
        this.elem = elemNode;
        this.keyCode = keyCode;
        this.event = isFunction(action) ? action : function(){};
        //setTimeout(function(){
            this.elem.addEventListener('keyup', this.onKeyUp.bind(this));
            this.elem.addEventListener('keydown', this.onKeyUp.bind(this)); // чтобы перевентить всякое говно
        //}.bind(this), 0);

    };

    SimpleHotkey.prototype.isValidKey = function(code){
        return code == this.keyCode;
    };

    SimpleHotkey.prototype.onKeyUp = function(e){
        console.log('SimpleHotkey',e);
        if(this.isValidKey(e.which)){
            if(e.type == 'keydown'){
                e.preventDefault();
            }
            Helper.stopBubbling(e);
            this.event();
        }
    };
    extend(AliasHotKey, SimpleHotkey);

    return getHotkeyHandler;
})();