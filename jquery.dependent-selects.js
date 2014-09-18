/*
 * jQuery Dependent Selects v1.2.2
 * Copyright 2012 Mark J Smith, Simpleweb
 * Details on http://github.com/simpleweb/jquery-dependent-selects
 */
(function($) {
  return $.fn.dependentSelects = function(options) {
    var clearAllSelectsByParent, createNewSelect, createSelectId, createSelectSId, findSelectParent, hideSelect, insertLabel, insertPlaceholderSelect, labelAtDepth, placeholderOptionAtDepth, placeholderSelectAtDepth, prepareSelect, selectChange, selectPreSelected, selectedOption, showSelect, splitOptionName;
    if (options == null) {
      options = {};
    }
    options = $.extend({
      'separator': ' > ',
      'placeholderOption': '',
      'placeholderSelect': false,
      'class': false,
      'labels': false
    }, options);
    createSelectId = function() {
      var int;
      int = parseInt(Math.random() * 1000);
      if ($("[data-dependent-id='" + int + "']").length > 0) {
        return createSelectId();
      } else {
        return int;
      }
    };
    createSelectSId = function() {
      var int;
      int = parseInt(Math.random() * 1000);
      if ($("[data-dependent-idid='" + int + "']").length > 0) {
        return createSelectSId();
      } else {
        return int;
      }
    };
    splitOptionName = function($option) {
      var array, i, item, _i, _len;
      array = $.map($option.text().split(options.separator), function(valuePart) {
        return $.trim(valuePart);
      });
      i = 0;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (item === '') {
          array.splice(i, 1);
          i--;
        }
        i++;
      }
      return array;
    };
    placeholderSelectAtDepth = function(depth, $select) {
      var placeholder, text;
      depth--;
      placeholder = options.placeholderSelect;
      if (placeholder) {
        if (placeholder === true) {
          placeholder = $select.data('dependent-select-placeholders');
        }
        if (typeof placeholder === 'object') {
          if (placeholder[depth]) {
            text = placeholder[depth];
          } else {
            text = placeholder[placeholder.length - 1];
          }
        } else {
          text = placeholder;
        }
        return $("<select disabled><option>" + text + "</option></select>").attr({
          'data-dependent-depth': depth + 1,
          'data-dependent-placeholder': true,
          'data-dependent-id': $select.attr('data-dependent-id')
        });
      }
    };
    placeholderOptionAtDepth = function(depth) {
      var placeholder, text;
      depth--;
      placeholder = options.placeholderOption;
      if (typeof placeholder === 'object') {
        if (placeholder[depth]) {
          text = placeholder[depth];
        } else {
          text = placeholder[placeholder.length - 1];
        }
      } else {
        text = placeholder;
      }
      return $("<option>" + text + "</option>");
    };
    labelAtDepth = function(depth, $select) {
      var labels;
      depth--;
      labels = options.labels;
      if (labels) {
        if (labels === true) {
          labels = $select.data('dependent-labels');
        }
        if (labels[depth]) {
          return labels[depth];
        } else {
          return labels[labels.length - 1];
        }
      } else {
        return false;
      }
    };
    hideSelect = function($select) {
      var label, placeholder_select, select_depth, select_id;
      select_id = $select.attr('data-dependent-id');
      select_depth = $select.attr('data-dependent-depth');
      placeholder_select = $("select[data-dependent-placeholder][data-dependent-id='" + select_id + "'][data-dependent-depth='" + select_depth + "']");
      label = $("label[data-dependent-id='" + select_id + "'][data-dependent-depth='" + select_depth + "']").hide();
      if (placeholder_select.length > 0) {
        placeholder_select.show();
        label.show();
      }
      return $select.hide();
    };
    showSelect = function($select) {
      var label, placeholder_select, select_depth, select_id;
      select_id = $select.attr('data-dependent-id');
      select_depth = $select.attr('data-dependent-depth');
      placeholder_select = $("select[data-dependent-placeholder][data-dependent-id='" + select_id + "'][data-dependent-depth='" + select_depth + "']");
      label = $("label[data-dependent-id='" + select_id + "'][data-dependent-depth='" + select_depth + "']").show();
      if (placeholder_select.length > 0) {
        placeholder_select.hide();
      }
      return $select.show();
    };
    insertLabel = function($select, $parent) {
      var $label, label, select_depth, select_id;
      if (label = labelAtDepth($select.attr('data-dependent-depth'), $select)) {
        select_id = $select.attr('data-dependent-id');
        select_depth = $select.attr('data-dependent-depth');
        $label = $("<label>" + label + "</label>").attr({
          'data-dependent-id': select_id,
          'data-dependent-depth': select_depth
        });
        if (!($("label[data-dependent-id='" + select_id + "'][data-dependent-depth='" + select_depth + "']").length > 0)) {
          if ($parent) {
            return $parent.after($label);
          } else {
            return $select.before($label);
          }
        }
      }
    };
    insertPlaceholderSelect = function($select, $parent) {
      var $placeholderSelect, depth, select_id;
      if ($placeholderSelect = placeholderSelectAtDepth($select.attr('data-dependent-depth'), $select)) {
        select_id = $select.attr('data-dependent-id');
        depth = $select.attr('data-dependent-depth');
        if (!($("select[data-dependent-placeholder][data-dependent-id='" + select_id + "'][data-dependent-depth='" + depth + "']").length > 0)) {
          return $select.before($placeholderSelect);
        }
      }
    };
    clearAllSelectsByParent = function($parent) {
      return $(".dependent-sub[data-dependent-id='" + ($parent.attr('data-dependent-id')) + "']").each(function() {
        if (parseInt($(this).attr('data-dependent-depth')) > parseInt($parent.attr('data-dependent-depth'))) {
          $(this).find('option:first').attr('selected', 'selected');
          return hideSelect($(this));
        }
      });
    };
    createNewSelect = function(name, $select, depth) {
      var $currentSelect, $labels, $newSelect, select_id;
      select_id = $select.attr('data-dependent-id');
      if (($currentSelect = $("select[data-dependent-parent='" + name + "'][data-dependent-id='" + select_id + "']")).length > 0) {
        return $currentSelect;
      }
      $newSelect = $('<select class="dependent-sub"/>').attr('data-dependent-parent', name).attr('data-dependent-depth', depth).attr('data-dependent-input-name', $select.attr('data-dependent-input-name')).attr('data-dependent-id', select_id).addClass(options["class"]).append(placeholderOptionAtDepth(depth));
      if (options.labels === true) {
        $newSelect.attr('data-dependent-labels', $select.attr('data-dependent-labels'));
      }
      if (options.placeholderSelect === true) {
        $newSelect.attr('data-dependent-select-placeholders', $select.attr('data-dependent-select-placeholders'));
      }
      if (($labels = $("label[data-dependent-id='" + select_id + "'][data-dependent-depth='" + depth + "']")).length > 0) {
        $newSelect.insertAfter($labels);
      } else {
        $newSelect.insertAfter($select);
      }
      insertLabel($newSelect, $select);
      insertPlaceholderSelect($newSelect, $select);
      return hideSelect($newSelect);
    };
    selectChange = function($select) {
      var $sub, select_id, val, valName;
      $("select[data-dependent-id='" + ($select.attr('data-dependent-id')) + "'][name]").removeAttr('name');
      valName = $select.find(':selected').attr('data-dependent-idid');
      val = $select.val();
      select_id = $select.attr('data-dependent-id');
      clearAllSelectsByParent($select);
      if (($sub = $(".dependent-sub[data-dependent-parent='" + valName + "'][data-dependent-id='" + select_id + "']")).length > 0) {
        showSelect($sub);
        return $sub.attr('name', $select.attr('data-dependent-input-name'));
      } else {
        return $select.attr('name', $select.attr('data-dependent-input-name'));
      }
    };
    selectedOption = function($select) {
      var $selectedOption, val;
      $selectedOption = $select.find('option:selected');
      val = $selectedOption.val();
      if (!(val === '' || val === placeholderOptionAtDepth($select.attr('data-dependent-depth')).val())) {
        return $select.attr('data-dependent-selected-id', val);
      }
    };
    findSelectParent = function($select) {
      var $all_options, $selects;
      $selects = $("select[data-dependent-id='" + ($select.attr('data-dependent-id')) + "']");
      $all_options = $selects.find('option');
      return $selects.filter(function() {
        var vals;
        vals = [];
        $(this).find('option').each(function() {
          return vals.push($(this).html() === $select.attr('data-dependent-parent'));
        });
        return $.inArray(true, vals) > -1;
      });
    };
    selectPreSelected = function($select) {
      var $all_options, $current_select, $selected_option, $selected_select, $selects, current_option_text, i, selected_id, _i, _ref;
      if ((selected_id = $select.attr('data-dependent-selected-id'))) {
        $selects = $("select[data-dependent-id='" + ($select.attr('data-dependent-id')) + "']");
        $all_options = $selects.find('option');
        $selected_option = $all_options.filter("[value='" + selected_id + "']");
        $selected_select = $selected_option.closest('select');
        $current_select = $selected_select;
        current_option_text = $selected_option.html();
        for (i = _i = _ref = parseInt($selected_select.attr('data-dependent-depth')); _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
          $current_select.find('option').each(function() {
            if ($(this).html() === current_option_text) {
              return $(this).attr('selected', 'selected');
            } else {
              return $(this).removeAttr('selected');
            }
          });
          showSelect($current_select);
          current_option_text = $current_select.attr('data-dependent-parent');
          $current_select = findSelectParent($current_select);
        }
        return $selected_select.trigger('change');
      }
    };
    prepareSelect = function($select, depth, select_id) {
      var $options, name;
      $select.attr('data-dependent-depth', depth).attr('data-dependent-id', select_id);
      $options = $select.children('option');
      $options.each(function() {
        var $newId, $newOption, $option, $subSelect, name, val;
        $option = $(this);
        name = splitOptionName($option);
        val = $option.val();
        if (name.length > 1) {
          $newId = createSelectSId();
          $subSelect = createNewSelect($newId, $select, depth + 1);
          $newOption = $option.clone();
          $newOption.html($.trim(splitOptionName($newOption).slice(1).join(options.separator)));
          $subSelect.append($newOption);
          $option.val('').html(name[0]).attr('data-dependent-name', name[0]).attr('data-dependent-idid', $newId);
          if ($options.parent().find("[data-dependent-name='" + name[0] + "']").length > 1) {
            $option.remove();
          }
          return prepareSelect($subSelect, depth + 1, select_id);
        }
      });
      name = $select.attr('name');
      selectChange($select);
      return $select.off('change').on('change', function() {
        return selectChange($select);
      });
    };
    return this.each(function() {
      var $select;
      $select = $(this);
      $select.attr('data-dependent-input-name', $select.attr('name'));
      selectedOption($select);
      prepareSelect($select, 0, createSelectId());
      return selectPreSelected($select);
    });
  };
})(jQuery);
