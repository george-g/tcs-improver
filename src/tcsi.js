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
 
function updateTopPage() {
    $("body").css('padding-top', '110px');
    var t1 = $("body").find("table:eq(0)").addClass('topTable');
    
    var html = 'Sum: <span id="hours_sum_informer"></span> h';
    var sumHElement = t1.find('td[width="100%"][valign!="center"]');
    sumHElement.append(html);
    sumHElement.addClass('head').addClass('sumHoursContainer');
    setTimeout(updateHoursSumInformer, 500);
    
    var t2 = $('form').first().find("table:eq(0)").addClass('topTableSecond');;
} 
 
function toggleCollapse(object){
    object = $(object.target);
    if(object.prop("tagName") == 'A') {
        return;
    } else if(object.prop("tagName") == 'SPAN') {
        object = object.parent();
    }
    if (object.attr('toggle') == '-') {
        object.parents('[id^=task]').find('[id^=report]').show();
        object.attr('toggle','+');
    } else {    
        object.parents('[id^=task]').find('[id^=report]').hide();
        object.attr('toggle','-');
    }
}

function collapseNotEdited() {
    var tasks = $('[id^=task_]:has([id^=report_]:has([id^=hours_][value="0.0"]))');
    tasks.find('[id^=report_]').hide();
    tasks.find('table').find('td').attr('toggle','-');
}

function addSortControls() {
    var html = '<span class="name" style="padding-left: 20px">Sort tasks by: </span>' 
        + '<input type="button" id="sort_by_name" value="name" class="button"> '
        + '<input type="button" id="sort_by_id" value="id" class="button">';

    var parent = $('input[name="change_date"]').parent();
    parent.find('br').remove();
    parent.append(html);
    parent.attr('width','60%');
    parent.parent().find('td[width="99%"]').attr('width','1%');
    $('#sort_by_name').click(sortTasksByName);
    $('#sort_by_id').click(sortTasksByID);
}

function appendZero(s) {
    while(s.length < 5) {
        s = '0'+s;
    }
    return s;
}

function sortTasksByID() {
    sortTasks('id');
}

function sortTasksByName() {
    sortTasks('name');
}

function sortTasks(type) {
    $('fieldset').each(function() {
        var tables = {};
        var keys = [];
        $(this).children('table').each(function() {
            if(type=='id') {
                k = appendZero($(this).attr('task_id'));
            } else {
                k = appendZero($(this).attr('id').replace('task_',''));
            }
            tables[k] = $(this);
            keys.push(k);
        });
        keys.sort();
        if(type=='name') {
            keys.reverse();
        }
        $(this).children('table').remove();

        var len = keys.length;
        for (i = 0; i < len; i++)
        {
            k = keys[i];
            obj = tables[k];
            obj.find('table').first().click(toggleCollapse);
            $(this).prepend(tables[k]);
        }
    })
}

function toogleSection(obj) {
    obj = $(this);
    if(obj.attr('hide') == 'true') {
        obj.attr('hide', 'false');
        obj.parent().children('table').show();
    } else {
        obj.attr('hide', 'true');
        obj.parent().children('table').hide();
    }
}

function scrollUp() {
    window.scrollTo(0, 0);
}

function addScrollUp() {
    var div = $("<div title=\"scroll up\">");
    div.addClass("scrollUpButton");
    div.click(scrollUp);
    $("body").append(div);
}

(function() {
  
    if (window.self != window.top){
        return;
    }
      
    if (window.location.href.indexOf('reports') > 0) {
        // create NORMAL (not weaved) HTML <form>
        var reportForm = $('form').first();
        var formElements = reportForm.parent();
        reportForm.insertAfter('table:first');
        reportForm.append(formElements);
        
        // add attribute id='hours_xxx'
        $('input:[name^=hours_]').each(function(index) {
                $(this).attr('id', 'hours_' + index);
            })
        // add attributes id=task_xxx, id=report_xxx
        $('td > table:has(input[id^=hours_])').each(function(index) {        
                $(this).attr('id', 'task_' + index);
                a = $(this).find('a');
                a.parent().append(a.text());
                newA = $(document.createElement('a'));
                newA.text('open task').attr('href', a.attr('href')).attr('target','_blank');
                a.parent().append(' ').append(newA);
                a.remove();
                $(this).attr('task_id', getParameterByName('task_id',$(this).find('a').attr('href')));
                $(this).find('tr:eq(3)').attr('id', 'report_' + index);
                $(this).find('table').first().click(toggleCollapse);
                $(this).find('table').find('td').attr('toggle','+').attr('onselectstart','return false;').addClass('toggledSection');
            })
        collapseNotEdited();
        
        addSortControls();
        
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
                    .append(legendSpan)
                    .attr('onselectstart','return false;')
                    .attr('hide', 'false')
                    .click(toogleSection);
            var fielset = $(document.createElement('fieldset'))
                    .attr('id', 'id="project_' + projectId )
                    .attr('project_id', projectId)
                    .append(legend)
                    .append(fieldsetOnTable.find('table[id^=task_]'));
            reportForm.append(fielset);
            fieldsetOnTable.remove();
        })
        
        updateTopPage();
        
    } else if (window.location.href.indexOf('requests/info') > 0) {        
        // delete &nbsp; for hide horizontal scroll bar
        var elements = document.body.getElementsByClassName("text");
        for(var i = 0; i<elements.length; i++) {
            elements[i].innerHTML = elements[i].innerHTML.replace(/&nbsp;/g, ' ');
        }
        // resize textarea with bug description by content
        document.getElementsByName("desc")[0].style.height = 25 + document.getElementsByName("desc")[0].scrollHeight + "px";
    } else if (window.location.href.indexOf('dialog_name=') > 0) {        
        // resize window
        var height = $('#MAINTABLE')[0].scrollHeight + 100;
        console.log($('#MAINTABLE')[0].scrollHeight, height);
        window.setTimeout(function() {window.resizeTo(800,height);}, 100);
    } else if (window.location.href.indexOf('bugs/info') > 0) {        
        // resize textarea with bug description by content
        document.getElementsByName("desc")[0].style.height = 25 + document.getElementsByName("desc")[0].scrollHeight + "px";
    }     
    
    addScrollUp();
    
})();