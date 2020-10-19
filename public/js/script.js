(function () {
    new Vue({
        el: "#main",
        data: {
            name: "imageName",
            images: [],
            id: "",
            title: "",
            description: "",
            username: "",
            file: null,
            currentImgId: location.hash,
            smallestIdScreen: "",
            button: true,
        }, //data ends here.

        mounted: function () {
            var self = this;
            this.currentImgId = null;
            location.hash = "";
            //talk to the server and make a get reuest to the server. So we have to have a route
            //named images in our index.js. like that they talk
            //it sends the request to server, if we get something back from the server .then() will run and we get console.log in our browser (here)
            axios.get("/home").then(function (res) {
                //response is what we get back from the server
                self.images = res.data;
                var smallestId = self.images[self.images.length - 1].id;
                self.smallestIdScreen = smallestId;

                if (self.smallestIdScreen > res.data[0].lowestId) {
                    self.button = true;
                }
            });
            window.addEventListener("hashchange", function () {
                self.currentImgId = location.hash.slice(1);
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault(); // it prevent a button/ or something to do its default behaviour- hier prevents the page from reloading

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var self = this;

                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        self.images.unshift(res.data);
                        self.title = "";
                        self.description = "";

                        self.username = "";
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                //this gives us the information about the file that we just selected
                //we want to store the file that we just selected in our data with this:
                this.file = e.target.files[0];
            },

            openTheImage: function (id) {
                this.currentImgId = id;
            },

            closeTheModal: function () {
                this.currentImgId = null;
                location.hash = "";
            },

            moreImages: function (e) {
                e.preventDefault();
                var self = this;

                axios
                    .get("/more-image/" + this.smallestIdScreen)
                    .then(function (res) {
                        for (var i = 0; i < res.data.length; i++) {
                            self.images.push(res.data[i]);
                        }
                        self.smallestIdScreen =
                            self.images[self.images.length - 1].id;

                        if (self.smallestIdScreen == res.data[0].lowestId) {
                            self.button = false;
                        }
                    })
                    .catch((err) => {
                        console.log("error in loading more images", err);
                    });
            },

            deleteImage: function () {
                var self = this;
                this.images = this.images.filter(function (image) {
                    return image.id != self.currentImgId;
                });

                this.currentImgId = null;
                location.hash = "";
            },
        },
    });
})();
