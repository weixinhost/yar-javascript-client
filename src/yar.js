(function(window,undefined){

    function yar_exception(message){
        return 'Yar Exception:'+(message || 'unknow exception');
    }

    function random_id(){
        return 1000000 + (parseInt(Math.random() * 10000000));
    }

    function Yar_Header(){

        /*****   Yar Protocol *****/
        this.id             = 0;            //Uint32
        this.version        = 1;            //Uint16
        this.magic_number   = 0x80DFEC60;   //Uint32
        this.reserved       = 0;            //Uint32
        this.provider       = '';           //Uint8 32 elements
        this.token          = '';           //Uint8 32 elements
        this.body_len       = 0;            //request_body len
        this.pack           = 'JSON';
        this._buffer        = null;   //ArrayBuffer
        this._view          = null;   //DataView

    }

    Yar_Header.prototype.create = function(body){
        if('object' == typeof body){
            body = JSON.stringify(body);
        }
        this.body_len = body.length;
        var strView = new StringView(body,'',0,body.length);

        this.body_len =2000;
        this._buffer = new ArrayBuffer(90 + strView.bufferView.byteLength);
        this._view = new DataView(this._buffer);

        this._view.setUint32(0,this.id);
        this._view.setUint16(4,this.version);
        this._view.setUint32(6,this.magic_number);
        this._view.setUint32(10,this.reserved);
        for(var i=0;i<32;i++){
            this._view.setUint8(14+i,0);
        }
        for(var i=0;i<32;i++){
            this._view.setUint8(46+i,0);
        }
         this._view.setUint32(78,this.body_len);
        var pack = 'JSON';
        this._view.setUint8(82,pack.charCodeAt(0));
        this._view.setUint8(83,pack.charCodeAt(1));
        this._view.setUint8(84,pack.charCodeAt(2));
        this._view.setUint8(85,pack.charCodeAt(3));
        this._view.setUint8(86,0);
        this._view.setUint8(87,0);
        this._view.setUint8(88,0);
        this._view.setUint8(89,0);

        var strView = new StringView(body,'',0,body.length);
        for(var i =0;i<strView.bufferView.byteLength;i++){
            this._view.setUint8(90 +i,strView.bufferView[i]);
        }

    }

    function YarClient(server){
        this.address = server;
    }

    YarClient.prototype.call = function(method,parmters,callback){
        var _request = {
            i:random_id(),
            'm':(''+method),
            'p':parmters || []
        };
        var _header = new Yar_Header();
        _header.id = _request['id'];
        _header.create(_request);
        var exchange=new XMLHttpRequest();
        exchange.onreadystatechange = function () {
            if (exchange.readyState == 4) {
                var _str = exchange.responseText;
                var response = _str.substr(90,_str.length - 89);
                response = JSON.parse(response);
                if('object' != typeof response){
                    //  throw yar_exception("yar protocol parse error!");
                }
                if('undefined' != typeof response['e']){
                    // throw yar_exception(response['e']);
                }
                if('function' == typeof callback){
                    callback(response['r']);
                }
            }
        }
        exchange.open("POST",this.address,true);
        exchange.send(_header._view);
    }

    window.YarClient = YarClient;
})(window,undefined);