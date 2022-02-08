$(function(){

    //Adds new field with animation
    $("#add-field a").click(function() {
        event.preventDefault();
        $(addField($(this).data('type'))).appendTo('#form-fields').hide().slideDown('fast');
        $('#form-fields').sortable();
    });
    //Adds new keys with animation
    $("#add-key a").click(function() {
        event.preventDefault();
        $(addKey($(this).data('type'), true)).appendTo('#form-keys').hide().slideDown('fast');
        $('#form-keys').sortable();
    });

    //Removes fields and choices with animation
    $("#form1").on("click", ".delete", function() {
        if (confirm('Вы уверены?')) {
            var $this = $(this);
            $this.parent().slideUp( "slow", function() {
                $this.parent().remove()
            });
        }
    });

    //Makes fields required
    $("#form1").on("click", ".toggle-required", function() {
        requiredField($(this));
    });
    //Makes fields required
    $("#form1").on("click", ".toggle-access", function() {
        accessKey($(this));
    });

    //Makes choices selected
    $("#form1").on("click", ".toggle-selected", function() {
        selectedChoice($(this));
    });

    //Adds new choice to field with animation
    $("#form1").on("click", ".add-choice", function() {
        $(addChoice()).appendTo($(this).prev()).hide().slideDown('fast');
        $('.choices ul').sortable();
    });

    //Saving form
    $("#form1").submit(function(event) {
        event.preventDefault();

        var formName = $('#formName').val()
        var formStatus = $('#formStatus').val()
        var formCriticalWeight = $('#criticalWeight').val()

        //Loop through fields and save field data to array
        var keys = [];
        var fields = [];
        var weight = 0;

        $('.field').each(function() {

            var $this = $(this);

            //field type
            var fieldType = $this.data('type');
            //field label
            var fieldLabel = $this.find('.field-label').val();
            //field required
            var fieldReq = $this.hasClass('required') ? 1 : 0;
            //field required
            var fieldMin = $this.find('.field-min').val();
            //field required
            var fieldMax = $this.find('.field-max').val();
            //field required
            var fieldScale = $this.find('.field-scale').val();

            var choices = null
            var fieldWeight = 0;

            //check if this field has choices
            if($this.find('.choices li').length >= 1) {

                choices = [];

                $this.find('.choices li').each(function() {

                    var $thisChoice = $(this);

                    //choice label
                    var choiceLabel = $thisChoice.find('.choice-label').val();
                    //choice label
                    var choiceWeight = $thisChoice.find('.choice-weight').val();

                    if (fieldType === 'radio') {
                        if (fieldWeight < Number.parseFloat(choiceWeight || 0)) {
                            fieldWeight = Number.parseFloat(choiceWeight || 0)
                        }
                    } else if (fieldType === 'checkbox') {
                        fieldWeight += Number.parseFloat(choiceWeight || 0);
                    }
                    //choice selected
                    var choiceSel = $thisChoice.hasClass('selected') ? 1 : 0;

                    choices.push({
                        label: choiceLabel,
                        sel: choiceSel,
                        weight: choiceWeight || 0
                    });

                });
            }

            fields.push({
                type: fieldType,
                label: fieldLabel,
                req: fieldReq,
                choices: choices,
                weight: Number.parseFloat(fieldWeight || fieldMax),
                min: fieldMin,
                max: fieldMax,
                scale: fieldScale,
            });

            weight += Number.parseFloat(fieldWeight || fieldMax || 0);

        });

        $('.key').each(function() {

            var $this = $(this);

            //field type
            var fieldType = $this.data('type');
            //field title
            var fieldTitle = $this.find('.key-title').val();
            //field label
            var fieldLabel = $this.find('.key-label').val();
            //field access
            var fieldAccess = $this.hasClass('access') ? 1 : 0;

            keys.push({
                type: fieldType,
                label: fieldLabel,
                title: fieldTitle,
                access: fieldAccess,
            });

        });

        if ($('#form-data').attr('data-id')) {
            var id = $('#form-data').attr('data-id')
            $.ajax({
                type: 'POST',
                url: '/form/edit',
                data: {
                    id,
                    name: formName,
                    status: formStatus,
                    criticalWeight: formCriticalWeight,
                    weight: weight,
                    keys: keys,
                    fields: fields
                },
                dataType: "json",
                success: (response) => {
                    if (response.error) {
                        document.getElementById("check").innerHTML =  response.error;
                        return
                    }
                    
                    if (response.success) {
                        $('#form1')[0].reset();
                        document.getElementById("aa").click();
                    }
                },
                error: () => {
                }
            })
        } else {
            $.ajax({
                type: 'POST',
                url: '/form/create',
                data: {
                    name: formName,
                    status: formStatus,
                    criticalWeight: formCriticalWeight,
                    weight: weight,
                    keys: keys,
                    fields: fields
                },
                dataType: "json",
                success: (response) => {
                    if (response.error) {
                        document.getElementById("check").innerHTML =  response.error;
                        return
                    }
                    
                    if (response.success) {
                        $('#form1')[0].reset();
                        document.getElementById("aa").click();
                    }
                },
                error: () => {
                }
            })
        }

    });

    //load saved form
    // loadForm(formID);

});

