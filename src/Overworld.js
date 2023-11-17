class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.image("tilesetImage", "tileset.png"); //Loading tileset
        this.load.tilemapTiledJSON("tilemapJSON", "overworld.json"); //Loading tilemap
    }

    create() {
        // velocity constant
        this.VEL = 100

        //Tilemap info
        const map = this.add.tilemap("tilemapJSON");
        const tileset = map.addTilesetImage("tileset", "tilesetImage"); //Connecting image to the data; Asks for what the file was called in TILE
        
        const bgLayer = map.createLayer("Background", tileset, 0, 0); //Adding background layer
        const terrainLayer = map.createLayer("Terrain", tileset, 0, 0); //Adding terrain layer
        const treeLayer = map.createLayer("Trees", tileset, 0, 0); //Adding tree layer

        // add slime
        const slimeSpawn = map.findObject("Spawns", obj => obj.name === "slimeSpawn"); //Go to Layer Name, Callback Function that finds item called "slimeSpawn"
        //this.slime = this.physics.add.sprite(32, 32, 'slime', 0) OLD
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0)
        this.slime.body.setCollideWorldBounds(true)

        // slime animation
        this.anims.create({
            key: "jiggle",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("slime", {
                start: 0,
                end: 1
            })
        })
        this.slime.play("jiggle");

        //Camera manipulation
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Setting camera bounds
        this.cameras.main.startFollow(this.slime, true, 0.5) //Make camera follow the slime; Round pixels, have a brief delay behind slime
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Enabling slimes to go beyond basic canvas view

        //Enabling collisions based on tilemap
        terrainLayer.setCollisionByProperty({ //Acquiring properties of terrain layer
            collides: true //If collides is true on that tile, collide
        })
        treeLayer.setCollisionByProperty({ //Acquiring properties of tree layer
            collides: true //If collides is true on that tile, collide
        })

        this.physics.add.collider(this.slime, terrainLayer); //Enabling collision between slime and terrainLayer
        this.physics.add.collider(this.slime, treeLayer); //Enabling collision between slime and treeLayer

        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }

        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }

        this.direction.normalize()
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}