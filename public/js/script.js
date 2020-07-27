(function () {
    new Vue({
        el: "#main",
        data: {
            name: "imageName",
            // seen: true,
            //if we put it as false, we can not see it in our if conditional

            images: [],
            id: "",
            title: "",
            description: "",
            username: "",
            file: null,
            currentImgId: location.hash,
            smallestIdScreen: "",
            button: "1",
        }, //data ends here.

        mounted: function () {
            var self = this;
            //talk to the server and make a get reuest to the server. So we have to have a route
            //named images in our index.js. like that they talk
            //it sends the request to server, if we get something back from the server .then() will run and we get console.log in our browser (here)
            axios.get("/home").then(function (res) {
                //response is what we get back from the server
                self.images = res.data;
                var smallestId = self.images[self.images.length - 1].id;
                self.smallestIdScreen = smallestId;
                console.log("last image id:", smallestId);
                // console.log("smallestIdScreen", self.smallestIdScreen);
                // console.log("response from / images: ", res.data);
                // console.log("self image is: ", self.images);
            });
            window.addEventListener("hashchange", function () {
                console.log("hash is changed");
                self.currentImgId = location.hash.slice(1);
            });
            // when modal closes we need to set the
            //url after the hash to an empty string,
            //also for errors (in catches).
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault(); // it prevent a button/ or something to do its default behaviour- hier prevents the page from reloading
                // console.log("this:", this);

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var self = this;

                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        // console.log("response from POST/ upload: ", res.data);
                        self.images.unshift(res.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                //this gives us the information about the file that we just selected
                // console.log("file: ", e.target.files[0]);
                //we want to store the file that we just selected in our data with this:
                this.file = e.target.files[0];
            },

            openTheImage: function (id) {
                console.log("currentImageId is: ", id);
                this.currentImgId = id;
            },

            closeTheModal: function () {
                console.log("closed");
                this.currentImgId = null;
            },

            moreImages: function (e) {
                e.preventDefault();
                var self = this;
                // console.log("self is:", self);
                // console.log("more button is clicked");

                axios
                    .get("/more-image/" + this.smallestIdScreen)
                    .then(function (res) {
                        console.log("res.data in script: ", res.data);
                        for (var i = 0; i < res.data.length; i++) {
                            self.images.push(res.data[i]);
                            // console.log(res.data[i].lowestId);
                        }
                        self.smallestIdScreen =
                            self.images[self.images.length - 1].id;
                        console.log("smallestIdScreen", self.smallestIdScreen);
                        console.log("res.data", res.data[0].lowestId);

                        if (self.smallestIdScreen == res.data[0].lowestId) {
                            self.button = null;
                            console.log("no more image");
                        }
                    })
                    .catch((err) => {
                        console.log("error in loading more images", err);
                    });
            },
        },
    });
})();
