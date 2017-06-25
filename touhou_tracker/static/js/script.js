
function updateEditability(){
    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null) .cell-inner').each(function(){
        if($(this).parent().hasClass('filled')){
            $(this)[0].contentEditable=true;
            $(this)[0].spellcheck = false;
            if($(this).text().length > 4){
                $(this).css('line-height', '9.333px');
                $(this).css('font-size', '13px');
            } else {
                $(this).css('line-height', '14px');
                $(this).css('font-size', '14px');
            }
        } else {
            $(this)[0].contentEditable=false;
        }
    });
}

$(function(){
    updateEditability();

    $('.table .row:not(:last-child) .cell:not(:first-child):not(.null)').on('blur', function(){
        updateEditability();
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
        json_data = JSON.stringify(track_data);
        $.ajax({
            type: "POST",
            url: '',
            data: {
                method: 'save',
                pass: $('#tracker-password').val(),
                data: json_data,
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
    });

    $("#shareable_link").click(function(){
        $.ajax({
            type: "POST",
            url: '',
            data: {
                method: 'share',
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function(data){

            },
        });


        var textarea = document.createElement("textarea");
        textarea.textContent = window.location.href.replace('edit', 'view');
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
    });

});
