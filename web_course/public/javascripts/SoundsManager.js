class SoundsManager
{
    nextLevelSound = null;
    themeSound = null;
    gameManager = null;
    jumpSound = null;
    deathSound = null;

    constructor(gameManager)
    {
        this.gameManager = gameManager;
        this.nextLevelSound = new Audio("/sounds/next-level-sound.mp3");
        this.themeSound = new Audio("/sounds/theme-sound.mp3");
        this.jumpSound = new Audio("/sounds/jump-sound.mp3");
        this.deathSound = new Audio("/sounds/player-death-sound.mp3");
        let self = this;
        this.themeSound.addEventListener('canplaythrough', () => { self.playMainTheme() }, false);
    }

    playSound(name)
    {
        switch(name)
        {
            case "jump":
                console.log('play jump');
                this.jumpSound.currentTime=0;
                this.jumpSound.volume = 0.4;
                this.jumpSound.play();
                break;

            case "next level":
                this.nextLevelSound.currentTime = 0;
                this.nextLevelSound.volume = 0.3;
                this.nextLevelSound.play();
                break;
            case "death":
                this.deathSound.currentTime = 0;
                this.deathSound.volume = 1;
                this.deathSound.play();
                break;
            default:
                break;
        }
    }

    playMainTheme()
    {
        if(this.themeSound.paused)
        {
            this.themeSound.loop = true;
            this.themeSound.volume = 0.2;
            this.themeSound.play();
        }
        else
        {
            this.themeSound.pause();
        }
    }


}