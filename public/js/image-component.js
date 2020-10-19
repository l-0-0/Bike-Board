(function () {
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
                axios
                    .get("/imageInfo/" + this.currentImgId)
                    .then(function (res) {
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
                this.$emit("close");
            },
            submitComment: function (e) {
                var self = this;
                e.preventDefault();
                axios
                    .post("/comment/" + this.currentImgId, {
                        newComment: this.newComment,
                        username: this.username,
                    })
                    .then(function (res) {
                        self.comment.unshift(res.data);
                        self.newComment = "";
                        self.username = "";
                    })
                    .catch((err) => {
                        console.log("error in uploading the comments: ", err);
                    });
            },
            deleteImage: function (e) {
                var self = this;
                e.preventDefault();
                axios
                    .delete("/delete/" + this.currentImgId, this.currentImgId)
                    .then(function (res) {
                        self.$emit("deleted");
                    })
                    .catch((err) => {
                        console.log("error in deleting: ", err);
                    });
            },
        },
    });
})();
