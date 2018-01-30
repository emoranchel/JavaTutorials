//var BASEPATH = 'oracle/learning-library/master/';
//var RAWPATH = 'https://raw.githubusercontent.com/oracle/learning-library/master/';

var BASEPATH = 'emoranchel/JavaTutorials/master/';
var RAWPATH = 'https://raw.githubusercontent.com/' + BASEPATH;

// http://127.0.0.1:5500/index.html?obe=workshops%2Fmicroservices%2FCloudNative100.json#RequiredArtifacts

$(function () {
    var jsonurl = RAWPATH + getUrlParameter("obe");
    $.ajax(jsonurl).done(function (configtxt) {
        var config = JSON.parse(configtxt);

        var markdownurl = RAWPATH + config.context + '/' + config.markdown;
        $.ajax(markdownurl).done(function (readmedata) {
            var startIndex = 0;
            var lines = readmedata.split('\n');

            if (!config.title) {
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].startsWith("# ")) {
                        config.title = lines[i].substr(2, lines[i].lastIndexOf('#') - 2);
                        lines.splice(0, i + 1);
                        break;
                    }
                }
            }
            //Images!
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("![") >= 0) {
                    lines[i] = lines[i].replace('](', '](' + RAWPATH + config.context + '/');
                }
            }
            readmedata = lines.join('\n');

            $('#mainTitle').html(config.title);
            $('title').html(config.title);

            $.ajax("https://api.github.com/markdown", {
                method: "POST",
                data: JSON.stringify({
                    text: readmedata,
                    mode: "gfm",
                    context: BASEPATH + config.context
                })
            }).done(function (htmlData) {
                var lines = htmlData.split('\n');
                var first = true;
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].indexOf("<h2>") >= 0) {
                        lines.splice(i,0,first?"<section>":"</section><section>");
                        first=false;
                    }
                }
                lines.push("</section>")
                $("#DOCCONTENTMAIN").append(lines.join('\n'));

                var toc = $("#toc").tocify({
                    selectors: "h2,h3,h4,h5"
                }).data("toc-tocify");

                //prettyPrint();
                //$(".optionName").popover({ trigger: "hover" });

                //sets options
                toc.setOptions({ extendPage: false, showEffect: "fadeIn", smoothScroll: false });
            });



        });
    });
});

$(window).load(function () {
    $("select#lodpages").each(function () {
        $(this).val($(this).find('option[selected]').val());
    });
});


function addCss(rules, id) {
    var style = document.createElement('style');
    style.setAttribute("id", id);
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = rules;
    } else {
        style.appendChild(document.createTextNode(rules));
    }
    document.getElementsByTagName("head")[0].appendChild(style);
}

if (window.top !== window) {
    var rules = "body > header, #content > .margin-left, .footer-container { display: none; }";
    rules += "#content, #content > .w1024 { margin-top: 0 !important; }";
    addCss(rules, "hideChromeStyle");
}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};