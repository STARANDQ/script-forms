function generateForm(strData, strKeys) {
var fields = null
  if(strData) fields = JSON.parse(strData.replace(/&#34;/g, '"').replace(/\\/g, "/"))
  else fields = []

  var keys = null
  if(strKeys) keys = JSON.parse(strKeys.replace(/&#34;/g, '"').replace(/\\/g, "/"))
  else keys = []

  console.log(fields);

  $('#keys').empty();

  $.each( keys, function( k, v ) {
      $('#keys').append(addKeysdHTML(v));
  })

  //empty out the preview area
  $("#fields").empty();

  $.each( fields, function( k, v ) {

      var fieldType = v['type'];

      //Add the field
      $('#fields').append(addFieldHTML(fieldType, v));
      var $currentField = $('#fields .form-group').last();

      //Any choices?
      if (Array.isArray(v['value'])) {
          
          $.each( v['value'], function( k, v ) {
              var uniqueID = Math.floor(Math.random()*999999)+1;

              if (fieldType === 'radio') {
                  var selected = Number.parseInt(v['sel']) ? ' checked' : '';
                  var choiceHTML = '<div class="form-check">' +
                          '<input checked onclick="return false;" value="' + v['label'] + '" type="radio" ' + selected + ' id="radio-' + uniqueID + '" name="radio-' + $currentField.attr('id') + '" class="form-check-input"/>' +
                          '<label style="padding-left: 1em" class="form-check-label" for="radio-' + uniqueID + '">' + v['label'] + " (вес: " + v['weight'] + ')</label>' +
                      '</div>'
                  $currentField.find(".form-choices").append(choiceHTML);
              }

              else if (fieldType === 'checkbox') {
                  var selected = Number.parseInt(v['sel']) ? ' checked' : '';
                  // var choiceHTML = '<label><input type="checkbox" name="checkbox-' + uniqueID + '" ' + selected + ' value="' + v['label'] + '">' + v['label'] + '</label>';
                  var choiceHTML = '<div class="form-check">' +
                          '<input checked onclick="return false;" value="' + v['label'] + '" type="checkbox" ' + selected + ' id="check-' + uniqueID + '" name="check-' + $currentField.attr('id') + '" class="form-check-input"/>' +
                          '<label style="padding-left: 1em" class="form-check-label" for="check-' + uniqueID + '">' + v['label'] + " (вес: " + v['weight'] + ')</label>' +
                      '</div>'
                  $currentField.find(".form-choices").append(choiceHTML);
              }

          });
      }

  });
  
  //HTML templates for rendering frontend form fields
  function addKeysdHTML(v) {
          var uniqueID = Math.floor(Math.random()*999999)+1;
  
          return '' +
              '<div class="key form-group row" id="field-' + uniqueID + '">' +
                  '<label class="col-sm-3 col-form-label" for="text-' + uniqueID + '">' + v['title'] + '</label>' +
                  '<div class="col-sm-9"><input readonly value="' + v['value'] + '" class="form-control" type="text" id="text-' + uniqueID + '"></div>' +
              '</div>';
  }

  //HTML templates for rendering frontend form fields
  function addFieldHTML(fieldType, v) {

      var uniqueID = Math.floor(Math.random()*999999)+1;

      switch (fieldType) {

          case 'text':
              return '' +
                  '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                      '<label class="field-label col-sm-5 col-form-label" for="text-' + uniqueID + '">' + v['label'] + '</label>' +
                      '<div class="col-sm-7"><input readonly value=' + v['value'] + '  class="field-value form-control" type="text" id="text-' + uniqueID + '"></div>' +
                  '</div>';

          case 'file':
              return '' +
                  '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                      '<label class="field-label col-sm-5 col-form-label" for="text-' + uniqueID + '">' + v['label'] + '</label>' +
                      '<div class="col-sm-7"><a href=' + v['value'].data + ' class="btn btn-primary" id="file-' + uniqueID + '" download="' + v['value'].filename + '">' + v['value'].filename + '</a></div>' +
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
              return '' +
                  '<div class="field form-group row" data-type="' + fieldType + '" id="field-' + uniqueID + '">' +
                      '<label class="field-label col-sm-5 col-form-label" for="text-' + uniqueID + '">' + v['label'] + '</label>' +
                      '<div class="col-sm-7"><input readonly value=' + v['value'] + ' class="field-value form-control" type="number" id="number-' + uniqueID + '"></div>' +
                  '</div>';
      }
  }

  $("form").submit(function(event) {
      event.preventDefault();

      //Loop through fields and save field data to array
      var fields = [];

      $('.field').each(function() {

          var $this = $(this);
          //field label
          var fieldLabel = $this.find('.field-label')[0].innerText;

          if ($this.find('.form-choices').length) {
              var fieldValue = []
              $this.find('input:checked').each(function() {
                  fieldValue.push($(this).val())
              });
          } else {
              var fieldValue = $this.find('.field-value').val();
          }

          fields.push({
              label: fieldLabel,
              value: fieldValue,
          });

      });
  });
}

