(function () {
    new Vue({
        el: "#main",
        data: {
            name: "imageName",
            // seen: true,
            //if we put it as false, we can not see it in our if conditional

            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        }, //data ends here.

        mounted: function () {
            var self = this;
            //talk to the server and make a get reuest to the server. So we have to have a route
            //named images in our index.js. like that they talk
            //it sends the request to server, if we get something back from the server .then() will run and we get console.log in our browser (here)
            axios.get("/home").then(function (res) {
                //response is what we get back from the server
                self.images = res.data;

                // console.log("response from / images: ", res.data);
                // console.log("self images: ", self.images);
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault(); // it prevent a button/ or something to do its default behaviour- hier prevents the page from reloading
                console.log("this:", this);

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var self = this;

                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        console.log("response from POST/ upload: ", res.data);
                        self.images.unshift(res.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                //this gives us the information about the file that we just selected
                console.log("file: ", e.target.files[0]);
                //we want to store the file that we just selected in our data with this:
                this.file = e.target.files[0];
            },
        },
    });
})();
