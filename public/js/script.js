(function () {
    new Vue({
        el: "#main",
        data: {
            name: "imageName",
            // seen: true,
            //if we put it as false, we can not see it in our if conditional

            images: [],
        }, //data ends here.

        mounted: function () {
            var self = this;
            //talk to the server and make a get reuest to the server. So we have to have a route
            //named images in our index.js. like that they talk
            //it sends the request to server, if we get something back from the server .then() will run and we get console.log in our browser (here)
            axios.get("/home").then(function (response) {
                //response is what we get back from the server
                self.images = response.data;
                console.log("response from / images: ", response.data);
                console.log("self images: ", self.images);
            });
        },
        methods: {
            myFunction: function () {
                console.log("myFunction is running!!");
            },
        },
    });
})();
