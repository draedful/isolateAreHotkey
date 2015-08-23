IsolateArea = (function(){

    /**
     *
     * Изолированная область - область которая останавливает всплытие события, если нажитие было обработано внутренним обработчиком
     *
     * @param areaNode DOMNode - нода изолированной области
     * @param passThrough Boolean - if true then event stopPropagation and stopImmediatePropagation
     *
    * */
    function IsolateArea(areaNode, passThrough){
        this.elem = areaNode; // Нода изолированной области
        this.passThrough = passThrough;
        //this.elem.tabIndex = 0;
        this.elem.addEventListener('click', function(){
            console.log('click');
            this.elem.focus();
        }.bind(this))
        if(this.passThrough){
            console.log('passThrough', this.passThrough);
            this.elem.addEventListener('keyup', this.keyPressCb.bind(this));
            this.elem.addEventListener('keydown', this.keyPressCb.bind(this));
        }
    }

    IsolateArea.prototype.keyPressCb = function(e){
        console.log('IsolateArea', e);
        e.stopPropagation()
    };


    return IsolateArea;

})();