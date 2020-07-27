// (function () {
Vue.component("image-modal", {
    template: "#image-template",
    props: ["currentImgId"],
    data: function () {
        return {
            imgTitle: "",
            imgDescription: "",
            imgUsername: "",
            imgDate: "",
            imgUrl: "",
            comment: [],
            commentDate: "",
            username: "",
            newComment: "",
        };
    },

    mounted: function () {
        var self = this;
        axios
            .get("/imageInfo/" + this.currentImgId)
            .then(function (res) {
                // console.log("response from / images: ", res.data[1]);
                self.imgTitle = res.data[0].title;
                self.imgDescription = res.data[0].description;
                self.imgUsername = res.data[0].username;
                self.imgDate = res.data[0].created_at;
                self.imgUrl = res.data[0].url;
                self.comment = res.data[1];
            })
            .catch((err) => {
                console.log("error in component get: ", err);
            });
    },

    watch: {
        currentImgId: function () {
            var self = this;
            console.log("inside watcher");
            axios
                .get("/imageInfo/" + this.currentImgId)
                .then(function (res) {
                    console.log("image id", self.currentImgId);
                    // console.log("response from / images: ", res.data[1]);
                    self.imgTitle = res.data[0].title;
                    self.imgDescription = res.data[0].description;
                    self.imgUsername = res.data[0].username;
                    self.imgDate = res.data[0].created_at;
                    self.imgUrl = res.data[0].url;
                    self.comment = res.data[1];
                })
                .catch((err) => {
                    console.log("error in component get in watcher: ", err);
                    location.hash = "";
                });
        },
    },
    methods: {
        closeTheImage: function () {
            // console.log("clicked");
            this.$emit("close");
        },
        submitComment: function (e) {
            console.log("submit button is working");
            var self = this;
            // console.log("this.comment", this.newComment);
            e.preventDefault();
            axios
                .post("/comment/" + this.currentImgId, {
                    newComment: this.newComment,
                    username: this.username,
                })
                .then(function (res) {
                    // console.log("response from adding comments", res.data);
                    self.comment.unshift(res.data);
                })
                .catch((err) => {
                    console.log("error in uploading the comments: ", err);
                });
        },
        deleteImage: function (e) {
            console.log("delete button works");
        },
    },
});
// })();
