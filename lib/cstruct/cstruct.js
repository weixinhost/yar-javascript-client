/****
 * 使用js描述c语言变量的内存布局
 *
 */

(function(global,undefined){
    function CVal(type,val){
        this.type = type;
        this.val = val;
    }

    CVal.prototype.TYPE_DEFINE = {

        'int8':1,
        'uint8':1,

        'int16':2,
        'uint16':2,

        'int32':4,
        'uint32':4,

        'float32':4,
        'float64':8,
        'double':8,

        'string':-1,          //for dynamic string like char *
        'raw':-1            //is packed data

    };


    CVal.prototype.raw = function(view,offset){
        var _view = null;
        switch(this.type){
            case 'string' :{
               _view = new StringView(this.val,this.STRING_ENCODING,0,this.val.length);
                var _len = _view.bufferView.byteLength;
                for(var i=0;i<_len;i++){
                    view.setUint8(offset,_view.bufferView[i]);
                    offset+=1;
                }
                return offset;
            }break;

            case 'raw':{ //todo
                return offset;
            }break;

            default :{
                var _len = this.TYPE_DEFINE[this.type];
                var _buffer = new ArrayBuffer(_len);
                _view = new DataView(_buffer);
                if(_len){
                    switch(this.type){
                        case 'int8'     :{
                            view.setInt8(offset,parseInt(this.val));
                        }break;
                        case 'uint8'    :{
                            view.setUint8(offset,parseInt(this.val));
                        }break;
                        case 'int16'    :{
                            view.setInt16(offset,parseInt(this.val));
                        }break;
                        case 'uint16'   :{
                            view.setUint16(offset,parseInt(this.val));
                        }break;
                        case 'int32'    :{
                            view.setInt32(offset,parseInt(this.val));
                        }break;
                        case 'uint32'   :{
                            view.setUint32(offset,parseInt(this.val));
                        }break;
                        case 'float32'  :{
                            view.setFloat32(offset,parseFloat(this.val));
                        }break;
                        case 'double'   :
                        case 'float64'  :{
                            view.setFloat64(offset,parseFloat(this.val));
                        }break;
                    }
                    offset += _len;
                }
            }
        }

        return offset;
    }

    CVal.prototype.byte_length = function(){
        var _len = 0;
        switch(this.type){
            case 'string'   :{
                var _view = new StringView(this.val,this.STRING_ENCODING,0,this.val.length);
                _len = _view.bufferView.byteLength;
            }break;

            case 'raw'      :{
                return (this.val.length);
            }break;

            default         :{
                 _len = this.TYPE_DEFINE[this.type];
            }
        }
        return _len;
    }

    CVal.prototype.STRING_ENCODING ='UTF-8';


    function CArray(length){
        this.length = length;
        this.data = [];
        for(var i=0;i<length;i++){
            this.data.push(new CVal('int8',0));
        }
    }

    CArray.prototype.get = function(index){
        return this.data[index];
    }

    CArray.prototype.set = function(index,val){

        this.data[index] = undefined ;
        return this.data[index] = val;
    }
    CArray.prototype.byte_length = function(){
        var _len = 0;
        for(var i=0;i<this.length;i++){
           _len += this.data[i].byte_length();
        }
        return _len;
    }

    CArray.prototype.raw = function(view,offset){
        var _str = '';
        for(var i=0;i<this.length;i++){
             offset = this.data[i].raw(view,offset);
        }

        return offset;
    }



    function CStruct(propertys,property_layout){
        this.propertys = {};
        this.property_layout = property_layout || [];
        this.buffer = null;
        for(var i in propertys){
            if(propertys[i] instanceof  CVal || propertys[i] instanceof  CArray){
                this.propertys[i] = (propertys[i]);
            }
        }
    }

    CStruct.prototype.get = function(property_name){
        return this.propertys[property_name];
    }

    CStruct.prototype.set = function(property_name,val){
        return this.propertys[property_name] = val;
    }

    CStruct.prototype.byte_length = function(){
        var _len  = 0;
        for(var index in this.property_layout){
            _len += this.propertys[this.property_layout[index]].byte_length();
        }
        return _len;
    }


    CStruct.prototype.toString = function(){
        return this.raw();
    }


    CStruct.prototype.raw = function(){
        var _buffer = new ArrayBuffer(this.byte_length());
        var _view = new DataView(_buffer);
        var offset = 0;
        for(var index in this.property_layout){
            offset = this.propertys[this.property_layout[index]].raw(_view,offset);
        }

        return _view;
    }

    global.CStruct = {
        CVal : CVal,        //single veriable
        CArray : CArray,    //dynamic type array
        CStruct : CStruct   //struct description
    };

})(window,undefined);
