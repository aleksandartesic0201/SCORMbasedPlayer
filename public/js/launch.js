function scorm_openpopup(url, name, width, height, popup_launch, redirect, status) {

    if (width <= 100) {
        width = Math.round(screen.availWidth * width / 100);
    }
    if (height <= 100) {
        height = Math.round(screen.availHeight * height / 100);
    }
    var options = ",width=" + width + ",height=" + height;    
    var params = "?urls=" + url + "&name=" + options + "&name=" + name + "&width=" + width + "&height=" + height + "&status=" + status + "&redirect=" + redirect;

    if (status == 'true') {
        window.document.location.href = popup_launch + params;
    }
    else {
        window.document.location.href = url;
    }
}
function CallLaunch() {
    alert(1);
}
function launchCourse(name, width, height, status, redirect) {

    document.getElementById("PopupBlocked").style.display = 'none';
    document.getElementById("PossiblePopupBlockerMessage").style.display = 'block';    

    if (width <= 100) {
        width = Math.round(screen.availWidth * width / 100);
    }
    if (height <= 100) {
        height = Math.round(screen.availHeight * height / 100);
    }
    var options = ",width=" + width + ",height=" + height;

    var windowobj = window.open('about:blank', name, options);
    document.getElementById('theForm').submit();       

    window = windowobj;

    setTimeout(function timeout() {
        
        if (windowobj.closed) {
            window.parent.document.location.href = redirect;
        } else {
          setTimeout(timeout, 300);
        }
    }, 300);

    windowobj.focus();
    return windowobj;
}