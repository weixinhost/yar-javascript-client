
(function(window,undefined){

    function yar_exception(message){
        return 'Yar Exception:'+(message || 'unknow exception');
    }

    function random_id(){
        return 1000000 + (parseInt(Math.random() * 10000000));
    }

    function str_byte_length(str){
        var doubleByteChars = str.match(/[^\x00-\xfe]/ig);
        return str.length + (doubleByteChars == null ? 0 : doubleByteChars.length);
    }

    function Yar_Header(){

        this.struct = new CStruct.CStruct(
            {
                id              : new CStruct.CVal('uint32',0),
                version         : new CStruct.CVal('uint16',1),
                magic_number    : new CStruct.CVal('uint32',0x80DFEC60),
                reserved        : new CStruct.CVal('uint32',0),
                provider        : new CStruct.CArray(32),
                token           : new CStruct.CArray(32),
                body_len        : new CStruct.CVal('uint32',0),
                pack            : new CStruct.CVal('string','JSON\0\0\0\0'),
                body            : new CStruct.CVal('string','')
            },
            ['id','version','magic_number','reserved','provider','token','body_len','pack','body']
        );



    }

    Yar_Header.prototype.create = function(body){
        if('object' == typeof body){
            body = JSON.stringify(body);
        }
        this.struct.get('body_len').val = body.length;
        this.struct.get('body').val = body;
        this.struct.get('id').val =123456789;
        return this.struct.raw();
    }

    function YarClient(server){
        this.address = server;
    }

    YarClient.prototype.call = function(method,parmters,callback){
        var _request = {
            i:123456789,
            'm':(''+method),
            'p':parmters || []
        };
        var _header = new Yar_Header();
        _header.id = _request['id'];
        var _send = _header.create(_request);
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
        exchange.send(_send);
    }

    window.YarClient = YarClient;
})(window,undefined);