//Add field to builder
function addField(fieldType) {

    var hasRequired, hasChoices, title;
    var includeRequiredHTML = '';
    var includeChoicesHTML = '';
    var numberType = '';

    switch (fieldType) {
        case 'text':
            title = "Текстровое поле";
            hasRequired = true;
            hasChoices = false;
            break;
        case 'file':
            title = "Файл";
            hasRequired = true;
            hasChoices = false;
            break;
        case 'number':
            title = "Шкала";
            hasRequired = true;
            hasChoices = false;
            break;
        case 'radio':
            title = "Множественный выбор (один)";
            hasRequired = true;
            hasChoices = true;
            break;
        case 'checkbox':
            title = "Множественный выбор (несколько)";
            hasRequired = true;
            hasChoices = true;
            break;
    }

    if (hasRequired) {
        includeRequiredHTML = '' +
            '<label> Обязательно ' +
            '<input class="toggle-required" type="checkbox">' +
            '</label>'
    }

    if (hasChoices) {
        includeChoicesHTML = '' +
            '<div class="choices">' +
            '<ul></ul>' +
            '<button type="button" class="btn btn-info add-choice">Добавить вариант ответа</button>' +
            '</div>'
    }

    if (fieldType === 'number') {

        numberType = '' +
            '<div><label>min:' +
            '<input type="number" class="form-control field-min">' +
            '</label>' +
            '<label>max:' +
            '<input type="number" class="form-control field-max">' +
            '</label>' +
            '<label>шаг:' +
            '<input type="number" class="form-control field-scale">' +
            '</label></div>';
    }

    return '' +
        '<div class="field" data-type="' + fieldType + '">' +
        '<h5>' + title + '</h5>' +
        '<button type="button" class="btn btn-danger btn-sm delete">Удалить поле</button>' +
        '<label>Название:' +
        '<input type="text" class="form-control field-label">' +
        '</label>' +
        includeRequiredHTML +
        numberType +
        includeChoicesHTML +
        '</div>'
}
//Add key to builder
function addKey(fieldType, publicKey = false) {

    return '' +
        '<div class="key' + (publicKey ? ' access' : '')  + '" data-type="' + fieldType + '">' +
        '<label>Название <span style="font-size: .7em">(латинские букви, без пробелов)</span>:' +
        '<input type="text" class="form-control key-label">' +
        '</label>' +
        '<label>Описание <span style="font-size: .7em">(будет отображаться в форме)</span>:' +
        '<input type="text" class="form-control key-title">' +
        '</label>' +
        '<label> Публичный ' +
        '<input class="toggle-access" ' + (publicKey ? 'checked' : '')  + ' type="checkbox">' +
        '</label>' +
        '<button type="button" class="btn btn-danger btn-sm delete">Удалить ключ</button>' +
        '</div>'
}

//Make builder field required
function requiredField($this) {
    if (!$this.parents('.field').hasClass('required')) {
        //Field required
        $this.parents('.field').addClass('required');
        $this.prop('checked',true);
    } else {
        //Field not required
        $this.parents('.field').removeClass('required');
        $this.prop('checked',false);
    }
}

//Make builder key access
function accessKey($this) {
    if (!$this.parents('.key').hasClass('access')) {
        //Field required
        $this.parents('.key').addClass('access');
        $this.prop('checked',true);
    } else {
        //Field not required
        $this.parents('.key').removeClass('access');
        $this.prop('checked',false);
    }
}

function selectedChoice($this) {
    if (! $this.parents('li').hasClass('selected')) {

        //Only checkboxes can have more than one item selected at a time
        //If this is not a checkbox group, unselect the choices before selecting
        if ($this.parents('.field').data('type') != 'checkbox') {
            $this.parents('.choices').find('li').removeClass('selected');
            $this.parents('.choices').find('.toggle-selected').prop('checked',false);
        }

        //Make selected
        $this.parents('li').addClass('selected');
        $this.prop('checked',true);

    } else {

        //Unselect
        $this.parents('li').removeClass('selected');
        $this.prop('checked',false);

    }
}

//Builder HTML for select, radio, and checkbox choices
function addChoice() {
    return '' +
        '<li>' +
        '<label>Вариант: ' +
        '<input type="text" class="choice-label">' +
        '</label>' +
        '<label>Вес ответа:' +
        '<input class="choice-weight" type="number">' +
        '</label>' +
        '<label>Выбрать по умолчанию? ' +
        '<input class="toggle-selected" type="checkbox">' +
        '</label>' +
        '<button type="button" class="btn btn-danger btn-sm delete">Удалить вариант ответа</button>' +
        '</li>'
}