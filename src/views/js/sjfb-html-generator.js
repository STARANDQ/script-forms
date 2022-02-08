function generateForm(strData, strKeys) {
    if(strData) fields = JSON.parse(strData.replace(/&#34;/g, '"').replace(/\\/g, "/"))
    else fields = []
  
    var keys = null
    if(strKeys) keys = JSON.parse(strKeys.replace(/&#34;/g, '"').replace(/\\/g, "/"))
    else keys = []

    $('#keys').empty();

    // $.each( keys, function( k, v ) {
    //     $('#keys').append(addKeysdHTML(v, new URLSearchParams(window.location.search)));
    // })

    //empty out the preview area
    $("#fields").empty();

    $.each( fields, function( k, v ) {

        var fieldType = v['type'];

        //Add the field
        $('#fields').append(addFieldHTML(fieldType, v));
        var $currentField = $('#fields .form-group').last();

        //Any choices?
        if (v['choices']) {
            
            $.each( v['choices'], function( k, v ) {
                var uniqueID = Math.floor(Math.random()*999999)+1;

                if (fieldType === 'radio') {
                    var selected = Number.parseInt(v['sel']) ? ' checked' : '';
                    var choiceHTML = '<div class="form-check">' +
                            '<input value="' + v['label'] + '" type="radio" ' + selected + ' id="radio-' + uniqueID + '" name="radio-' + $currentField.attr('id') + '" class="form-check-input"/>' +
                            '<label style="padding-left: 1em" class="form-check-label" for="radio-' + uniqueID + '">' + v['label'] + '</label>' +
                        '</div>'
                    $currentField.find(".form-choices").append(choiceHTML);
                }

                else if (fieldType === 'checkbox') {
                    var selected = Number.parseInt(v['sel']) ? ' checked' : '';
                    // var choiceHTML = '<label><input type="checkbox" name="checkbox-' + uniqueID + '" ' + selected + ' value="' + v['label'] + '">' + v['label'] + '</label>';
                    var choiceHTML = '<div class="form-check">' +
                            '<input value="' + v['label'] + '" type="checkbox" ' + selected + ' id="check-' + uniqueID + '" name="check-' + $currentField.attr('id') + '" class="form-check-input"/>' +
                            '<label style="padding-left: 1em" class="form-check-label" for="check-' + uniqueID + '">' + v['label'] + '</label>' +
                        '</div>'
                    $currentField.find(".form-choices").append(choiceHTML);
                }

            });
        }
        

        // Is it required?
        if (Number.parseInt(v['req'])) {
            if (fieldType == 'text') { $currentField.find("input").prop('required',true).addClass('required-choice') }
            else if (fieldType == 'file') { $currentField.find("input").prop('required',true).addClass('required-choice') }
            else if (fieldType == 'number') { $currentField.find("input").prop('required',true).addClass('required-choice') }
            else if (fieldType == 'radio') { $currentField.find("input").prop('required',true).addClass('required-choice') }
            else if (fieldType == 'checkbox') {
                // $currentField.find(".form-choices").addClass('required-choice')
                $currentField.find("input").prop('required',true).addClass('required-choice').on("click", function(event) {
                    var $this = $(this);
                    var $parent = $this.parents('.form-choices')
                    
                    if ($this.prop('required')) {
                        if ($parent.find('input:checked').length > 0) {
                            $parent.find("input").prop('required',false).removeClass('required-choice')
                        }
                    } else {
                        if ($parent.find('input:checked').length == 0) {
                            $parent.find("input").prop('required',true).removeClass('required-choice')
                        }
                    }
                });
            }
            $currentField.addClass('required-field');
        }

    });
    
    //HTML templates for rendering frontend form fields
    function addKeysdHTML(v, urlParams) {
        if (Number.parseInt(v['access'])){

            var uniqueID = Math.floor(Math.random()*999999)+1;
    
            return '' +
                '<div class="key form-group row" id="field-' + uniqueID + '">' +
                    '<label class="col-sm-3 col-form-label" for="text-' + uniqueID + '">' + v['title'] + '</label>' +
                    '<div class="col-sm-9"><input readonly value="' + urlParams.get(v['label']) + '" class="form-control" type="text" id="text-' + uniqueID + '"></div>' +
                '</div>';
        }
    }

    //HTML templates for rendering frontend form fields
    function addFieldHTML(fieldType, v) {

        var uniqueID = Math.floor(Math.random()*999999)+1;

        switch (fieldType) {

            case 'text':
                return '' +
                    '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                        '<label class="field-label col-sm-5 col-form-label" for="text-' + uniqueID + '">' + v['label'] + '</label>' +
                        '<div class="col-sm-7"><input class="field-value form-control" type="text" id="text-' + uniqueID + '"></div>' +
                    '</div>';

            case 'file':
                return '' +
                    '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                        '<label class="field-label col-sm-5 col-form-label" for="text-' + uniqueID + '">' + v['label'] + '</label>' +
                        '<div class="col-sm-7"><input class="field-value form-control" type="file" id="file-' + uniqueID + '"></div>' +
                        '<span style="display: none" class="data"></span>' +
                    '</div>';

            case 'radio':
                return '' +
                    '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                        '<label class="field-label col-sm-5 col-form-label" for="radio-' + uniqueID + '">' + v['label'] + '</label>' +
                        '<div class="col-sm-7 form-choices" id="radio-' + uniqueID + '"></div>' +
                    '</div>';

            case 'checkbox':
                return '' +
                    '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                        '<label class="field-label col-sm-5 col-form-label" for="check-' + uniqueID + '">' + v['label'] + '</label>' +
                        '<div class="col-sm-7 form-choices" id="check-' + uniqueID + '"></div>' +
                    '</div>';

            case 'number':
                let r = '' +
                    '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                        '<label class="field-label col-sm-5 col-form-label" for="number-' + uniqueID + '">' + v['label'] + '</label>' +
                        // '<div class="col-sm-7"><input min=' + v['min'] + ' max=' + v['max'] + ' step=' + v['scale'] + ' class="field-value form-control" type="number" id="number-' + uniqueID + '"></div>' +
                        '<div class="d-flex flex-wrap col-sm-7">'
                            for(let i = +v['min']; i <= +v['max']; i += +v['scale']) {
                                r += '<div class="form-check">' +
                                    `<input value="${i}" type="radio" id="radio-${uniqueID}-${i}" name="radio-${uniqueID}" class="form-check-input"/>` +
                                    `<label style="padding-right: .8em" class="form-check-label" for="radio-${uniqueID}-${i}">${i}</label>` +
                                '</div>'
                            }
                        r += '</div>' +
                    '</div>';
                return r
        }
    }

    function readFile(file, onLoadCallback){
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    }

    $('.field input[type="file"]').on('change',function(e){
        $file = $(this)

        readFile(this.files[0], function(e) {
            $file.parents('.field').find('.data').text(e.target.result);
        });
    })

    $("form").submit(function(event) {
        event.preventDefault();

        //Loop through fields and save field data to array
        var fields = [];

        $('.field').each(function() {

            var $this = $(this);
            //field label
            var fieldLabel = $this.find('.field-label')[0].innerText;
            var fieldValue = null
            if ($this.find('.form-choices').length) {
                fieldValue = []
                $this.find('input:checked').each(function() {
                    fieldValue.push($(this).val())
                });
            } else {
                if ($this.data('type') === 'file' && $this.find('.field-value').val()) {
                    fieldValue = {
                        filename: $this.find('.field-value').val().split(/(\\|\/)/g).pop(),
                        data: $this.find('.data').text(),
                    }
                } else if ($this.data('type') === 'number') {
                    $this.find('input:checked').each(function() {
                        fieldValue = $(this).val()
                    })
                } else
                    fieldValue = $this.find('.field-value').val();
            }

            fields.push({
                label: fieldLabel,
                value: fieldValue,
            });

        });

        
        const data = Object.fromEntries(new URLSearchParams(window.location.search));
        const id_code = { id_code: data.id_code }
        const id_klient = { id_klient: data.id_klient }
        
        delete data.id_code;
        delete data.id_klient;

        const keys = Object.keys(data || {}).map((key) => ({
          label: key,
          value: data[key],
        }));

        const result = {
            id: $('form').data('id'),
            fields,
            keys,
            ...id_code,
            ...id_klient,
        }

        $.ajax({
            type: 'POST',
            url: '/form/fill',
            data: result,
            dataType: "json",
            success: (response) => {
                if (response.error) {
                    document.getElementById("check").innerHTML =  response.error;
                    return
                }
                
                if (response.success) {
                    $('form')[0].reset();
                    document.getElementById("aa").click();
                }
            },
            error: () => {
            }
        })
    });
}

