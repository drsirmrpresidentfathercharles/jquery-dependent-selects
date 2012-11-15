// Generated by CoffeeScript 1.4.0
(function() {

  (function($) {
    return $.fn.dependentSelects = function(options) {
      var clearAllSelectsByParent, createNewSelect, prepareSelect, splitOptionName;
      if (options == null) {
        options = {};
      }
      options = $.extend({
        'separator': ' > '
      }, options);
      splitOptionName = function($option) {
        return _.without($option.text().split(options['separator']).map(function(valuePart) {
          return valuePart.trim();
        }), '');
      };
      clearAllSelectsByParent = function($parent) {
        return $(".dependent-sub[data-dependent-input-name='" + ($parent.attr('data-dependent-input-name')) + "']").each(function() {
          if (parseInt($(this).attr('data-dependent-depth')) > parseInt($parent.attr('data-dependent-depth'))) {
            $(this).find('option:first').attr('selected', 'selected');
            return $(this).hide();
          }
        });
      };
      createNewSelect = function(options) {
        var $currentSelect, $newSelect, $select, name;
        if (options == null) {
          options = {};
        }
        name = options['name'];
        $select = options['select'];
        if (($currentSelect = $("select[data-dependent-parent='" + name + "']")).length > 0) {
          return $currentSelect;
        }
        $newSelect = $('<select class="dependent-sub"/>').attr('data-dependent-parent', name).attr('data-dependent-depth', options['depth']).attr('data-dependent-input-name', $select.attr('data-dependent-input-name')).append('<option/>');
        $newSelect.insertAfter($select);
        return $newSelect.hide();
      };
      prepareSelect = function($select, depth) {
        var $options, name;
        $select.attr('data-dependent-depth', depth);
        $options = $select.children('option');
        $options.each(function() {
          var $newOption, $option, $subSelect, name, val;
          $option = $(this);
          name = splitOptionName($option);
          val = $option.val();
          if (name.length > 1) {
            $subSelect = createNewSelect({
              name: name[0],
              select: $select,
              depth: depth + 1
            });
            $newOption = $option.clone();
            $newOption.html(splitOptionName($newOption).slice(1).join(options['separator']).trim());
            $subSelect.append($newOption);
            $option.val(val).html(name[0]).attr('data-dependent-name', name[0]);
            if ($options.parent().find("[data-dependent-name='" + name[0] + "']").length > 1) {
              $option.remove();
            }
            return prepareSelect($subSelect, depth + 1);
          }
        });
        name = $select.attr('name');
        return $select.off('change').on('change', function() {
          var $sub, val, valName;
          $('select[name]').removeAttr('name');
          valName = $select.find(':selected').html();
          val = $select.val();
          clearAllSelectsByParent($select);
          if (($sub = $(".dependent-sub[data-dependent-parent='" + valName + "']")).length > 0) {
            $sub.show();
            return $sub.attr('name', $select.attr('data-dependent-input-name'));
          } else {
            return $select.attr('name', $select.attr('data-dependent-input-name'));
          }
        });
      };
      return this.each(function() {
        var $select;
        $select = $(this);
        $select.attr('data-dependent-input-name', $select.attr('name'));
        return prepareSelect($select, 0);
      });
    };
  })(jQuery);

}).call(this);
