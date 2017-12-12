/**
 * Created by Palazyuk.A on 1/3/2017.
 */
app.directive("oneTweet", function () {
    return {

        template: "<div class='tweet element'><img class='user-img' ng-src=\"{{x.screen_image_url}}\"/>" +
        "<h5>{{x.screen_name}}</h5>" +
        "<p class='date'> {{x.dateCreated}}</p>" +
        "<div class='content'>{{ x.text}}</div>" +
        "<img class='tweet-img' ng-src='{{x.image}}'>" +
        "<div ng-if='x.subscribe == \"Subscribe\"'>" +
        "<input class='btn btn-default btn-subscribe' type='button' value='{{x.subscribe}}' ng-click='subscribe(x.screen_name,x.screen_image_url)'/>" +
        "</div>" +
        "<div ng-if='x.subscribe == \"Unsubscribe\"'>" +
        "<input class='btn btn-default btn-unsubscribe' type='button' value='{{x.subscribe}}' ng-click='unsubscribe(x.screen_name)'/>" +
        "</div>" +
        "</div>"


    };
});
