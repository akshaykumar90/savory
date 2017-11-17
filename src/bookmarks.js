Vue.component('bookmark-row', {
    props: ['bookmark'],
    template: '<li>{{ bookmark.title }} • {{ bookmark.site }}</li>'
});

var app = new Vue({
    el: '#app',
    data: {
        bookmarksList: []
    },
    created: function () {
        this.getRecentBookmarks()
    },
    methods: {
        getRecentBookmarks: function () {
            var that = this;
            chrome.bookmarks.getRecent(5, function (results) {
                for (var node of results) {
                    that.bookmarksList.push({ "id": node.id, "title": node.title, "site": node.url})
                }
            })
        }
    }
});
