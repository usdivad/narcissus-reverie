class MusicConductorBehavior extends Sup.Behavior {
  
  conductor: Sup.Audio.Conductor;
  phrase: string;
  
  params_instrumentalEntrance: any;
  params_tabTest: any;
  params_tabularasa_a: any;

  chimeagain: any;
  // verseVocals: Sup.Audio.SoundPlayer;
  // verse2Vocals: Sup.Audio.SoundPlayer;

  drumsAndBassHaveEntered: boolean;
  bridgeInstsHaveEntered: boolean;

  playerPreviouslyCouldJump: boolean;
  playerWasJumping: boolean;
  playerMovementLock: boolean;

  celloFadeVolMax: number;
  celloFadeVolMin: number;

  logOutput: boolean;
  transitioning: boolean;

  npcHasSung: boolean;
  cyclesSinceNpcHasSung: number;
  verse2NpcHasSung: boolean;

  verse2SelectedNpcIdx: number = 1;

  bridgePlayersActiveStatuses : boolean[];
  bridgeSubtitles: string[] = [
    "The sounds of old illusions...",
    "The voices of the forgotten...",
    "The faded whispers...",
    "What if the cycle of refraction \n and recognition never ends?"
  ];

  chorusActive: boolean;
  chorusHasBegun: boolean;

  vol: number;

  currentSection: number;
  
  awake() {
    this.logOutput = false;
    
    this.currentSection = 0;

    let vol = 0.5;
    let path_audio = "Audio/";
    
    this.vol = vol;
    
    this.setupInstrumentalEntrance(vol, path_audio);
    this.setupTabTest(vol, path_audio);
    
    // create Conductor and start it
    this.conductor = new Sup.Audio.Conductor(
      this.params_instrumentalEntrance.bpm,
      this.params_instrumentalEntrance.timesig,
      this.params_instrumentalEntrance.players);
    this.conductor.setLogOutput(this.logOutput);
    this.conductor.start(); // start playing!
    this.phrase = "instrumental entrance";
    Sup.log(this.conductor);
    
  
    // activate keys for second cycle regardless of action
    let conductor = this.conductor;
    this.conductor.scheduleEvent(this.conductor.getMillisecondsLeftUntilNextDownbeat()-100, function() {
      conductor.activatePlayer("keys");
      Sup.log("keys activated for next cycle");
    });
    
    // testing getMillisecondsLeftUntilNextDownbeat()
    let ms = this.conductor.getMillisecondsLeftUntilNextDownbeat();
    this.conductor.scheduleEvent(ms, function() {
      Sup.log("next downbeat should be HERE!");
    });

    // cello fade constants
    this.celloFadeVolMax = 1.0;
    this.celloFadeVolMin = 0.0;
    
    // player stuff
    this.playerPreviouslyCouldJump = true;
    this.playerWasJumping = false;
    
    // sections
    this.drumsAndBassHaveEntered = false;
    this.bridgeInstsHaveEntered = false;
    
    this.transitioning = false;
    
    this.npcHasSung = false;
    this.cyclesSinceNpcHasSung = 0;
    
    this.bridgePlayersActiveStatuses = [false, false, false, false];
    
    this.chorusActive = false;
    this.chorusHasBegun = false;
  }

  update() {
    if (this.chorusActive) {
      // do chorus stuff      
      if (!this.chorusHasBegun) {
        // shut up everyone
        let b = this;
        this.conductor.fadeAllPlayers(0, 100);
        
        // for some reason this.conductor.stop() makes the riff double-trigger on start(), so we
        // just fade out and back in for now..
        
        // this.conductor.deactivateAllPlayers();
        // this.conductor.resetAllPlayers();
        // this.conductor.stop();
        
        // this.conductor.scheduleEvent(200, function() {
        //     b.conductor.stop();
        //     // b.conductor = new Sup.Audio.Conductor(
        //     //   b.params_instrumentalEntrance.bpm,
        //     //   b.params_instrumentalEntrance.timesig,
        //     //   b.params_instrumentalEntrance.players);
        //     // b.conductor.setLogOutput(b.logOutput);
        // });
        
        // start chorus
        let chorusPlayer = Sup.Audio.playSound("Audio/Chorus/chorus_all.mp3", this.vol * 1.0); // bein lazy here

        // schedule subtitles
        // using absolute time so we don't need to do the whole t = ...
        let subs = Sup.getActor("Subtitles").getBehavior(SubtitlesBehavior);
        subs.scheduleText("", 0);
        // let t = 0;
        // subs.scheduleText("What if the cycle of refraction \n and recognition never ends?", 1);
        // subs.scheduleText("", 4);
        // subs.scheduleText("What if I never wake from \n this runaway reverie?", 8);

        subs.scheduleText("What if I find acres \n of an old illusion?", 16.65);
        subs.scheduleText("What if I run into a wall?", 20.75);
        subs.scheduleText("What if we could sing till \n the world is using us...", 24.65);
        subs.scheduleText("... to break its \n whirlwind fall?", 28.5);
        subs.scheduleText("", 32.0);
        
        // subs.scheduleText("What if I drove into \n the Old Pacific?", 32.75);
        // subs.scheduleText("Would you ride up \n sixteenth and call?", 36.75);
        // subs.scheduleText("But if you were waiting \n for the new Madonna...", 40.75);
        // subs.scheduleText("I would break your \n whirlwind fall...", 44.0);
        // subs.scheduleText("", 44.0);
        
        subs.scheduleText("What", 32.64);
        subs.scheduleText("if", 32.9);
        subs.scheduleText("I", 33.0);
        subs.scheduleText("drove", 33.65);
        subs.scheduleText("into", 34.0);
        subs.scheduleText("the", 34.7);
        subs.scheduleText("Old", 35.0);
        subs.scheduleText("Pacific?", 35.37);
        subs.scheduleText("", 36.2);
        
        subs.scheduleText("Would", 36.7);
        subs.scheduleText("you", 36.86);
        subs.scheduleText("ride", 37.0);
        subs.scheduleText("up", 37.7);
        subs.scheduleText("16th", 38.0);
        subs.scheduleText("17th", 38.1);
        subs.scheduleText("18th", 38.15);
        subs.scheduleText("19th", 38.2);
        subs.scheduleText("20th", 38.25);
        subs.scheduleText("21st", 38.3);
        subs.scheduleText("22nd", 38.35);
        subs.scheduleText("23rd", 38.4);
        subs.scheduleText("24th", 38.45);
        subs.scheduleText("25th", 38.5);
        subs.scheduleText("26th", 38.55);
        subs.scheduleText("27th", 38.6);
        subs.scheduleText("28th", 38.65);
        subs.scheduleText("and", 38.7);
        subs.scheduleText("call?", 39.4);
        subs.scheduleText("", 40.1);
        
        // subs.scheduleText("I'll keep waiting...", 43.0);
        // subs.scheduleText("", 45.0);

        
        this.conductor.scheduleEvent(32000, function() {
          Sup.getActor("Subtitles").getBehavior(SubtitlesBehavior).beginChorusFade = true;
        });
        
        // decrease player velocity in case the velocity check doesn't occur in time
        this.conductor.scheduleEvent(47000, function() {
          Sup.getActor("Player").getBehavior(CharacterBehavior).chorusDecreasingVel = true;
          b.conductor.fadePlayer("bridge_keys", b.vol, 100);
        });
        
        // schedule chorus OFF
        // let cycleMs = Sup.Audio.Conductor.calculateNextBeatTime(0, this.conductor.getBpm()) * 15 * 1000; // this.conductor.getTimesig();
        // let chorusMs = cycleMs * 38.4; // 48000?
        let chorusMs = 48000;
        // chorusMs = 2000; // testing
        Sup.log("chorusMs = " + chorusMs);
        this.conductor.scheduleEvent(chorusMs, function() {
          Sup.log("chorus OFF!");
          // chorusPlayer.stop();
          
          // handle this conductor
          // b.conductor.start();
          b.conductor.fadePlayer("riff", b.vol, 250);
          b.chorusActive = false;
          b.chorusHasBegun = false;
          
          // handle subtitles
          subs.beginChorusFade = false;
          b.conductor.scheduleEvent(1000, function() {
            subs.playerHasMoved = false;
            subs.playerHasEnteredSection3 = false;
          });
          subs.scheduleText("", 0);
        });
        
        // settings
        this.bridgePlayersActiveStatuses = [false, false, false, false];
        this.chorusHasBegun = true;
      }
      
      // chimeagain
      if (Sup.Input.wasKeyJustPressed("ANY")) {
        let beatNum = this.conductor.getBeatNum(); // % 12 for fibonaccization
        this.pickChimeagain(beatNum);
      }
      
      // skip the below
      return;
    }
    
    let playerActor = Sup.getActor("Player");
    let playerPosition = playerActor.cannonBody.body.position;
    let playerIsMoving = playerActor["__behaviors"]["CharacterBehavior"][0].isMoving;
    this.playerPreviouslyCouldJump = playerActor["__behaviors"]["CharacterBehavior"][0].canJump;
    let playerIsJumping = playerActor["__behaviors"]["CharacterBehavior"][0].isJumping;

    // current section
    this.updateCurrentSection();
    
    // location-based adjustments
    if (playerActor.getBehavior(CharacterBehavior).isDreaming) {
      
      // switch to tab section
      if (this.phrase != "tab test") {
        this.conductor.setNextParams(this.params_tabTest);
        this.conductor.setToNext(true);
        this.conductor.setTransition(true);
        this.conductor.setLogOutput(this.logOutput);
        
        // phrase naming
        this.phrase = "tab test";
        Sup.log("transitioned to " + this.phrase);
        
        // deactivate/mute players
        this.params_tabTest.players["stretch"].setVolume(0);
        this.conductor.fadePlayer("vox", 0, this.conductor.getMillisecondsLeftUntilNextTransitionBeat());
        
        // let musicConductorBehavior = this;
        // this.transitioning = true;
        // Sup.setTimeout(this.conductor.getMillisecondsLeftUntilNextTransitionBeat(), function() {
        //   musicConductorBehavior.phrase = "tab test";
        //   musicConductorBehavior.transitioning = false;
        //   Sup.log("transitioned to " + musicConductorBehavior.phrase);
        // });
        
        
        // // activate rev for cycle after next one
        // let conductor = this.conductor;
        // let timeoutMs = conductor.getMillisecondsLeftUntilNextDownbeat(this.params_instrumentalEntrance.bpm)-100; // make sure you use the right bpm!!
        // Sup.log("timeoutMs: " + timeoutMs);
        // Sup.setTimeout(timeoutMs, function() { 
        //   conductor.activatePlayer("rev");
        //   Sup.log("rev activated for next cycle");
        // });
      }
    }
    else {
      // switch to instrumental entrance
      if (this.phrase != "instrumental entrance") {
        this.conductor.setNextParams(this.params_instrumentalEntrance);
        this.conductor.setToNext(true);
        this.conductor.setTransition(true);
        this.conductor.setLogOutput(this.logOutput);
        
        // phrase naming
        this.phrase = "instrumental entrance";
        Sup.log("transitioned to " + this.phrase);

        // reset so npc can sing again
        this.npcHasSung = false;
        this.cyclesSinceNpcHasSung = 0;
        Sup.log("npcHasSung reset");
        
        // let musicConductorBehavior = this;
        // this.transitioning = true;
        // Sup.setTimeout(this.conductor.getMillisecondsLeftUntilNextTransitionBeat(), function() {
        //   musicConductorBehavior.phrase = "instrumental entrance";
        //   musicConductorBehavior.transitioning = false;
        //   Sup.log("transitioned to " + musicConductorBehavior.phrase);
        // });
        
        // deactivate players
        Sup.log(this.params_instrumentalEntrance);
        this.params_instrumentalEntrance.players["keys"].deactivate();
        // this.params_instrumentalEntrance.players["rev"].deactivate();
        this.params_instrumentalEntrance.players["vox"].deactivate();
        this.params_instrumentalEntrance.players["vox"].fade(this.vol * 0.75, 250);
        this.params_instrumentalEntrance.players["vox"].reset();
        
        // reactivate keys for cycle after next one
        let timeoutMs = this.conductor.getMillisecondsLeftUntilNextDownbeat(this.params_instrumentalEntrance.bpm) + 250; // make sure you use the right bpm!!
        let conductor = this.conductor;
        Sup.log("timeoutMs: " + timeoutMs);
        this.conductor.scheduleEvent(timeoutMs, function() { 
          conductor.activatePlayer("keys");
          Sup.log("keys activated for next cycle");
        });
        
        Sup.log("activating stretch");
        this.conductor.activatePlayer("stretch");
        this.conductor.fadePlayer("stretch", this.vol * 2, this.conductor.getMillisecondsLeftUntilNextTransitionBeat());
        Sup.log(this.conductor.getMillisecondsLeftUntilNextTransitionBeat() + "ms");
      }
    }
    
    // movement-based adjustments
    if (this.phrase == "instrumental entrance") {
      if (playerIsMoving) {
        // cello fade in (manual)
        let cello = this.conductor.getPlayer("cello");
        if (cello && (cello.getVolume() < this.celloFadeVolMax)) {
          cello.setVolume(cello.getVolume() + 0.01);
        }
      }
      else {
        // cello fade out (manual)
        let cello = this.conductor.getPlayer("cello");
        if (cello && (cello.getVolume() > this.celloFadeVolMin)) {
          cello.setVolume(cello.getVolume() - 0.01);
        }
      }
      
      
      // jump -> chimeagain
      // use wchoose to pick consonant notes according to harmony      
      if ((!this.playerWasJumping && playerIsJumping) || Sup.Input.wasKeyJustPressed("SPACE")) {
        let beatNum = this.conductor.getBeatNum();
        this.pickChimeagain(beatNum);
      }
      
      
      // section-based instrumental adjustments
      
      // drums n bass
      if (this.currentSection > 0 && this.currentSection < 5) {
        // activate bass and fade-in drums if they haven't entered before
        if (!this.drumsAndBassHaveEntered) { 
          // bass
          this.conductor.activatePlayer("bass");
          Sup.log("player has moved; activating bass for the next cycle");
          this.drumsAndBassHaveEntered = true;

          // drums
          this.conductor.fadePlayer("drums", this.vol, 250);
          Sup.log("fading drums in");
        }
      }
      else {
        // deactivate n fade out
        this.conductor.deactivatePlayer("bass");
        this.conductor.fadePlayer("drums", 0, 250);
        this.drumsAndBassHaveEntered = false;
      }
      if (this.currentSection == 3) {
        this.conductor.fadePlayer("drums_overdub", this.vol, 250);
      }
      else if (this.currentSection != 4) {
        this.conductor.fadePlayer("drums_overdub", 0, 250);
      }
      
      // verse 2
      if (this.currentSection == 4) {
        // start singing
        if (!this.verse2NpcHasSung) {
          this.conductor.fadePlayer("verse2_vox", this.vol, 250);
          this.conductor.activatePlayer("verse2_vox");
          this.verse2NpcHasSung = true;
        
          // fade bridge players
          this.conductor.fadePlayers(["bridge_synth", "bridge_chip", "bridge_cello", "bridge_keys", "bridge_chopvox"], 0, 250);

          // fade/deactivate conflicting insts from other sections
          this.conductor.deactivatePlayer("cello");
          // this.conductor.deactivatePlayer("drums_overdub");
          // this.conductor.fadePlayer("drums_overdub", 0, 100);
          
        }
        
        // background instrumental
        let instGroupNames = [
          ["verse2_blakiesoph"], // 1
          ["riff", "drums", "drums_overdub", "rev", "bass", "keys"], // 2
          ["verse2_orchestral"] // 3
        ];
        
        // get the selected npc
        let npcs = [Sup.getActor("Verse 2 NPC 1"), Sup.getActor("Verse 2 NPC 2"), Sup.getActor("Verse 2 NPC 3")];
        let selectedNpcIdx = this.verse2SelectedNpcIdx;
        for (let i in npcs) {
          let npc = npcs[i];
          if (npc.getBehavior(NPCBehavior).selected) {
            selectedNpcIdx = Number(i);
            break;
          }
        }
        
        // apply transition if necessary
        if (selectedNpcIdx != this.verse2SelectedNpcIdx) {
          let fadeLength = 100;
          for (let i in instGroupNames) {
            if (Number(i) == selectedNpcIdx) {
              this.conductor.fadePlayers(instGroupNames[i], this.vol, fadeLength);
            }
            else {
              this.conductor.fadePlayers(instGroupNames[i], 0, fadeLength);
            }
          }
          
          // this.conductor.fadePlayers(instGroupNames[this.verse2SelectedNpcIdx], 0, fadeLength);
          // this.conductor.fadePlayers(instGroupNames[selectedNpcIdx], this.vol, fadeLength);
          
          this.verse2SelectedNpcIdx = selectedNpcIdx;
        }
        
        
      }
      // bridge
      else if (this.currentSection == 5) {
        if (!this.bridgeInstsHaveEntered) {
          this.conductor.fadePlayers(["riff", "drums", "drums_overdub", "rev", "vox", "verse2_blakiesoph", "verse2_orchestral", "verse2_vox"], 0, 250);
          this.conductor.deactivatePlayers(["keys", "bass", "cello"]);
          this.conductor.fadePlayer("bridge_keys", this.vol, 250);
          
          let b = this;
          this.conductor.scheduleEvent(250, function() { // a bit of a time buf
            b.bridgeInstsHaveEntered = true;
            Sup.log("bridge instruments entered!");
          });
        }
        
        // switcheroo segment
        let playerQuadrant = playerActor.getBehavior(CharacterBehavior).currentQuadrant;
        switch (playerQuadrant) {
          case 1:
            //this.conductor.activatePlayer("bridge_chip");
            this.conductor.fadePlayer("bridge_chip", this.vol * 0.65, 100);
            break;
          case 2:
            this.conductor.fadePlayer("bridge_synth", this.vol, 250);
            break;
          case 3:
            this.conductor.fadePlayer("bridge_cello", this.vol, 250);
            break;
          case 4:
            this.conductor.fadePlayer("bridge_chopvox", this.vol, 250);
            break;
        }
        this.bridgePlayersActiveStatuses[playerQuadrant-1] = true;
        let allBridgePlayersActive = true;
        let numBridgePlayersActive = 0;
        for (let active of this.bridgePlayersActiveStatuses) {
          if (!active) {
            allBridgePlayersActive = false;
            // break;
          }
          else {
            numBridgePlayersActive++;
          }
        }
        
        setSubtitles(this.bridgeSubtitles[numBridgePlayersActive-1]);
        
        if (allBridgePlayersActive) {
          let b = this;
          let numBeatsToWait = 6;
          let beatMs = Sup.Audio.Conductor.calculateNextBeatTime(0, this.conductor.getBpm()) * 1000;
          let waitMs = this.conductor.getMillisecondsLeftUntilNextTransitionBeat() + (beatMs * numBeatsToWait); // 6 beats
          waitMs = this.conductor.getMillisecondsLeftUntilNextDownbeat(); // beginning of next cycle
          this.conductor.scheduleEvent(waitMs, function() {
            b.chorusActive = true;
          });
        }
        
      }
      else {
        let rescheduleResets = false; // testing/debugging; when false it sometimes the applied changes don't go through
        
        if (rescheduleResets || this.verse2NpcHasSung) {
          // fade out verse 2 vocals
          this.conductor.fadePlayer("verse2_vox", 0, 250);
          Sup.log("fading verse2_vox out");

          // fade out verse 2 insts
          this.conductor.fadePlayers(["verse2_blakiesoph", "verse2_orchestral"], 0, 250);

          // reset verse 2 properties
          this.verse2NpcHasSung = false;
        }
        
        // fade out bridge players
        if (rescheduleResets || this.bridgeInstsHaveEntered) {
          Sup.log("fading out bridge players");
          this.conductor.fadePlayers(["bridge_synth", "bridge_chip", "bridge_cello", /*"bridge_keys",*/ "bridge_chopvox"], 0, 250);
          // this.conductor.fadePlayer("bridge_chip", 0, 250);

          // reset bridge props
          this.bridgeInstsHaveEntered = false;
          this.bridgePlayersActiveStatuses = [false, false, false, false];
        }

        // fade in players for other sections
        if (this.conductor.getPlayer("riff") && this.conductor.getPlayer("riff").getVolume() < this.vol) {
          this.conductor.fadePlayer("riff", this.vol, 250);
          this.conductor.activatePlayer("cello");
        }
      }
      
      
      // chorus!!
      if (this.currentSection == 6) {
        // this.chorusActive = true;
      }
      
    }
    else if (this.phrase == "tab test") {
      if (playerIsMoving) {
        // rev fade in (manual)
        let rev = this.conductor.getPlayer("rev");
        if (rev && (rev.getVolume() < this.celloFadeVolMax)) {
          rev.setVolume(rev.getVolume() + 0.01);
          // Sup.log(rev.getVolume());
        }
      }
      else {
        // rev fade out (manual)
        let rev = this.conductor.getPlayer("rev");
        if (rev && (rev.getVolume() > this.celloFadeVolMin)) {
          rev.setVolume(rev.getVolume() - 0.01);
        }
      }
    }
    
    this.playerWasJumping = playerIsJumping;
    
    
    
    // verse 1 NPC vocalist
    if (this.phrase == "instrumental entrance" && !this.conductor.isTransitioning()) {
      let npc = Sup.getActor("NPC Vocalist");
      if (npc["__behaviors"]["NPCBehavior"][0].readyToSing) {
        
        if (!this.npcHasSung) {
          this.npcHasSung = true;
          let conductor = this.conductor;
          
          Sup.log("npc is singing");
          
          // start singing
          this.conductor.fadePlayer("vox", this.vol, 250);
          this.conductor.activatePlayer("vox");
          
          // // we only let vox play once
          // this.conductor.scheduleEvent(this.conductor.getMillisecondsLeftUntilNextDownbeat() * 1.5, function() {
          //   conductor.deactivatePlayer("vox"); 
          //   Sup.log("deactivated vox");
          // });

          // trigger manually because the phrase is longer than the section's phrase length
          //let vox = this.verseVocals;
          let ms = this.conductor.getMillisecondsLeftUntilNextDownbeat(); // 100ms offset?
          let cycleMs = Sup.Audio.Conductor.calculateNextBeatTime(0, this.conductor.getBpm()) * 15 * 1000; // this.conductor.getTimesig();
          Sup.log("cycleMs: " + cycleMs);
          
          // timeout leads to unreliable performance timing
          // Sup.setTimeout(ms, function() {
          //   vox.play();
          // });
          
          // this.conductor.scheduleEvent(ms, function() {
          //   vox.play();
          //   Sup.log("playing vox!");
          // });
          
          // lock player movement for n cycles regardless of current place
          this.playerMovementLock = true;
          Sup.log("locking player movement");
          let lockMs = cycleMs * 0.9;
          let mcb = this;
          this.conductor.scheduleEvent(lockMs, function() {
            mcb.playerMovementLock = false; // closureee
            // mcb.cyclesSinceNpcHasSung = 2;
            Sup.log("unlocking player movement");
          });
          
          // activate rev after vox are done
          let revMs = cycleMs*3 + ms;
          // let revMs = ms;
          this.conductor.scheduleEvent(revMs, function() {
            conductor.activatePlayer("rev");
            Sup.log("activating rev");
          });
          
          // deactivate/fade-out vox after 4 cycles
          let deactivateMs = cycleMs*4 + ms;
          this.conductor.scheduleEvent(deactivateMs, function() {
            // conductor.deactivatePlayer("vox");
            // if (conductor.getPlayer("vox")) {
            //   conductor.getPlayer("vox").playTail(0);
            //   conductor.getPlayer("vox").reset();
            // }
            // Sup.log("deactivatin vox");
            
            conductor.fadePlayer("vox", 0, 50);
            Sup.log("fading vox out"); // TODO: figure out whether we want verse 1 to be reactivatable, and if so, how
          });
          
          Sup.log("ms: " + ms);
        }
        else {
          // Sup.log("sorry, npc already sang)");
        }
      }
    }
    
  }

  pickChimeagain(beatNum) {
    let note = "d";

    beatNum = beatNum + 1; // offset for anticipations

    if (beatNum < 4) { // D chord
      note = wchoose(["f#", "d"], [0.75, 0.25]);
    }
    else if (beatNum < 7) { // G chord
      note = wchoose(["g", "d"], [1.0, 0.0]);
    }
    else if (beatNum < 11) { // D chord
      note = wchoose(["d", "f#"], [0.75, 0.25]);
    }
    else if (beatNum < 14) { // A chord
      note = "e";
    }

    this.chimeagain[note].stop();
    this.chimeagain[note].play();
  }

  // create MultiSoundPlayers for instrumental entrance
  setupInstrumentalEntrance(vol, path_audio) {    
    // riff
    let inst = "riff";
    let path_instrumentalEntrance = path_audio + "Instrumental Entrance/";
    let tail_riff = path_instrumentalEntrance+"tail " + inst + ".mp3";
    let msp_riff = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3",
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      {
        0: tail_riff, // <- passing in tail(s) as object; here we're being lazy by using the same tail sample for each beat
        4: tail_riff,
        7: tail_riff,
        11: tail_riff,
        14: tail_riff
      },
      vol,
      {logOutput: this.logOutput}
    );
    // Sup.log(msp_riff);
    
    // rev(ersed guitar)
    inst = "reversed";
    let msp_rev = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      vol,
      {active: false, logOutput: this.logOutput}
    );

    // drums
    inst = "drums - dub remix kit";
    let msp_drums = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3", // <- note that init and loop are two diff audio phrases!
      path_instrumentalEntrance+"tail " + inst + ".mp3", // <- passing in single tail as string; available for all beats
      0,
      {active: true, logOutput: this.logOutput} // note we initialize it to be active but with a volume of 0, so muted
    );
    
    // drums
    inst = "drums - overdub";
    let msp_drums_overdub = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // bass
    inst = "bass - cypress";
    let msp_bass = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + "bass_freeze" + ".mp3",
      vol,
      {active: false, logOutput: this.logOutput}
    );
    
    // cello
    inst = "cello freeze";
    let tail_cello = path_instrumentalEntrance+"tail " + inst + ".mp3";
    let msp_cello = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      {0: tail_cello}, // <- we only want this tail to happen on beat 0, not all beats
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // keys
    inst = "5-EZkeys";
    let msp_keys = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      vol * 1.5,
      {active: false, logOutput: this.logOutput}
    );
    
    // verse 2 - blakiesoph
    inst = "verse2_inst_blakiesoph";
    let msp_verse2_blakiesoph = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, loop: true, logOutput: this.logOutput}
    );
    
    // verse 2 - orchestral
    inst = "verse2_inst_orchestral";
    let msp_verse2_orchestral = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, loop: true, logOutput: this.logOutput}
    );
    
    // bridge - synth
    inst = "1 bridge synth freeze";
    let msp_bridge_synth = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // bridge - chip
    inst = "2 bridge chip freeze";
    let msp_bridge_chip = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // bridge - cello
    inst = "3 bridge cello freeze";
    let msp_bridge_cello = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // bridge - keys
    inst = "4 bridge keys freeze";
    let msp_bridge_keys = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // bridge - chop vox
    inst = "5 bridge chop vox freeze";
    let msp_bridge_chopvox = new Sup.Audio.MultiSoundPlayer(
      path_instrumentalEntrance+"init " + inst + ".mp3", 
      path_instrumentalEntrance+"loop " + inst + ".mp3",
      path_instrumentalEntrance+"tail " + inst + ".mp3",
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    // verse 1 vox
    let path_vox = path_audio + "Vox/" + "vox_verse1.mp3";
    let msp_vox = new Sup.Audio.MultiSoundPlayer(
      path_vox,
      path_vox,
      path_audio + "Tabs/" + "tail stretch.mp3",
      vol * 0.75,
      {
        loop: true, // to prevent retriggering each cycle, since the vocal phrase is longer than a cycle
        active: false,
        logOutput: this.logOutput
      }
    );
    // this.verseVocals = new Sup.Audio.SoundPlayer(path_vox, vol);
    // this.verse2Vocals = new Sup.Audio.SoundPlayer(path_vox, vol);
    
    // verse 2 vox
    let path_verse2_vox = path_audio + "Vox/" + "vox_verse2.mp3";
    let msp_verse2_vox = new Sup.Audio.MultiSoundPlayer(
      path_verse2_vox,
      path_verse2_vox,
      path_audio + "Tabs/" + "tail stretch.mp3",
      0,
      {
        loop: true, // to prevent retriggering each cycle, since the vocal phrase is longer than a cycle
        active: true,
        logOutput: this.logOutput
      }
    );
    
    
    // Single note samples (using SoundPlayers)
    let chimeagainvol = vol * 0.5;
    this.chimeagain = {
      "f#": new Sup.Audio.SoundPlayer(path_audio+"Instrumental Entrance/"+"chimeagain_fsharp.mp3", chimeagainvol),
      "g": new Sup.Audio.SoundPlayer(path_audio+"Instrumental Entrance/"+"chimeagain_g.mp3", chimeagainvol),
      "d": new Sup.Audio.SoundPlayer(path_audio+"Instrumental Entrance/"+"chimeagain_d.mp3", chimeagainvol),
      "e": new Sup.Audio.SoundPlayer(path_audio+"Instrumental Entrance/"+"chimeagain_e.mp3", chimeagainvol)
    };
    
    // Create the params object
    this.params_instrumentalEntrance = {
      bpm: 180,
      timesig: 15,
      players: {
        "riff": msp_riff,
        "drums": msp_drums,
        "drums_overdub": msp_drums_overdub,
        "rev": msp_rev,
        "bass": msp_bass,
        "cello": msp_cello,
        "keys": msp_keys,
        "vox": msp_vox,
        "verse2_vox": msp_verse2_vox,
        "verse2_blakiesoph": msp_verse2_blakiesoph,
        "verse2_orchestral": msp_verse2_orchestral,
        "bridge_synth": msp_bridge_synth,
        "bridge_chip": msp_bridge_chip,
        "bridge_cello": msp_bridge_cello,
        "bridge_keys": msp_bridge_keys,
        "bridge_chopvox": msp_bridge_chopvox,
      }
    };
  }

  // create MultiSoundPlayers for tabs (dream) section
  setupTabTest(vol, path_audio) {
    let tail_tabguitar = path_audio + "Tabs/" + "tail guitar.mp3";
    let msp_tabguitar = new Sup.Audio.MultiSoundPlayer(
      path_audio + "Tabs/" + "init guitar.mp3",
      path_audio + "Tabs/" + "loop guitar.mp3",
      {
        0: tail_tabguitar,
        8: tail_tabguitar,
        16: tail_tabguitar,
        25: tail_tabguitar
      },
      vol,
      {logOutput: this.logOutput}
    );

    let msp_tabrev = new Sup.Audio.MultiSoundPlayer(
      path_audio + "Tabs/" + "init guitar rev.mp3",
      path_audio + "Tabs/" + "loop guitar rev.mp3",
      {
        0: path_audio + "Tabs/" + "tail guitar rev.mp3"
      },
      0,
      {active: true, logOutput: this.logOutput}
    );
    
    let msp_stretch = new Sup.Audio.MultiSoundPlayer(
      path_audio + "Tabs/" + "initAndLoop stretch.mp3",
      path_audio + "Tabs/" + "initAndLoop stretch.mp3",
      {
        0: path_audio + "Tabs/" + "tail stretch.mp3"
      },
      0,
      {active: true, logOutput: this.logOutput}
    );

    // params to set as conductor's nextParams
    this.params_tabTest = {
      bpm: 112,
      timesig: 34,
      players: {
        "guitar": msp_tabguitar,
        "rev": msp_tabrev,
        "stretch": msp_stretch
      }
    };
    Sup.log(this.params_tabTest);
  }
  
  /*
  // setup MSPs for next part of dreamsong
  setupTabularasaDreamsong(vol, path_audio, section) {
    let path_tabularasa = path_audio + "Tabularasa Dreamsong " + section + "/";
    let inst = "guitar";
    let tail_guitar = path_tabularasa + "tail " + inst + ".mp3";
    let msp_guitar = new Sup.Audio.MultiSoundPlayer(
      path_tabularasa + "init " + inst + ".mp3",
      path_tabularasa + "loop " + inst + ".mp3",
      {
        0: tail_guitar,
        8: tail_guitar,
        16: tail_guitar,
        25: tail_guitar
      },
      vol,
      {logOutput: this.logOutput}
    );
    
    this.params_tabularasa_a = {
      bpm: 100,
      timesig: 15*4,
      players: {
        "guitar": msp_guitar
      }
    };
    
  }
  */

  // this is slightly different from "phrase", since this determines section withIN the main phrase
  updateCurrentSection() {
    let playerActor = Sup.getActor("Player");
    let playerPosition = playerActor.cannonBody.body.position;
    let playerY = playerPosition.y;
    
    if (playerY >= 600) {      // intro
      this.currentSection = 0;
    }
    else if (playerY >= 500) { // bass + drums
      this.currentSection = 1;
    }
    else if (playerY >= 400) { // verse 1
      this.currentSection = 2;
    }
    else if (playerY >= 300) { // ...
      this.currentSection = 3;
    }
    else if (playerY >= 200) { // verse 2
      this.currentSection = 4;
    }
    else if (playerY >= 100) { // bridge
      this.currentSection = 5;
    }
    else {                     // chorus
      this.currentSection = 6;
    }
  }
}
Sup.registerBehavior(MusicConductorBehavior);
