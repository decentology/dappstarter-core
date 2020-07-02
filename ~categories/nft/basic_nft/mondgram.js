
class Mondgram {

    constructor(id, scale, colors, mondgramData) {
        this.id = id;
        this.size = 128;
        this.scale = scale || 1;

        this.colors = colors || ['white', 'red', 'yellow', 'blue'];
        this.thickness = 2;
        this.score = 0;
        this.emoji = null;
        if (mondgramData) {
            this.randoms = Mondgram._toRandoms(mondgramData);
            this.emoji = mondgramData.emoji;
            this.play = true;
        } else {
            this.randoms = [];
            this.play = false;
        }
        this.playIndex = 0;
        this._init();
    }

    _init() {
        let self = this;
        let el = document.getElementById(self.id);
        el.setAttribute('style', `width: ${self.scale * self.size}px;`)
        let cId = `${self.id}-mondrian`;

        el.innerHTML = `<canvas width="${self.size * self.scale}" height="${self.size * self.scale}" id="${cId}"></canvas>`;

        let c = document.getElementById(cId);

        let ctx = c.getContext('2d');
        ctx.scale(self.scale, self.scale);
        ctx.beginPath();
        ctx.lineWidth = self.thickness;

        let xPad = Math.floor(self.size * 0.1);
        let yPad = Math.floor(self.size * 0.1);
        let rect = Mondgram._rectangle(Mondgram.point(0, 0), Mondgram.point(self.size, self.size), self.colors, self._random.bind(self), true);
        rect._split(xPad, yPad, 0, 5, ctx);
        ctx.stroke();

        ctx.rect(self.thickness / 2, self.thickness / 2, self.size - self.thickness, self.size - self.thickness);
        ctx.stroke();
    }

    _random(min, max, isColor) {
        let rndOut;
        if (this.play) {
            rndOut = this.randoms[this.playIndex++];
        } else {
            if (isColor) {
                rndOut = Math.floor(Math.random() * (max - min) + min);
            } else {
                rndOut = Math.round((Math.random() * (max - min) + min) / 8) * 8;
            }
            this.randoms.push(rndOut);
        }
        this.score += rndOut;
        return rndOut;
    }

    static _toRandoms(mondgramData) {
        let rndData = mondgramData.asset;
        var binary_string = window.atob(rndData + '==');
        var len = binary_string.length;
        var bytes = [];
        for (var i = 0; i < len; i++) {
            bytes.push(binary_string.charCodeAt(i));
        }
        return bytes;
    }

    static point(x, y) {
        return {
            X: x,
            Y: y
        }
    }

    mondgram() {
        if (this.randoms.length > 0) {
            var binary = '';
            var bytes = new Uint8Array(this.randoms);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            this.score = this.score % 1000;
            return {
                asset: window.btoa(binary).replace('==', ''),
                score: this.score,
                emoji: this.emoji || Mondgram._getEmoji()
            }
        } else {
            throw new Error('No image has been generated');
        }
    }

    static _rectangle(minPoint, maxPoint, colors, random) {

        function rect(minPoint, maxPoint, colors, random) {
            this.min = minPoint;
            this.max = maxPoint;
            this.colors = colors;
            this.rnd = random;

            this._width = () => {
                return this.max.X - this.min.X;
            }
    
            this._height = () => {
                return this.max.Y - this.min.Y;
            }
    
            this._draw = (ctx) => {
                // clockwise
                ctx.moveTo(this.min.X, this.min.Y);
                ctx.lineTo(this.max.X, this.min.Y);
                ctx.lineTo(this.max.X, this.max.Y);
                ctx.lineTo(this.min.X, this.max.Y);
                ctx.lineTo(this.min.X, this.min.Y);
            }
    
            this._split = (xPad, yPad, depth, limit, ctx) => {
                console.log(this)
                ctx.fillStyle = this.colors[this.rnd(0, this.colors.length, true)];
                ctx.fillRect(this.min.X, this.min.Y, this.max.X, this.max.Y);
                this._draw(ctx);
    
                // Check the level of recursion
                if (depth == limit) {
                    return;
                }
    
                // Check the rectangle is large and tall enough
                if (this._width() < 2 * xPad || this._height() < 2 * yPad) {
                    return;
                }
    
                let r1;
                let r2;
    
                // If the rectangle is wider than its height do a left/right split
                if (this._width() > this._height()) {
                    let x = this.rnd(this.min.X + xPad, this.max.X - xPad);
                    r1 = Mondgram._rectangle(this.min, Mondgram.point(x, this.max.Y), this.colors, this.rnd);
                    r2 = Mondgram._rectangle(Mondgram.point(x, this.min.Y), this.max, this.colors, this.rnd);
                }
                else {
                    // Else do a top/bottom split
                    let y = this.rnd(this.min.Y + yPad, this.max.Y - yPad);
                    r1 = Mondgram._rectangle(this.min, Mondgram.point(this.max.X, y), this.colors, this.rnd);
                    r2 = Mondgram._rectangle(Mondgram.point(this.min.X, y), this.max, this.colors, this.rnd);
                }
    
                // Split the sub-rectangles
                r1._split(xPad, yPad, depth + 1, limit, ctx);
                r2._split(xPad, yPad, depth + 1, limit, ctx);
            }
        }

        return new rect(minPoint, maxPoint, colors, random);
    }


