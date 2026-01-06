var colors = new Array([62,35,255], [60,255,60], [255,35,98], [45,175,230], [255,205,41], [255,0,255], [255,128,0]);
var gradientTimer, timer, step = 0, colorIndices, gradientSpeed = 0.02, deg, gradTextSupp, menuScroll, homeopen = true;

function parameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function cssPropertyValueSupported(prop, value) {
    var d = document.createElement('div');
    d.style[prop] = value;
    return d.style[prop] === value;
}
$(document).ready(function () {
  if (localStorage.getItem("dark") === "true" || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem("dark") === "false")) {
    $("body, html").addClass("dark");
    $("#checkbox").attr("checked", true);
  } else if (localStorage.getItem("dark") === null) {
    var time = (new Date()).getHours();
    if (time >= 6 && time <= 18) {
      $("body, html").addClass("dark");
      $("#checkbox").attr("checked", true);
    }
  }

  if ($(window).scrollTop() > 1) homeopen = false;
  if (parameter("s") == "y") {
    $("body").addClass("contact-open");
    $("#contact-bin").css("display", "inline-block").html("<i class='fas fa-check-circle'></i> Your message has been successfully sent!");
    setTimeout(function () { $("#contact-bin").css("margin-bottom", "-40px").fadeOut(300) }, 2000);
  }

  step = parseFloat(localStorage.getItem("step"));
  if (isNaN(step)) step = 0;

  colorIndices = JSON.parse(localStorage.getItem("colorIndices"));
  if (localStorage.getItem("colorIndices") == null) colorIndices = [0, 1, 2, 3, 4, 5, 6];

  deg = parseInt(localStorage.getItem("deg"));
  if (isNaN(deg)) deg = 180;

  gradientTimer = setInterval(updateGradient, 300);

  //Apply default filter on initial load so data-hide-all works immediately
  setTimeout(function () {
    $('.portfolio-filter[data-query=""]').trigger('click');
  }, 0);
});


// About text swap (Portfolio tabs)
var ABOUT_DEFAULT_HTML = null;

var ABOUT_GTPL_HTML =
  "<p><b>Propulsive Landers @ Georgia Tech</b> is the student organization I founded to pursue vertical take-off and vertical landing (VTVL) technologies using hybrid propulsion. It is the brainchild of my work and vision at Georgia Tech carried over from my previous experiences at the Advanced Rocket Research Center and the Taiwan Space Agency (TASA).</p><p>As its Founder and President, I have grown the team from 0 to 100 members within a year, led it to become one of the largest engineering organizations on campus, and secured support from over 25 industry sponsors. Beyond the responsibilities of a typical president, however, I serve as the project lead that remains directly involved in and oversees all technical efforts across the team including system architecture (/systems engineering), propulsion-related projects, and vehicle integration.</p><p>Of course, none of this work would have been possible without my team and while I have my own technical contributions it is them who brought it to life. The work you explore under this section is a collaborative effort from the amazing team here at Propulsive Landers. Hope you enjoy reading through them and shoot me an email if you have any questions.</p>";
var aboutMode = "default"; // tracks whether we're in GTPL mode


function setAboutText(html, animate) {
  var el = $("#about-text");
  if (!el.length) return;

  // Capture default text once
  if (ABOUT_DEFAULT_HTML === null) ABOUT_DEFAULT_HTML = el.html();

  // Fallback safety
  if (html == null) html = ABOUT_DEFAULT_HTML;

  // No-op if already the same
  if (el.html() === html) return;

  // Instant swap (no animation)
  if (!animate) {
    el.removeClass("about-text-exit about-text-enter about-text-enter-active");
    el.html(html);
    return;
  }

  // Animated swap
  el.removeClass("about-text-enter about-text-enter-active")
    .addClass("about-text-exit");

  setTimeout(function () {
    el.html(html);

    el.removeClass("about-text-exit")
      .addClass("about-text-enter");

    // force reflow
    el[0].offsetHeight;

    el.addClass("about-text-enter-active");
  }, 300);
}


