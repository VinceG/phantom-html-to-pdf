var should = require("should"),
    path = require("path"),
    fs = require("fs"),
    tmpDir = path.join(__dirname, "temp"),
    conversion = require("../lib/conversion.js")({
        tmpDir: tmpDir,
        portLeftBoundary: 10000,
        portRightBoundary: 15000
    });

describe("phantom html to pdf", function () {

    beforeEach(function() {
        rmDir(tmpDir);
    });

    it("should create a pdf file", function (done) {
        conversion("foo", function (err, res) {
            if (err)
                return done(err);

            res.numberOfPages.should.be.eql(1);
            res.stream.should.have.property("readable");
            done();
        });
    });

    it("should set number of pages correctly", function (done) {
        conversion("<h1>aa</h1><div style='page-break-before: always;'></div><h1>bb</h1>", function (err, res) {
            if (err)
                return done(err);

            res.numberOfPages.should.be.eql(2);
            done();
        });
    });

    rmDir = function (dirPath) {
        if (!fs.existsSync(dirPath))
            fs.mkdirSync(dirPath);

        try {
            var files = fs.readdirSync(dirPath);
        }
        catch (e) {
            return;
        }
        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    try {
                        fs.unlinkSync(filePath);
                    }catch(e){};
            }
    };
});