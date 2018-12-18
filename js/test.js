var createListOfAlgorithm = require('workspaceGetAlg').createListOfAlgorithm;

describe("create list of algorithms with normal data", function() {

    it("normal data, one", function() {
        let data = [{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3  ","Algorithm":" blur1 blur2  blur3  ","UserOwner":"ptrdiff.t@gmail.com"}];
        let answer = "<div id='id" + 0 + "'>" + " blur1 blur2 blur3 " + "</div>";
        assert.equal(createListOfAlgorithm(data), answer);
    });

    it("normal data, more than one", function() {
        let data = [{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3  ","Algorithm":" blur1 blur2  blur3  ","UserOwner":"ptrdiff.t@gmail.com"},{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3 ","Algorithm":" blur1 blur2  blur3 ","UserOwner":"ptrdiff.t@gmail.com"},{"Id":"ptrdiff.t@gmail.com: blur3  blur1 blur2 ","Algorithm":" blur3  blur1 blur2 ","UserOwner":"ptrdiff.t@gmail.com"},{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur2  blur2 ","Algorithm":" blur1 blur2  blur2  blur2 ","UserOwner":"ptrdiff.t@gmail.com"},{"Id":"ptrdiff.t@gmail.com: blur1 blur3  blur3 ","Algorithm":" blur1 blur3  blur3 ","UserOwner":"ptrdiff.t@gmail.com"},{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3  blur2 ","Algorithm":" blur1 blur2  blur3  blur2 ","UserOwner":"ptrdiff.t@gmail.com"},{"Id":"ptrdiff.t@gmail.com: blur1","Algorithm":" blur1 ","UserOwner":"ptrdiff.t@gmail.com"}];
        let answer = '<div id=\'id0\'> blur1 blur2 blur3 </div><div id=\'id1\'> blur1 blur2 blur3 </div><div id=\'id2\'> blur3 blur1 blur2 </div><div id=\'id3\'> blur1 blur2 blur2 blur2 </div><div id=\'id4\'> blur1 blur3 blur3 </div><div id=\'id5\'> blur1 blur2 blur3 blur2 </div><div id=\'id6\'> blur1 </div>';
        assert.equal(createListOfAlgorithm(data), answer);
    });

});


describe("create list of algorithms with missing data attribute", function() {

    it("miss Id attribute", function() {
        let data = [{"Algorithm":" blur1 blur2  blur3  ","UserOwner":"ptrdiff.t@gmail.com"}];
        let answer = "<div id='id" + 0 + "'>" + " blur1 blur2 blur3 " + "</div>";
        assert.equal(createListOfAlgorithm(data), answer);
    });

    it("miss Algorithm attribute", function() {
        let data = [{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3  ","UserOwner":"ptrdiff.t@gmail.com"}];
        let answer = '';
        assert.equal(createListOfAlgorithm(data), answer);
    });

    it("miss UserOwner attribute", function() {
        let data = [{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3  ","Algorithm":" blur1 blur2  blur3  "}];
        let answer = "<div id='id" + 0 + "'>" + " blur1 blur2 blur3 " + "</div>";
        assert.equal(createListOfAlgorithm(data), answer);
    });
});


describe("create list of algorithms with extra tabs in the data", function() {
    it("more tab", function() {
        let data = [{"Id":"ptrdiff.t@gmail.com: blur1 blur2  blur3  ","Algorithm":" blur1  blur2  blur3 ","UserOwner":"ptrdiff.t@gmail.com"}];
        let answer = "<div id='id" + 0 + "'>" + " blur1 blur2 blur3 " + "</div>";
        assert.equal(createListOfAlgorithm(data), answer);
    });
});
