/**
 * Created by Palazyuk.A on 1/3/2017.
 */

app.directive("oneSubscriber", function () {

    return {
        template: "<li class='element subscriber'>" +
        "<img ng-src=\"{{x.photo}}\"/> <p>{{x.name}}</p>" +
        "<div class='subscriber-btns'>" +
        "<input class='btn btn-default btn-unsubscribe' type='button' value='Unsubscribe' ng-click='unsubscribe(x.name)'/>" +
        "<input class='btn btn-default btn-tweets' type='button' value='Tweets' ng-click='searchUsersTweets(x.name,x.photo)'/>" +
        "</div>" +
        "</li>"

    };
});