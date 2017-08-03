![spash graphic](graphic_assets/bpg_splash.gif)

# :pill::pill: _Breathmint Phalange Gaiden_ :pill::pill:
A simple browser implementation of the classic game: Tic Tac Toe. Other working titles include: Tic Tac Toe Road.

A hosted version of this game can be found at: 
**[tictactoe.pink](http://tictactoe.pink)**. It will most likely be in the most recent commit/build of the code found here.

Alternatively, can be previewed from source using 
**[rawgit](https://rawgit.com/beug/breathmint_phalange_gaiden/master/index.html)** – please only use this to verify that the codebase for the current commit is functioning as expected, as (for good reason) rawgit is rate limited in dev mode. Please visit the aforementioned hosted version of the game to play.

([full rawgit site here](https://rawgit.com/))

Developed using **[p5js](https://p5js.org/)**

## Gameplay:
Will work on mobile, better on a tablet in landscape mode and best in a desktop browser *especially with fullscreen mode enabled*.

![Hi I'm FULLSCREEN](graphic_assets/fullscreen.gif)

Tic Tac Toe is [historically](https://en.wikipedia.org/wiki/Gomoku) encoded as a "get a bunch of things in a row" sort of a deal. Incidentally, such Qí is but one flavor of the [four arts](https://en.wikipedia.org/wiki/Four_arts). This various mint and orange flavor of the game both rejects the traditional aesthetic and borrows from the "get a bunch of things in a row" sensibility insofaras virtualized time and space are concerned. The game introduction alludes:

>Once upon a time in a pink tropical storm, TIC TAC and TOE descended from the heavens upon the roads of Monaco. <p>Capture the beloved TIC TAC (with your cursor); avoid the dreaded TOE. Three in a row will either propell you to flavour fresh satisfaction, or precisely the inverse. <p> You could play this forever.

The player is charged with collecting Tictacs in a tictac container, and avoiding the toes. The game will track how many of each event happens in a row to eventually determine one of three outcomes: Win, Lose, or Draw. A rolling total of wins and losses is kept. An opportunity for possible enhancement involving a leaderboard is present here.

### Musings on 3D
Tictacs, toes, and the tictac container are all .obj models loaded into the WEBGL context of p5js. At the beginning of each round a random number tictacs and toes are called upon. It will be the same number of each. A possible development of levels could employ a more challenging circumstance of how many of each get generated in the round. As of this README, the collision detection only ~*works*~ within about 25 pixels of the mouse. Since the mouse/touch doesn't have a zed axis this is a bit of a contextual lie because the tictacs and the toes do. Thereby, the perception of the nearness along the x/y axis is relative to the perspective of the "camera."

### Winkin', Blinkin', and Nods
* Though the name of this game is informed by a classic NES title, the naming convention is more of a nod to sir [Charles Barkley](https://youtu.be/8F1cOvZ3nS8?t=51) and his friends with tales.

* The earliest version of the game had a method for falling objects called `fallFromGrace()` which was subsequetnly renamed to `graceKelly()` in a later version (hence the reference to [Monaco](https://en.wikipedia.org/wiki/Grace_Kelly#Princess_consort), despite also being an opportunity for relation to a classic SEGA title).

* The game also had a method for objects when they would become trapped called `rKelly()` in reference to the early aughts hip-hopera *Trapped in the Closet*. This was removed due to reasons. Despite best intentions, the renaming of other methods after people lacked worthy pun, and both the latter and the former were renamed to more atypical method names like `falling()` and `resting()`. Any reference to Monaco notwithstanding.

* There are no icebergs in this game or this README, nor shall there be theories on the like. The rest of the easter eggs are up to you.