    static _getEmoji() {
        let emojis = ["1f600", "1f603", "1f604", "1f601", "1f606", "1f605", "1f923", "1f602", "1f642", "1f643", "1f609", "1f60a", "1f607", "1f970", "1f60d", "1f929", "1f618", "1f617", "263a", "1f61a", "1f619", "1f60b", "1f61b", "1f61c", "1f92a", "1f61d", "1f911", "1f917", "1f92d", "1f92b", "1f914", "1f910", "1f928", "1f610", "1f611", "1f636", "1f60f", "1f612", "1f644", "1f62c", "1f925", "1f60c", "1f614", "1f62a", "1f924", "1f634", "1f637", "1f912", "1f915", "1f922", "1f92e", "1f927", "1f975", "1f976", "1f974", "1f635", "1f92f", "1f920", "1f973", "1f60e", "1f913", "1f9d0", "1f615", "1f61f", "1f641", "2639", "1f62e", "1f62f", "1f632", "1f633", "1f97a", "1f626", "1f627", "1f628", "1f630", "1f625", "1f622", "1f62d", "1f631", "1f616", "1f623", "1f61e", "1f613", "1f629", "1f62b", "1f971", "1f624", "1f621", "1f620", "1f92c", "1f608", "1f47f", "1f480", "2620", "1f4a9", "1f921", "1f479", "1f47a", "1f47b", "1f47d", "1f47e", "1f916", "1f63a", "1f638", "1f639", "1f63b", "1f63c", "1f63d", "1f640", "1f63f", "1f63e", "1f648", "1f649", "1f64a", "1f48b", "1f48c", "1f498", "1f49d", "1f496", "1f497", "1f493", "1f49e", "1f495", "1f49f", "2763", "1f494", "2764", "1f9e1", "1f49b", "1f49a", "1f499", "1f49c", "1f90e", "1f5a4", "1f90d", "1f4af", "1f4a2", "1f4a5", "1f4ab", "1f4a6", "1f4a8", "1f573", "1f4a3", "1f4ac", "1f5e8", "1f5ef", "1f4ad", "1f4a4", "1f44b", "1f91a", "1f590", "270b", "1f596", "1f44c", "1f90f", "270c", "1f91e", "1f91f", "1f918", "1f919", "1f448", "1f449", "1f446", "1f595", "1f447", "261d", "1f44d", "1f44e", "270a", "1f44a", "1f91b", "1f91c", "1f44f", "1f64c", "1f450", "1f932", "1f91d", "1f64f", "270d", "1f485", "1f933", "1f4aa", "1f9be", "1f9bf", "1f9b5", "1f9b6", "1f442", "1f9bb", "1f443", "1f9e0", "1f9b7", "1f9b4", "1f440", "1f441", "1f445", "1f444", "1f476", "1f9d2", "1f466", "1f467", "1f468", "1f9d4", "1f469", "1f9d3", "1f474", "1f475", "1f9cf", "1f46e", "1f575", "1f482", "1f477", "1f934", "1f478", "1f472", "1f9d5", "1f935", "1f470", "1f930", "1f931", "1f47c", "1f385", "1f936", "1f9b8", "1f9b9", "1f9d9", "1f9da", "1f9db", "1f9dc", "1f9dd", "1f9de", "1f9df", "1f483", "1f57a", "1f574", "1f46f", "1f3c7", "26f7", "1f3c2", "1f93c", "1f46d", "1f46b", "1f46c", "1f48f", "1f491", "1f46a", "1f5e3", "1f464", "1f465", "1f463", "1f9b0", "1f9b1", "1f9b3", "1f9b2", "1f91d", "1f9be", "1f9bf", "1f9e0", "1f9b7", "1f9b4", "1f440", "1f441", "1f445", "1f444", "1f9de", "1f9df", "1f46f", "26f7", "1f93c", "1f48f", "1f491", "1f46a", "1f5e3", "1f464", "1f465", "1f463", "1f9b0", "1f9b1", "1f9b3", "1f9b2", "1f91d", "1f9be", "1f9bf", "1f9e0", "1f9b7", "1f9b4", "1f440", "1f441", "1f445", "1f444", "1f9de", "1f9df", "1f46f", "26f7", "1f93c", "1f48f", "1f491", "1f46a", "1f5e3", "1f464", "1f465", "1f463", "1f9b0", "1f9b1", "1f9b3", "1f9b2", "1f91d", "1f9be", "1f9bf", "1f9e0", "1f9b7", "1f9b4", "1f440", "1f441", "1f445", "1f444", "1f9de", "1f9df", "1f46f", "26f7", "1f93c", "1f48f", "1f491", "1f46a", "1f5e3", "1f464", "1f465", "1f463", "1f9b0", "1f9b1", "1f9b3", "1f9b2", "1f91d", "1f9be", "1f9bf", "1f9e0", "1f9b7", "1f9b4", "1f440", "1f441", "1f445", "1f444", "1f9de", "1f9df", "1f46f", "26f7", "1f93c", "1f48f", "1f491", "1f46a", "1f5e3", "1f464", "1f465", "1f463", "1f9b0", "1f9b1", "1f9b3", "1f9b2", "1f91d", "1f9be", "1f9bf", "1f9e0", "1f9b7", "1f9b4", "1f440", "1f441", "1f445", "1f444", "1f9de", "1f9df", "1f46f", "26f7", "1f93c", "1f48f", "1f491", "1f46a", "1f5e3", "1f464", "1f465", "1f463", "1f9b0", "1f9b1", "1f9b3", "1f9b2", "1f435", "1f412", "1f98d", "1f9a7", "1f436", "1f415", "1f9ae", "1f429", "1f43a", "1f98a", "1f99d", "1f431", "1f408", "1f981", "1f42f", "1f405", "1f406", "1f434", "1f40e", "1f984", "1f993", "1f98c", "1f42e", "1f402", "1f403", "1f404", "1f437", "1f416", "1f417", "1f43d", "1f40f", "1f411", "1f410", "1f42a", "1f42b", "1f999", "1f992", "1f418", "1f98f", "1f99b", "1f42d", "1f401", "1f400", "1f439", "1f430", "1f407", "1f43f", "1f994", "1f987", "1f43b", "1f428", "1f43c", "1f9a5", "1f9a6", "1f9a8", "1f998", "1f9a1", "1f43e", "1f983", "1f414", "1f413", "1f423", "1f424", "1f425", "1f426", "1f427", "1f54a", "1f985", "1f986", "1f9a2", "1f989", "1f9a9", "1f99a", "1f99c", "1f438", "1f40a", "1f422", "1f98e", "1f40d", "1f432", "1f409", "1f995", "1f996", "1f433", "1f40b", "1f42c", "1f41f", "1f420", "1f421", "1f988", "1f419", "1f41a", "1f40c", "1f98b", "1f41b", "1f41c", "1f41d", "1f41e", "1f997", "1f577", "1f578", "1f982", "1f99f", "1f9a0", "1f490", "1f338", "1f4ae", "1f3f5", "1f339", "1f940", "1f33a", "1f33b", "1f33c", "1f337", "1f331", "1f332", "1f333", "1f334", "1f335", "1f33e", "1f33f", "2618", "1f340", "1f341", "1f342", "1f343", "1f347", "1f348", "1f349", "1f34a", "1f34b", "1f34c", "1f34d", "1f96d", "1f34e", "1f34f", "1f350", "1f351", "1f352", "1f353", "1f95d", "1f345", "1f965", "1f951", "1f346", "1f954", "1f955", "1f33d", "1f336", "1f952", "1f96c", "1f966", "1f9c4", "1f9c5", "1f344", "1f95c", "1f330", "1f35e", "1f950", "1f956", "1f968", "1f96f", "1f95e", "1f9c7", "1f9c0", "1f356", "1f357", "1f969", "1f953", "1f354", "1f35f", "1f355", "1f32d", "1f96a", "1f32e", "1f32f", "1f959", "1f9c6", "1f95a", "1f373", "1f958", "1f372", "1f963", "1f957", "1f37f", "1f9c8", "1f9c2", "1f96b", "1f371", "1f358", "1f359", "1f35a", "1f35b", "1f35c", "1f35d", "1f360", "1f362", "1f363", "1f364", "1f365", "1f96e", "1f361", "1f95f", "1f960", "1f961", "1f980", "1f99e", "1f990", "1f991", "1f9aa", "1f366", "1f367", "1f368", "1f369", "1f36a", "1f382", "1f370", "1f9c1", "1f967", "1f36b", "1f36c", "1f36d", "1f36e", "1f36f", "1f37c", "1f95b", "2615", "1f375", "1f376", "1f37e", "1f377", "1f378", "1f379", "1f37a", "1f37b", "1f942", "1f943", "1f964", "1f9c3", "1f9c9", "1f9ca", "1f962", "1f37d", "1f374", "1f944", "1f52a", "1f3fa", "1f30d", "1f30e", "1f30f", "1f310", "1f5fa", "1f5fe", "1f9ed", "1f3d4", "26f0", "1f30b", "1f5fb", "1f3d5", "1f3d6", "1f3dc", "1f3dd", "1f3de", "1f3df", "1f3db", "1f3d7", "1f9f1", "1f3d8", "1f3da", "1f3e0", "1f3e1", "1f3e2", "1f3e3", "1f3e4", "1f3e5", "1f3e6", "1f3e8", "1f3e9", "1f3ea", "1f3eb", "1f3ec", "1f3ed", "1f3ef", "1f3f0", "1f492", "1f5fc", "1f5fd", "26ea", "1f54c", "1f6d5", "1f54d", "26e9", "1f54b", "26f2", "26fa", "1f301", "1f303", "1f3d9", "1f304", "1f305", "1f306", "1f307", "1f309", "2668", "1f3a0", "1f3a1", "1f3a2", "1f488", "1f3aa", "1f682", "1f683", "1f684", "1f685", "1f686", "1f687", "1f688", "1f689", "1f68a", "1f69d", "1f69e", "1f68b", "1f68c", "1f68d", "1f68e", "1f690", "1f691", "1f692", "1f693", "1f694", "1f695", "1f696", "1f697", "1f698", "1f699", "1f69a", "1f69b", "1f69c", "1f3ce", "1f3cd", "1f6f5", "1f9bd", "1f9bc", "1f6fa", "1f6b2", "1f6f4", "1f6f9", "1f68f", "1f6e3", "1f6e4", "1f6e2", "26fd", "1f6a8", "1f6a5", "1f6a6", "1f6d1", "1f6a7", "2693", "26f5", "1f6f6", "1f6a4", "1f6f3", "26f4", "1f6e5", "1f6a2", "2708", "1f6e9", "1f6eb", "1f6ec", "1fa82", "1f4ba", "1f681", "1f69f", "1f6a0", "1f6a1", "1f6f0", "1f680", "1f6f8", "1f6ce", "1f9f3", "231b", "23f3", "231a", "23f0", "23f1", "23f2", "1f570", "1f55b", "1f567", "1f550", "1f55c", "1f551", "1f55d", "1f552", "1f55e", "1f553", "1f55f", "1f554", "1f560", "1f555", "1f561", "1f556", "1f562", "1f557", "1f563", "1f558", "1f564", "1f559", "1f565", "1f55a", "1f566", "1f311", "1f312", "1f313", "1f314", "1f315", "1f316", "1f317", "1f318", "1f319", "1f31a", "1f31b", "1f31c", "1f321", "2600", "1f31d", "1f31e", "1fa90", "2b50", "1f31f", "1f320", "1f30c", "2601", "26c5", "26c8", "1f324", "1f325", "1f326", "1f327", "1f328", "1f329", "1f32a", "1f32b", "1f32c", "1f300", "1f308", "1f302", "2602", "2614", "26f1", "26a1", "2744", "2603", "26c4", "2604", "1f525", "1f4a7", "1f30a", "1f383", "1f384", "1f386", "1f387", "1f9e8", "2728", "1f388", "1f389", "1f38a", "1f38b", "1f38d", "1f38e", "1f38f", "1f390", "1f391", "1f9e7", "1f380", "1f381", "1f397", "1f39f", "1f3ab", "1f396", "1f3c6", "1f3c5", "1f947", "1f948", "1f949", "26bd", "26be", "1f94e", "1f3c0", "1f3d0", "1f3c8", "1f3c9", "1f3be", "1f94f", "1f3b3", "1f3cf", "1f3d1", "1f3d2", "1f94d", "1f3d3", "1f3f8", "1f94a", "1f94b", "1f945", "26f3", "26f8", "1f3a3", "1f93f", "1f3bd", "1f3bf", "1f6f7", "1f94c", "1f3af", "1fa80", "1fa81", "1f3b1", "1f52e", "1f9ff", "1f3ae", "1f579", "1f3b0", "1f3b2", "1f9e9", "1f9f8", "2660", "2665", "2666", "2663", "265f", "1f0cf", "1f004", "1f3b4", "1f3ad", "1f5bc", "1f3a8", "1f9f5", "1f9f6", "1f453", "1f576", "1f97d", "1f97c", "1f9ba", "1f454", "1f455", "1f456", "1f9e3", "1f9e4", "1f9e5", "1f9e6", "1f457", "1f458", "1f97b", "1fa71", "1fa72", "1fa73", "1f459", "1f45a", "1f45b", "1f45c", "1f45d", "1f6cd", "1f392", "1f45e", "1f45f", "1f97e", "1f97f", "1f460", "1f461", "1fa70", "1f462", "1f451", "1f452", "1f3a9", "1f393", "1f9e2", "26d1", "1f4ff", "1f484", "1f48d", "1f48e", "1f507", "1f508", "1f509", "1f50a", "1f4e2", "1f4e3", "1f4ef", "1f514", "1f515", "1f3bc", "1f3b5", "1f3b6", "1f399", "1f39a", "1f39b", "1f3a4", "1f3a7", "1f4fb", "1f3b7", "1f3b8", "1f3b9", "1f3ba", "1f3bb", "1fa95", "1f941", "1f4f1", "1f4f2", "260e", "1f4de", "1f4df", "1f4e0", "1f50b", "1f50c", "1f4bb", "1f5a5", "1f5a8", "2328", "1f5b1", "1f5b2", "1f4bd", "1f4be", "1f4bf", "1f4c0", "1f9ee", "1f3a5", "1f39e", "1f4fd", "1f3ac", "1f4fa", "1f4f7", "1f4f8", "1f4f9", "1f4fc", "1f50d", "1f50e", "1f56f", "1f4a1", "1f526", "1f3ee", "1fa94", "1f4d4", "1f4d5", "1f4d6", "1f4d7", "1f4d8", "1f4d9", "1f4da", "1f4d3", "1f4d2", "1f4c3", "1f4dc", "1f4c4", "1f4f0", "1f5de", "1f4d1", "1f516", "1f3f7", "1f4b0", "1f4b4", "1f4b5", "1f4b6", "1f4b7", "1f4b8", "1f4b3", "1f9fe", "1f4b9", "1f4b1", "1f4b2", "2709", "1f4e7", "1f4e8", "1f4e9", "1f4e4", "1f4e5", "1f4e6", "1f4eb", "1f4ea", "1f4ec", "1f4ed", "1f4ee", "1f5f3", "270f", "2712", "1f58b", "1f58a", "1f58c", "1f58d", "1f4dd", "1f4bc", "1f4c1", "1f4c2", "1f5c2", "1f4c5", "1f4c6", "1f5d2", "1f5d3", "1f4c7", "1f4c8", "1f4c9", "1f4ca", "1f4cb", "1f4cc", "1f4cd", "1f4ce", "1f587", "1f4cf", "1f4d0", "2702", "1f5c3", "1f5c4", "1f5d1", "1f512", "1f513", "1f50f", "1f510", "1f511", "1f5dd", "1f528", "1fa93", "26cf", "2692", "1f6e0", "1f5e1", "2694", "1f52b", "1f3f9", "1f6e1", "1f527", "1f529", "2699", "1f5dc", "2696", "1f9af", "1f517", "26d3", "1f9f0", "1f9f2", "2697", "1f9ea", "1f9eb", "1f9ec", "1f52c", "1f52d", "1f4e1", "1f489", "1fa78", "1f48a", "1fa79", "1fa7a", "1f6aa", "1f6cf", "1f6cb", "1fa91", "1f6bd", "1f6bf", "1f6c1", "1fa92", "1f9f4", "1f9f7", "1f9f9", "1f9fa", "1f9fb", "1f9fc", "1f9fd", "1f9ef", "1f6d2", "1f6ac", "26b0", "26b1", "1f5ff", "1f3e7", "1f6ae", "1f6b0", "267f", "1f6b9", "1f6ba", "1f6bb", "1f6bc", "1f6be", "1f6c2", "1f6c3", "1f6c4", "1f6c5", "26a0", "1f6b8", "26d4", "1f6ab", "1f6b3"];

        return emojis[Math.floor(Math.random() * emojis.length)];

    }

}

