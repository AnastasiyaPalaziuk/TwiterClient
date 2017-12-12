/**
 * Created by Анастасия on 28.12.2016.
 */

app.controller("appController", function ($scope) {

    var isUsersTweets = false;
    var count = 25;
    var cb = new Codebird;
    var _photo = "";
    var _text = "";
    var _name = "";
    var isSearchCall = false;
    var _id = 0;
    cb.setConsumerKey("KqVK3fmeCW3hDi83KfWFqP50b",
        "tXrQP8JTLSn3Kr6JPFQwLfM79ExKfL4HWOGaKQyYQHYkGVXHfh");
    var _foundTweets = {items: []};

    $scope.subscribers = (JSON.parse(localStorage.getItem("subscribers")==null))?localStorage.setItem("subscribers", JSON.stringify({item: []})):JSON.parse(localStorage.getItem("subscribers")).item ;
    $scope.searchTweets = function (text) {
        _id = 0;
        isUsersTweets = false;
        _text = text;
        _foundTweets = {items: []};
        _searchTweets(text);
    }
    $scope.searchUsersTweets = function (name, photo) {
        isUsersTweets = true;
        _id = 0;
        _name = name;
        _photo = photo;
        _foundTweets = {items: []};
        _searchUsersTweets(name, photo);
    };
    $scope.subscribe = function (name, photo) {
        _subscribe(name, photo);

        if(name==_name){
            $scope.foundTweets.items.forEach(function (obj) {
                obj.subscribe="Unsubscribe";
            });
        }

        $scope.$apply();
    };
    $scope.unsubscribe = function (name) {
        if (typeof(Storage) !== "undefined") {
            var subscribers = JSON.parse(localStorage.getItem("subscribers"));
            var index = -1;
            for (var i = 0; i < subscribers.item.length; i++) {
                if (subscribers.item[i].name == name) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                subscribers.item.splice(index, 1);
                var serialObj = JSON.stringify(subscribers);
                localStorage.setItem("subscribers", serialObj);
                $scope.subscribers = JSON.parse(localStorage.getItem("subscribers")).item;

                if(name==_name){
                    $scope.foundTweets.items.forEach(function (obj) {
                        obj.subscribe="Subscribe";
                    });
                    $scope.$apply();
                }

            }
        } else {
            //No Web Storage support..
        }
    }
    
    $scope.subscribersShow = function(){
        $("#subscribers").slideToggle('slow');

    }

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 15 && !isSearchCall) {
            if (isUsersTweets) {
                _searchUsersTweets(_name, _photo);
            }
            else {
                if (_text != "")
                    _searchTweets(_text);
            }
            isSearchCall = true;
        }
    });

    function _subscribe(name, photo) {
        if (typeof(Storage) !== "undefined") {
            var subscribers = JSON.parse(localStorage.getItem("subscribers"));
            if (subscribers == null) {
                localStorage.setItem("subscribers", JSON.stringify({item: []}));
                subscribers = localStorage.getItem("subscribers");
            }
            var obj = {name: name, photo: photo.toString()};
            var consist = false;
            for (var i = 0; i < subscribers.item.length; i++) {
                if (subscribers.item[i].name == name) {
                    consist = true;
                    break;
                }
            }
            if (consist) {
                //nothing
            }
            else {
                subscribers.item.push(obj);
                var serialObj = JSON.stringify(subscribers);
                localStorage.setItem("subscribers", serialObj);
                $scope.subscribers = JSON.parse(localStorage.getItem("subscribers")).item;
            }
        } else {
            //No Web Storage support..
        }
    }
    function _searchTweets(text) {
        if (text != "") {
            ShowLoader();
            cb.__call("search_tweets",
                params = {
                    q: text,
                    count: count,
                    max_id: _id
                },
                function (response) {
                    var statuses = response.statuses;
                    if (statuses.length == 0) {
                        _foundTweets.items = [];
                    }
                    else {

                        for (var i = 1; i < statuses.length; i++) {
                            var status = statuses[i];
                            var date =status.created_at.toString().replace("+0000","");

                            var image;
                            if(status.hasOwnProperty('extended_entities')){
                                image=status.extended_entities.media[0].media_url;
                            }
                           _foundTweets.items.push({
                                screen_name: status.user.screen_name, screen_image_url: status.user.profile_image_url,
                                text: status.text, dateCreated: date, subscribe: "Subscribe", image:image
                            });
                            image="";
                        }


                        id = statuses[statuses.length - 1].id;
                    }
                    //$scope.foundTweets = _foundTweets;
                    $scope.foundTweets = _foundTweets;
                    HideLoader();
                    $scope.$apply();
                    isSearchCall = false;


                    Drag();
                }
            );
        }
    }
    function Drag() {
        $(document).ready(
            function () {
                $('one-tweet').draggable({revert: true});
                var t = $('#subscribers');
                t.droppable({
                    tolerance: 'touch',
                    drop: function (event, ui) {
                        var photo = $(ui.draggable).find('img').attr('src');
                        var name = $(ui.draggable).find('h5').text();
                        _subscribe(name, photo);
                        $scope.$apply();
                    }
                })
            }
        )
    }
    function _searchUsersTweets(name, photo) {
        var params;
        if (_id == 0) {
            params = {
                screen_name: name,
                count: count,
            };
        } else {
            params = {
                screen_name: name,
                count: count,
                max_id: _id
            };
        }
        ShowLoader();
        cb.__call(
            "statuses_userTimeline",
            params,
            function (response) {
                var statuses = response;
                //var _foundTweets = {items:[]};
                for (var i = 1; i < statuses.length; i++) {
                    var status = statuses[i];
                    var date =status.created_at.toString().replace("+0000","");
                    _foundTweets.items.push({
                        screen_name: name, screen_image_url: photo,
                        text: status.text, dateCreated: date, subscribe: "Unsubscribe"
                    });
                }
                _id = statuses[statuses.length - 1].id;

                $scope.foundTweets = _foundTweets;
                HideLoader();
                $scope.$apply();
                isSearchCall = false;

            }
        );

    }

    function ShowLoader() {
        $(".windows8").css({
            visibility: 'visible',

            padding: '20px'
        });
    }

    function HideLoader() {
        $(".windows8").css({
            visibility: 'hidden',

            padding: '0px'
        });
    }


});



