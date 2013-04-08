function getParameterByName( name,href ) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( href );
    if( results == null )
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

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
    var html = '<div style="width: 150px; height: 22px; position: absolute; right: 90px; top: 33px; background-color: rgba(101, 150, 211, 0.8);'
    + ' color: white; border: black solid 1; padding-left: 20px; border-radius: 10;" id="hours_sum_informer_container">'
    + '<input type="button" name="Confirm" value="Confirm" class="button" '
    + 'onclick="document.getElementById(\'subConfirm\').name=\'Confirm\'; document.getElementById(\'subConfirm\').value=\'Confirm\'; document.forms[0].submit()"> '
    + 'Sum: <span id="hours_sum_informer"></span> h</div>';
    $("body").append(html);
    $("form").append("<input id=\"subConfirm\" type=\"hidden\">");
    
    $(window).scroll(function(e){
        var newPosition = $(window).scrollTop() + 33;
        $('#hours_sum_informer_container').css('top', newPosition);
    });
    setTimeout(updateHoursSumInformer, 500);
}

function collapseButtonHTML(index) {
    var id = 'btn_colapse_' + index;
    id = '"' + id + '"';
    var html = '<span class="collapseButton" id=' + id + ' onclick="this">-&nbsp;</span>';
    
    return html;
}

function addCollapseButtonsListener() {
    $('[id^=btn_colapse_]').click(toggleCollapse);
}
 
function toggleCollapse(object){
    if (object.target.innerHTML == '+') {
        $(object.target).parents('[id^=task]').find('[id^=report]').show();
        object.target.innerHTML = '-&nbsp;'
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

(function() {
  
    if (window.self != window.top){
        return;
    }
      
    if (window.location.href.indexOf('reports') > 0) {
        addHoursSumInformer();
        
        // create NORMAL (not weaved) HTML <form>
        var reportForm = $('form').first();
        var formElements = reportForm.parent();
        reportForm.insertAfter('table:first');
        reportForm.append(formElements);
        
        // add attribute id='hours_xxx'
        $('input:[name^=hours_]').each(function(index) {
                $(this).attr('id', 'hours_' + index);
            })
        // add attributes id=task_xxx, id=report_xxx and colapse button
        $('td > table:has(input[id^=hours_])').each(function(index) {        
                $(this).attr('id', 'task_' + index);
                $(this).find('tr:eq(3)').attr('id', 'report_' + index);
                $(this).find('td>span>a').parent().before(collapseButtonHTML(index));
            })
        
        // change field sets based on table to based on fieldset element
        var fieldsetsOnTable = $('span.top_text').parents('table');
        fieldsetsOnTable.each(function() {
            var fieldsetOnTable = $(this);
            var projectId = getParameterByName( 'project_id', fieldsetOnTable.find('a').first().attr('href') );
            var projectName = fieldsetOnTable.find('span.top_text').text();
            var legendSpan = $(document.createElement('span'))
                    .addClass('top_text')
                    .text(projectName);
            var legend = $(document.createElement('legend'))
                    .append(legendSpan);
            var fielset = $(document.createElement('fieldset'))
                    .attr('id', 'id="project_' + projectId )
                    .attr('project_id', projectId)
                    .append(legend)
                    .append(fieldsetOnTable.find('table[id^=task_]'));
                    //.insertAfter(fieldsetOnTable);
            reportForm.append(fielset);
            fieldsetOnTable.remove();
            /*var fielset =   '<fieldset id="project_' + projectId + '" project_id = "' + projectId + '"  >' +
                                '<legend> <span class="top_text">'+ projectName + '</span> </legend>' +
                            '</fieldset>';
                            */
            //$(fielset).insertAfter(fieldsetOnTable);
            // move tasks to new field set
            //$('fieldset[projectId="' + projectId + '"]').append(fieldsetOnTable.find('table[id^=task_]'));
        })
        
        
        addCollapseButtonsListener();
        collapseNotEdited();
    } else if (window.location.href.indexOf('requests/info') > 0) {        
        // delete &nbsp; for hide horizontal scroll bar in description span (index 13)
        document.body.getElementsByClassName("text")[13].innerHTML = document.body.getElementsByClassName("text")[13].innerHTML.replace(/&nbsp;/g, ' ');
    } else if (window.location.href.indexOf('bugs/info') > 0) {        
        // resize textarea with bug description by content
        document.getElementsByName("desc")[0].style.height = 25 + document.getElementsByName("desc")[0].scrollHeight + "px";
    }     
    
})();