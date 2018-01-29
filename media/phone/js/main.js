$('document').ready(function () {
    var full = false;
    var fistMasked = false;
    var eightCodes = [800,846];
    var setCountry = function(){
    	return;
        $.getJSON("http://www.telize.com/geoip?callback=?",
            function(json) {
                if($('div:not(.loaded) .country.'+json.country_code).length==0){
                    var pCode = '+7';
                    $('div:not(.loaded) .number-input').addClass('RU');
                }else{
                    var pCode = $('div:not(.loaded) .country'+json.country_code).find('span').html();  
                    $('div:not(.loaded) .number-input').addClass(json.country_code);
                }   
                $('div:not(.loaded) .number-code').html(pCode);
            }
        );
    };

    var toggleError = function(element){
        $(element).addClass('error');
        $(element).parent('dl').addClass('error');
        setTimeout(function(){
            $(element).removeClass('error');
            $(element).parent('dl').addClass('error');
        },200);
    };

    $(document).on('click','.number-code',function(){
        $('.country-code').removeClass('active');
        $(this).parent().find('.country-code').addClass('active');
        $(this).parent().find('.country-code').css('left',-($(this).parent().find('.country-code').outerWidth(true)-$(this).outerWidth(true)));
        return false;
    });

    $(document).on('click','.country-code li',function(){
        $('.country-code').removeClass('active');
        $(this).parent().parent().find('.number-code').html($(this).find('span').html());
        $(this).parent().parent().find('.number-input').removeClass('RU BE UA').addClass($(this).attr('class').split('country').join(''));
        // /$(this).parent().parent().find('.code').val($(this).find('span').html());
    });
    
    $('[type=phone]').each(function(){
        var phone = $(this).val();
        $(this).wrap('<div class="number-wrap"><span class="number-input"></span></div>');
        $(this).parent().parent().prepend('<div class="number-code">+7</div><ul class="country-code"><li class="country RU">Россия<span>+7</span></li><li class="country KZ">Казахстан<span>+7</span></li><li class="country BE">Белорусия<span>+375</span></li><li class="country UA">Украина<span>+380</span></li></ul>');
        $(this).after('<input type="hidden" name="'+$(this).attr('name')+'" value="'+phone+'">');
        $(this).removeAttr('name');
        if (phone) {
            if (phone.indexOf('+7')!=-1){
                $(this).parent().parent().find('.country.RU').click();
                $(this).closest('.number-wrap').addClass('loaded');
            } else if (phone.indexOf('+8')!=-1){
                $(this).parent().parent().find('.country.RU').click();
                $(this).closest('.number-wrap').addClass('loaded');
            } else if (phone.indexOf('+375')!=-1){
                $(this).parent().parent().find('.country.BE').click();
                $(this).closest('.number-wrap').addClass('loaded');
                //      alert();
            } else if (phone.indexOf('+380')!=-1){
                $(this).parent().parent().find('.country.UA').click();
                $(this).closest('.number-wrap').addClass('loaded');
            }
            var phone = phone.split(' ').join('').split('_').join('').split('-').join('').split(', доб.').join('').split('#').join('').split('+7').join('').split('+8').join('').split('+375').join('').split('+380').join('').split('(').join('').split(')').join('');
            var potentialCode = parseInt(phone.substring(0,3));
            if(((phone.length>=11)&&(phone.length<=14))&&(phone.charAt(0)=="8")&&(eightCodes.indexOf(potentialCode)==-1)){
                phone = phone.substr(1);
                $(this).closest('.number-wrap').addClass('loaded');
                $(this).parent().parent().find('.country.RU').click();
            }
            $(this).val(phone);
        }

    });

    setCountry();
    
    $('[type=phone]').blur(function (e) {
        var size = $(this).val().length;
        if (size > 0 && (size < 10 || size > 14)) {
            $(this).addClass('error');
            $(this).parent('dl').addClass('error');
        }
    });

    var phoneSymbols = [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105];
    var serviceSymbols = [8,9,37,38,39,40,46,91,86,91];
    $('[type=phone]').keypress(function(e){
        if(phoneSymbols.indexOf(e.charCode)!=-1){
        }else{
            if(serviceSymbols.indexOf(e.charCode)!=-1){
            }else{
                toggleError($(this).parent().parent());
                toggleError($('.example-phone'));
                //console.log(e.charCode);
            }
        }
        if($(this).inputmask('unmaskedvalue').length==13){
            toggleError($(this).parent().parent());
            toggleError($('.example-phone'));
        }
    });
    
    var makeKppMask = function(e) {
        var kpp = [{ "mask": "#########"}];
        $(e).inputmask({ 
            mask: kpp, 
            removeMaskOnSubmit:true,
            quantifiermarker: { start: "{", end: "}" },
            greedy: false, 
            showMaskOnHover: false, 
            //keepStatic: true,
            definitions: { '#': { validator: "[0-9]", cardinality: 1}},
            numericInput: false
        });
    };
    makeKppMask($('[type=kpp]'));
    
    var makeInnMask = function(e) {
        var inn = [{ "mask": "##########"}, { "mask": "############"}];
        $(e).inputmask({ 
            mask: inn, 
            removeMaskOnSubmit:true,
            quantifiermarker: { start: "{", end: "}" },
            greedy: false, 
            showMaskOnHover: false, 
            //keepStatic: true,
            definitions: { '#': { validator: "[0-9]", cardinality: 1}},
            oncomplete: checkInn,
            numericInput: false
        });
    };
    makeInnMask($('[type=inn]'));
    
    var checkInn = function (e) {
        var inn = $(this).val().split('');
        var result = false;
        if (inn.length == 10) {
            result = (inn[9] == ((2 * inn[0] + 4 * inn[1] + 10 * inn[2] + 3 * inn[3] + 5 * inn[4] + 9 * inn[5] + 4 * inn[6] + 6 * inn[7] + 8 * inn[8]) % 11) % 10);
        } else if (inn.length == 12) {
            result = (inn[10] == ((7 * inn[0] + 2 * inn[1] + 4 * inn[2] + 10 * inn[3] + 3 * inn[4] + 5 * inn[5] + 9 * inn[6] + 4 * inn[7] + 6 * inn[8] + 8 * inn[9]) % 11) % 10) && (inn[11] == ((3 * inn[ 0] + 7 * inn[1] + 2 * inn[2] + 4 * inn[3] + 10 * inn[4] + 3 * inn[5] + 5 * inn[6] + 9 * inn[7] + 4 * inn[8] + 6 * inn[9] + 8 * inn[10]) % 11) % 10);
        }

        //console.log(result);
        if (!result) {
            $(this).addClass('error');
            $(this).parent('dl').addClass('error');
        }
    };

    
    var makeMask = function(element, mask=false){
    	//var phones = [{ "mask": "### ###-##-##"}, { "mask": "### ###-##-##, доб. #[#[#]]"}];
    	var phones = [{ "mask": "### ###-##-##"}];
        if ( mask !== false) {
            phones = [{ "mask": mask}];
        }

        $(element).inputmask({ 
            mask: phones, 
            removeMaskOnSubmit:true,
            quantifiermarker: { start: "{", end: "}" },
            greedy: false, 
            showMaskOnHover: false, 
            //keepStatic: true,
            definitions: { '#': { validator: "[0-9]", cardinality: 1}},
            numericInput: false
        });
    };

    var cleanMask = function(element){
        $(element).inputmask('remove');
        $element = $(element);
        $(element).val('');
        setTimeout(function(){
            if ($element.val().indexOf('+7')!=-1){
                $element.parent().parent().find('.country.RU').click();
            } else if ($element.val().indexOf('+8')!=-1){
                $(this).parent().parent().find('.country.RU').click();
                $(this).closest('.number-wrap').addClass('loaded');
            } else if ($element.val().indexOf('+375')!=-1){
                $element.parent().parent().find('.country.BE').click();
            } else if ($element.val().indexOf('+380')!=-1){
                $element.parent().parent().find('.country.UA').click();
            }
            var val = $element.val().split(' ').join('').split('_').join('').split('-').join('').split(', доб.').join('').split('+7').join('').split('+8').join('').split('+375').join('').split('+380').join('').split('(').join('').split(')').join('');
            var potentialCode = parseInt($element.val().substring(0,3));
            if(((val.length>=11)&&(val.length<=14))&&(val.charAt(0)=="8")&&(eightCodes.indexOf(potentialCode)==-1)){
                val = val.substr(1);
                $element.parent().parent().find('.country.RU').click();
            }
            $element.val(val);
            //console.log(val);
            makeMask($element);
        },50);
    }

    $('[type=phone]').each(function() {
        var code = $(this).parent().parent().find('.number-code').text();
        var mask = "### ###-##-##";
        if (code && code != "+7") {
            mask = "## ###-##-##";
        }

        makeMask($(this), mask);
    });


    $('[type=phone]').bind('copy', function(e) {
        var valBefore = $(this).inputmask('unmaskedvalue');
        $(this).inputmask('remove');
        $this = $(this);
        $this.val($this.parent().find('[type=hidden]').val());
        $this.select();
        setTimeout(function(){  
            makeMask($this);
            $this.val(valBefore);
        },0);
    });

    $('[type=phone]').bind('paste', function(e) {
        cleanMask(this);
    });

    //$('[type=phone]').trigger('paste');

    $('[type=phone]').focus(function(){
        $(this).parent().parent().addClass('focused');
    });

    $('[type=phone]').blur(function(){
        $(this).parent().parent().removeClass('focused');
    });
     $('[type=phone]').keydown(function(){
        $this=$(this);
        setTimeout(function(){
            if($this.inputmask('unmaskedvalue').length==0){
                $this.next().val('');
            }else{
                $this.next().val($this.parent().parent().find('.number-code').html()+$this.val().split(' ').join('').split('_').join('').split('-').join('').split(',доб.').join('#'));    
            }
            //console.log($('form').serialize());    
        },0);
        //console.log($(this).next().attr('name')+":"+$(this).next().val());
    });


    $(document).click(function(){
        if($('.country-code.active').length>0){
            $('.country-code').removeClass('active');
        }
    });

    $(document).on('click', '.country-code .country', function() {
        var input = $(this).parent().parent().find('[type=phone]');
        var code = $(this).find('span').text();
        if (input && input.length == 1) {
            $(input).inputmask('remove');
            $(input).val('');
            var phone_hidden_val = $(input).parent().find('[name="contact[phone]"]');
            if ( phone_hidden_val.length > 0 ) {
                phone_hidden_val.val('');
            }
            var mask = "### ###-##-##";
            if (code != "+7") {
                mask = "## ###-##-##";
            }

            makeMask(input, mask);
        }
    });

    setTimeout(function() {
        $('input[type=phone]').each(function(){
            $(this).trigger('keydown');
        });
    },0);

    
});