window.addEventListener('scroll', function(event){
    var scrollTop = $(window).scrollTop();
    if (scrollTop == 0){
        $("#one").css("height", "100vh");
        document.title = 'Home - Rulko.ca';
    }else{
        $("#one").css("height", "1px");
        document.title = 'Portfolio - Rulko.ca';
    }
    if ($("body").hasClass("menu-open")) $("body").removeClass("menu-open");
});

$("#one").click(function(){$(window).scrollTop(1)});

function updateGradient(){
	deg = 90;
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
	$('head').append('<style class="destroyme">.close:hover:before, .close:hover:after, .showcase .button:hover:before, .showcase-button-special:hover:before, .a-special:before{background: -webkit-linear-gradient(45deg,' + color1 + ', ' + color2 + ');background: -webkit-linear-gradient(45deg,' + color1 + ', ' + color2 + ')}</style>');
	
    if (cssPropertyValueSupported('background-clip', 'text') || cssPropertyValueSupported('-webkit-background-clip', 'text')){
        $(".bigcheese, .contact-button i, .title").css({
            "background":'-webkit-linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')',
            "background":'linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')',
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "background-clip": "text",
            "text-fill-color": "rgba(0,0,0,0.01)"
        });
    }else{
        $(".bigcheese, .contact-button i, .title").css({
            "color" : color1
        });
    }
    $(".menu, .tag").css({
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
    //if (deg < 45) deg += 0.5;
    //else deg = 0;

    $("body").removeClass("is-loading");
}

$(".portfolio-filter").click(function () {
  var query = (($(this).attr("data-query") || "") + "").trim();
  var el = $(this);

  updateFilters();

  // -------------------------------
  // ABOUT TEXT BEHAVIOR (KEY PART)
  // -------------------------------
  if (query === "gtpl") {
    if (aboutMode !== "gtpl") {
      setAboutText(ABOUT_GTPL_HTML, true); // animate IN
      aboutMode = "gtpl";
    }
  } else {
    if (aboutMode === "gtpl") {
      setAboutText(ABOUT_DEFAULT_HTML, true); // animate OUT
      aboutMode = "default";
    }
    // All / Career / Projects / Research:
    // do NOTHING → text stays static
  }

  // -------------------------------
  // PORTFOLIO FILTERING
  // -------------------------------
  $(".portfolio-item")
    .css("display", "block")
    .addClass("item-hidden");

  setTimeout(function () {
    $(".portfolio-item").css("display", "none");

    $(".portfolio-item").each(function () {
      var $obj = $(this);

      var tagString = (($obj.attr("data-tags") || "") + "").trim();
      var tags = tagString.length ? tagString.split(/\s+/) : [];

      var hideFromAll =
        ((($obj.attr("data-hide-all") || "") + "").toLowerCase() === "true");

      var matchesQuery = (query === "" || tags.includes(query));
      var allowedInAll = !(query === "" && hideFromAll);

      if (matchesQuery && allowedInAll) {
        $obj.removeClass("item-hidden").css("display", "block");
      }
    });
  }, 200);

  // -------------------------------
  // FILTER UNDERLINE
  // -------------------------------
  $(window).off("resize.portfolio").on("resize.portfolio", function () {
    updateFilters();
  });

  function updateFilters() {
    $(".portfolio-filter-style").remove();

    $("head").append(
      '<style class="portfolio-filter-style">' +
        '.portfolio-filters:before{' +
          'width:' + el.outerWidth() + 'px;' +
          'left:' +
            (el.offset().left - $(".portfolio-filters").offset().left) +
          'px}' +
      "</style>"
    );
  }
});

$(".menu-item").click(function(){
    var target = $(this).attr("data-target");
    $("body").removeClass("menu-open");
    if(target == "home"){
        $(window).scrollTop(0);
    }else if(target == "portfolio"){
        $(window).scrollTop(2);
    }else if(target == "contact"){
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

window.onbeforeunload = function(){save()};
window.addEventListener("beforeunload", function(e){save()}, false);

function save(){
    clearInterval(gradientTimer); localStorage.setItem("colorIndices",JSON.stringify(colorIndices));
    localStorage.setItem("step",step);
    localStorage.setItem("deg",deg);
}

$('.preload').load(function(){
   $(this).css('background','none');
});