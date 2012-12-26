
function updateHoursSumInformer() {
    var sum = 0;
    $('input:[name^=hours_]').each(function(index) {
                sum = sum + parseFloat($(this).val());
            })
    if(isNaN(sum)) {
        sum = '!';
    }
    $('#hours_sum_informer').text(sum);
    setTimeout(updateHoursSumInformer, 500);
}

function addHoursSumInformer() {
    var html = '<div style="width: 80px; height: 20px; position: absolute; right: 20px; top: 34px; background-color: rgba(101, 150, 211, 0.8);'
    + ' color: white; border: black solid 1; padding-left: 20px; border-radius: 10;" id="hours_sum_informer_container">'
    + 'Sum: <span id="hours_sum_informer"></span> h</div>';
    $("body").append(html);
    
    $(window).scroll(function(e){
        var newPosition = $(window).scrollTop() + 34;
        $('#hours_sum_informer_container').css('top', newPosition);
    });
    setTimeout(updateHoursSumInformer, 500);
}

function collapseButtonHTML(index) {
    var id = 'btn_colapse_' + index;
    id = '"' + id + '"';
    var html = '<button id=' + id + ' onclick="this">-</button>';
    
    return html;
}

function addCollapseButtonsListener() {
    $('[id^=btn_colapse_]').click(toggleCollapse);
}
 
function toggleCollapse(object){
	if (object.target.innerHTML == '+') {
        $(object.target).parents('[id^=task]').find('[id^=report]').show();
        object.target.innerHTML = '-'
    } else {    
        $(object.target).parents('[id^=task]').find('[id^=report]').hide();
        object.target.innerHTML = '+';
    }
}

function collapseNotEdited() {
    var tasks = $('[id^=task_]:has([id^=report_]:has([id^=hours_][value="0.0"]))');
    tasks.find('[id^=report_]').hide();
    tasks.find('[id^=btn_colapse_]').html('+');
}

(function(window, undefined ) {

    var w;
    w = window;   
  
    if (w.self != w.top){
        return;
    }
      
    if (w.location.href.indexOf('reports') > 0) {
        addHoursSumInformer();
        
        $('input:[name^=hours_]').each(function(index) {
                $(this).attr('id', 'hours_' + index);
            })
        $('td > table:has(input[id^=hours_])').each(function(index) {        
                $(this).attr('id', 'task_' + index);
                $(this).find('tr:eq(3)').attr('id', 'report_' + index);
                $(this).find('td>span>a').parent().before(collapseButtonHTML(index));
            })
         
        addCollapseButtonsListener();
        collapseNotEdited();
    }
    
})(window);