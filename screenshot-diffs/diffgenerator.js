resemble.outputSettings({
    errorColor: {
        red: 255,
        green: 0,
        blue: 0,
        alpha: 125
    },
    errorType: 'movement',
    transparency: 0.3
});

function compareImages(expected, expectedGithub, processed)
{
    resemble(processed).compareTo(expected).onComplete(function(data){

        var info = 'Mismatch percentage: ' + data.misMatchPercentage + '%';

        if (data.dimensionDifference && !data.isSameDimensions) {
            info += ' Dimension difference width: ' + data.dimensionDifference.width + ' height: ' + data.dimensionDifference.height;
        }

        $('.info').text(info);
        $('.diff').attr('src', data.getImageDataUrl());
    });

    $('.expected')[0].src = expected;
    $('.expectedGithub')[0].src = 'https://raw.githubusercontent.com/piwik/piwik-ui-tests/master/expected-ui-screenshots/' + expectedGithub;
    $('.processed')[0].src = processed;
}

function getUrlQueryParam(sParam) {
    var query     = window.location.search.substring(1);
    var variables = query.split('&');

    for (var index = 0; index < variables.length; index++) {

        var sParameterName = variables[index].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

$(function () {
    var processed = getUrlQueryParam('processed');
    var expected  = getUrlQueryParam('expected');
    var github    = getUrlQueryParam('github');
    compareImages(expected, github, processed);
});