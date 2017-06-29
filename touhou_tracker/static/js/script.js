
function updateEditability(){
    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null) .cell-inner').each(function(){
        if($(this).parent().hasClass('filled')){
            $(this)[0].contentEditable=true;
            $(this)[0].spellcheck = false;
        } else {
            $(this)[0].contentEditable=false;
        }
    });
}

function adjustFontSize($elem){
    if($elem.text().length > 4){
        $elem.css('line-height', '9.333px');
        $elem.css('font-size', '13px');
    } else {
        $elem.css('line-height', '14px');
        $elem.css('font-size', '14px');
    }
}

function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function saveData(){
    var track_data = {};
        $('.table').each(function(){
            var game = $(this).attr('data-game');
            track_data[game] = {};
            $(this).children('.row:not(:last-child)').each(function(){
                var diff = $(this).children('.cell').first().text();
                track_data[game][diff] = [];
                $(this).children('.cell:not(:first-child)').each(function(){
                    if($(this).hasClass('filled')){
                        if($(this).text()) { track_data[game][diff].push($(this).text()); }
                        else { track_data[game][diff].push(true); }
                    } else if($(this).hasClass('filled')){
                        track_data[game][diff].push(null);
                    } else {
                        track_data[game][diff].push(false);
                    }

                });
            });
        });
        var color_data = {};
        $('.bullet').each(function(){
            var game = $(this).parent().parent().find('.table').attr('data-game');
            color_data['c_' + game] = rgb2hex($(this).css('color'));
        });
        track_data = JSON.stringify(track_data);
        color_data = JSON.stringify(color_data);
        $.ajax({
            type: "POST",
            url: '',
            data: {
                method: 'save',
                pass: $('#tracker-password').val(),
                track_data: track_data,
                color_data: color_data,
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function(data){
                console.log(data);

                if(data.status == 2){
                    $('#tracker-save').addClass('btn-danger');
                    $('#tracker-save').html('Incorrect Password! <i class="fa fa-times" aria-hidden="true"></i>');
                } else if(data.status === 0){
                    $('#tracker-save').addClass('btn-success');
                    $('#tracker-save').html('Saved! <i class="fa fa-check" aria-hidden="true"></i>');
                }
                setTimeout(function(){
                    $('#tracker-save').removeClass('btn-success btn-danger');
                $('#tracker-save').html('Save');
                },2000);
            },
        });
}

$(function(){
    updateEditability();
    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null) .cell-inner').each(function(){
        adjustFontSize($(this));
    });

    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null)').on('blur', function(){
        updateEditability();
    });

    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null) .cell-inner').on('input', function(){
        adjustFontSize($(this));
    });

    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null) .cell-inner').on('keypress', function(ev){
        if(String.fromCharCode(ev.which).match(/[\S]/i)){
            return (this.innerText.length < 9);
        }
        return false;
    });


    $('.bullet').on('click', function(){
        $(this).after('<input type="color" id="color-selector" value="' + rgb2hex($(this).css('color')) + '" class="hidden"/>');
        $("#color-selector").click();
    });

    $(document).on('change', '#color-selector', function(){
        var game = $(this).parent().parent().find('.table').attr('data-game');

        $('#custom-colors').append(
        '.' + game + ' .bullet{color: ' + $(this).val() + '}' +
        '.' + game + ' > .panel-body > .table > .row > .cell.filled{background-color: ' + $(this).val() + ';}'
        );

        $(this).remove();
    });

    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null)').on('click contextmenu', function(ev){
        var isRightMB;
        ev = ev || window.event;

        if ("which" in ev)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = ev.which == 3;
        else if ("button" in ev)  // IE, Opera
            isRightMB = ev.button == 2;

        if(!isRightMB){
            if($(this).hasClass('filled') && !$(this).text()){
                $(this).removeClass('filled');
                $(this).children('.cell-inner').blur();
                $(this).children('.cell-inner').html('');
            } else {
                $(this).addClass('filled');
                $(this).children('.cell-inner').blur();
            }
            updateEditability();
        }
    });

    $('#tracker-save').click(function(){
        saveData();
    });

    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                saveData();
                break;
            }
        }
    });

    $("#shareable_link").click(function(){
        var new_url = '';
        $.ajax({
            type: "POST",
            url: '',
            data: {
                method: 'share',
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            async: false,
            success: function(data){
                new_url = data.share_url;

                var textarea = document.createElement("textarea");
                textarea.textContent = new_url;
                textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                document.body.appendChild(textarea);
                textarea.select();

                try {
                    document.execCommand("copy");
                    $('#shareable_link').addClass('btn-success');
                    $('#shareable_link').html('Copied! <i class="fa fa-check" aria-hidden="true"></i>');
                } catch (ex) {
                    $('#shareable_link').addClass('btn-danger');
                    $('#shareable_link').html('Failed! <i class="fa fa-times" aria-hidden="true"></i>');
                } finally {
                    document.body.removeChild(textarea);
                    setTimeout(function(){
                            $('#shareable_link').removeClass('btn-success btn-danger');
                        $('#shareable_link').html('Share');
                    },2000);
                }

            },
        });



    });

});
