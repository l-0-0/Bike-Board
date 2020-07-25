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
            comment: "",
            newComment: "",
            userComment: "",
        };
    },

    mounted: function () {
        var self = this;
        axios
            .get("/imageInfo/" + this.currentImgId)
            .then(function (res) {
                console.log("response from / images: ", res.data);
                self.imgTitle = res.data[0].title;
                self.imgDescription = res.data[0].description;
                self.imgUsername = res.data[0].username;
                self.imgDate = res.data[0].created_at;
                self.imgUrl = res.data[0].url;
                // self.comments = res.data[1].comments;

                // console.log("self is: ", self.title);
            })
            .catch((err) => {
                console.log("error in component get: ", err);
            });
    },
    methods: {
        closeTheImage: function () {
            // console.log("clicked");
            this.$emit("close");
        },
        submitComment: function (e) {
            console.log("submit button is working");
            var self = this;
            // console.log("self is: ", self);
            e.preventDefault();
            axios
                .post("/comment/" + this.currentImgId, {
                    comment: this.newComment,
                    username: this.userComment,
                })
                .then(function (res) {
                    console.log("response from adding comments", res.data);
                    // self.comment.unshift(res.data);
                })
                .catch((err) => {
                    console.log("error in uploading the comments: ", err);
                });
        },
    },
});
// })();
