class AmbientMarkovMusicBehavior extends Sup.Behavior {
  
  // Note possibilities, probabilities, and samples. Markov chain implementation
  private notes = {
    "DLow": {
      "next": {
        "notes": ["A", "DHigh"],
        "probs": [0.5, 0.5]
      },
      "numSamples": 3
    },
    "A": {
      "next": {
        "notes": ["AToB", "DHigh"],
        "probs": [0.5, 0.5]
      },
      "numSamples": 3
    },
    "AToB": {
      "next": {
        "notes": ["A", "BToA", "DHigh"],
        "probs": [0.5, 0.25, 0.25]
      },
      "numSamples": 2
    },
    "BToA": {
      "next": {
        "notes": ["DLow", "DHigh"],
        "probs": [0.5, 0.5]
      },
      "numSamples": 2
    },
    "DHigh": {
      "next": {
        "notes": ["DLow", "A", "BToA"],
        "probs": [0.6, 0.2, 0.2]
      },
      "numSamples": 3
    }
  };

  // Keeping track of previous values and thresholds for consecutives
  private prevNote: string;
  private consecutiveNotes = 0;
  private maxConsecutiveNotes = 2;
  private consecutiveRests = 0;
  private maxConsecutiveRests = 3;

  // timing
  private time = 0;
  private period = 80;
  
  awake() {
    let startingNote = "DLow";
    let startingSample = AmbientMarkovMusicBehavior.constructFullSampleName(startingNote, this.notes[startingNote]["numSamples"]);
    this.prevNote = startingNote;
    
    Sup.Audio.playSound("Audio/Guitar Intro/" + startingSample + ".mp3");
    Sup.log(startingSample);
    this.consecutiveNotes++;
  }

  update() {
    this.time += 1;
    let playNote = wchoose([true, false], [0.4, 0.6]);
    let playerIsMoving = Sup.getActor("Player")["__behaviors"]["CharacterBehavior"][0].isMoving;
    
    // adjust params based on whether player is in motion
    if (playerIsMoving) {
      this.maxConsecutiveNotes = 3;
      this.maxConsecutiveRests = 2;
      this.period = 60;
      playNote = !playNote; // basically reverse the probs
      
      // TODO: do some stuff with reversed/crunchy sounds
      
    }
    else {
      this.maxConsecutiveNotes = 2;
      this.maxConsecutiveRests = 3;
      this.period = 80;
    }
    // Sup.log(playerIsMoving);

    // calculate note performance at the given interval    
    if (this.time % this.period == 0) {
      
      // deal with thresholds for consecutive notes/rests
      // the notes threshold takes precedence as it appears first
      if (this.consecutiveNotes >= this.maxConsecutiveNotes) {
        playNote = false;
        this.consecutiveNotes = 0;
      }
      else if (this.consecutiveRests >= this.maxConsecutiveRests) {
        playNote = true;
        this.consecutiveRests = 0;
      }
      
      // play the note if conditions are met
      if (playNote) {
        let next = this.notes[this.prevNote]["next"];
        let noteChoices = next["notes"];
        let noteProbs = next["probs"];
        let note = wchoose(noteChoices, noteProbs);
        let sample = AmbientMarkovMusicBehavior.constructFullSampleName(note, this.notes[note]["numSamples"]);

        // update prev values
        this.prevNote = note;
        this.consecutiveNotes++;
        this.consecutiveRests = 0;

        // play the note
        let samplePath = "Audio/Guitar Intro/" + sample + ".mp3";
        Sup.Audio.playSound(samplePath);
        Sup.log(this.time + ", " + sample + ", " + this.consecutiveNotes);
      }
      else {
        this.consecutiveRests++;
        this.consecutiveNotes = 0;
      }
    }
  }

  // Pick a sample number and concatenate it to the base sample name
  public static constructFullSampleName(sampleName, numSamples):string {
    let sampleNumber = Math.floor(Math.random()*numSamples);
    return sampleName + numSamples.toString();
  }
}
Sup.registerBehavior(AmbientMarkovMusicBehavior);
