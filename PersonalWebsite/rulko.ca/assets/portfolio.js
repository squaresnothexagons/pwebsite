var colors = new Array([62,35,255], [60,255,60], [255,35,98], [45,175,230], [255,205,41], [255,0,255], [255,128,0]);
var gradientTimer, timer, step = 0, colorIndices, gradientSpeed = 0.02, deg, gradTextSupp, menuScroll;

function parameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function cssPropertyValueSupported(prop, value) {
    var d = document.createElement('div');
    d.style[prop] = value;
    return d.style[prop] === value;
}

$(document).ready(function(){
    if (localStorage.getItem("dark") === "true" || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem("dark") === "false")){
        $("body, html").addClass("dark");
        $("#checkbox").attr("checked",true);
    }else if (localStorage.getItem("dark") === null){
        var time = (new Date()).getHours();
        if (time >= 6 && time <= 18){
            $("body, html").addClass("dark");
            $("#checkbox").attr("checked",true);
        }
    }
    if (parameter("s") == "y"){
        $("body").addClass("contact-open");
        $("#contact-bin").css("display","inline-block").html("<i class='fas fa-check-circle'></i> Your message has been successfully sent!");
        setTimeout(function(){$("#contact-bin").css("margin-bottom","-40px").fadeOut(300)},2000);
        window.history.pushState("object or string", "Title", (window.location.href).split('?')[0]);
    }
    if (parameter("l") == "y"){
        $(".login-success").html("<i class='fas fa-check-circle'></i> You have been logged out!")
        window.history.pushState("object or string", "Title", (window.location.href).split('?')[0]);
    }
    step = parseFloat(localStorage.getItem("step"));
    if (isNaN(step)) step = 0;

    colorIndices = JSON.parse(localStorage.getItem("colorIndices"));
    if (localStorage.getItem("colorIndices") == null) colorIndices = [0,1,2,3,4,5,6];

    deg = parseInt(localStorage.getItem("deg"));
    if (isNaN(deg)) deg = 180;

    gradientTimer = setInterval(updateGradient,300);
});

function updateGradient(){
    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')';

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';

	$(".destroyme").each(function(){$(this).remove()});
    $('head').append('<style class="destroyme">.close:hover:before, .close:hover:after, .showcase .button:hover:before, .showcase-button-special:hover:before{background: -webkit-linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ');background: -webkit-linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')}</style>');
    
    if (cssPropertyValueSupported('background-clip', 'text')){
        $(".contact-button i").css({
            "background":'-webkit-linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')',
            "background":'linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')',
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "background-clip": "text",
            "text-fill-color": "rgba(0,0,0,0.01)"
        });
    }else $(".contact-button i").css("color", color1);
    
    $(".menu, .wishlist-item-tag").css({
        "background-image":'-webkit-linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')',
        "background-image":'linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')'
    });
    step += gradientSpeed;
    if (step >= 1){
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    }
    if (deg < 360) deg += 0.5;
    else deg = 0;

    $("body").removeClass("is-loading");
}

$(".menu-item").click(function(){
    var target = $(this).attr("data-target");
    $("body").removeClass("menu-open");
    if(target == "contact"){
        $("body").addClass("contact-open");
    }
});     
// Hamburger Menu Open
$(".hamburger").hover(function(){$("body").addClass("menu-open")}, function(){});
$(".hamburger").click(function(){$("body").toggleClass("menu-open")});
$(".wrapper, .contact").hover(function(){$("body").removeClass("menu-open")}, function(){});

// Contact Open
$(".contact-button").hover(function(){$("body").toggleClass("contact-open")}, function(){});
$(".contact-button").click(function(){$("body").toggleClass("contact-open")});
$(".contact").click(function(){$("body").addClass("contact-open")});
$(".wrapper").hover(function(){$("body").removeClass("contact-open")}, function(){});

// Dark Mode Toggle
$('#checkbox').change(function() {
    $("body, html").toggleClass("dark");
    localStorage.setItem("dark",($("body").hasClass("dark")).toString());
});

$('.pc-toggle').click(function() {
    ($(this).parent().parent().find(".browser-window")).css("display","block");
    ($(this).parent().parent().find(".browser-window-mobile")).css("display","none");
});
$('.mobile-toggle').click(function() {
    ($(this).parent().parent().find(".browser-window")).css("display","none");
    ($(this).parent().parent().find(".browser-window-mobile")).css("display","block");
});

window.onbeforeunload = function(){save()};
window.addEventListener("beforeunload", function(e){save()}, false);

function save(){
    clearInterval(gradientTimer); localStorage.setItem("colorIndices", JSON.stringify(colorIndices));
    localStorage.setItem("step",step);
    localStorage.setItem("deg",deg);
}

$('.preload').load(function(){
   $(this).css('background','none');
});

/*var prevScroll = 0, working = false, prevDivTop, prevDivBottom;
window.addEventListener('scroll', function(event){
    if (!working){
        working = true;
        var aggregateHeight1 = $("section:nth-of-type(1)").height(), aggregateHeight2 = $("section:nth-of-type(1)").height();
        var divTop = 1, divBottom = 1;
        var scrollTop = $(window).scrollTop(), scrollBottom = $(window).scrollTop() + $(window).innerHeight();
        while (aggregateHeight1 < scrollTop){
            divTop += 1;
            aggregateHeight1 += $("section:nth-of-type(" + divTop + ")").height();
        }
        while (aggregateHeight2 < scrollBottom){
            divBottom += 1;
            aggregateHeight2 += $("section:nth-of-type(" + divBottom + ")").height();
        }
        if((scrollTop > prevScroll) && (divBottom != 9)){ // Scrolling Down
            if (prevDivBottom < divBottom){
                $('html, body').animate({scrollTop: ($("section:nth-of-type(" + (divInt + 1) + ")").offset().top + "px")}, 150);
                event.preventDefault();
            }
        }else if ((scrollTop < prevScroll) && (divTop != 1)){ // Scrolling Up
            if (prevDivTop < divTop){
                $('html, body').animate({scrollTop: ($("section:nth-of-type(" + (divInt - 1) + ")").offset().bottom + "px")}, 150);
                event.preventDefault();
            }
        }
        prevScroll = scrollTop;
        prevDivTop = divTop;
        prevDivBottom = divBottom;
        working = false;
    }
});*/