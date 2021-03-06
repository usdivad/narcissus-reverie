class SubtitlesBehavior extends Sup.Behavior {
  // private offset: Sup.Math.Vector3 = new Sup.Math.Vector3(0, -15, -8); // for cameraman
  private offset: Sup.Math.Vector3 = new Sup.Math.Vector3(0, 18, 0); // for player
  private evtMul: number = 1000;
  private conductor: Sup.Audio.Conductor;

  playerHasMoved: boolean = false;
  playerHasEnteredSection3: boolean = false;
  beginChorusFade: boolean = false;

  awake() {
    // init params
    this.conductor = new Sup.Audio.Conductor(120, 4, []);
    
    // schedule text events
    let t = 0;
    t = this.scheduleText("A body's motion stems from \n keys of arrows and spaces.", t + 0);
    
    this.update();
  }

  update() {
    // set position
    let p = Sup.getActor("Player").cannonBody.body.position;
    let inChorus = Sup.getActor("Player").getBehavior(CharacterBehavior).isInChorus;
    let posX = p.x + this.offset.x;
    let posY = p.y + this.offset.y;
    let posZ = p.z + this.offset.z;
    if (inChorus) {
      posY = p.y - this.offset.y/2;
    }
    this.actor.setPosition(posX, posY, posZ);
    
    // schedule text events
    if (!this.playerHasMoved) {
      if (Sup.getActor("Player").getBehavior(CharacterBehavior).isMoving) {
        this.playerHasMoved = true;
        let t = 0;
        t = this.scheduleText("Were I to wake from this \n runaway reverie...", t + 0);
        t = this.scheduleText("... no unfractured radiance \n would shine from the stars.", t + 4);
        t = this.scheduleText("", t + 4);
      }
    }
    
    if (!this.playerHasEnteredSection3) {
      if (Sup.getActor("Music Conductor").getBehavior(MusicConductorBehavior).currentSection == 3) {
        this.playerHasEnteredSection3 = true;
        let t = 0;
        t = this.scheduleText("Silence rings from towers \n to unsailed seas...", t + 1.5);
        t = this.scheduleText("... no solace to be taken \n from the crossroads afar.", t + 4);
        t = this.scheduleText("", t + 4);
      }
    }
    
    // opacity (OOPS, isn't implemented in text renderer)
    // let m = this.actor.modelRenderer;
    // if (this.beginChorusFade) {
    //   if (m.getOpacity() > 0) {
    //     m.setOpacity(m.getOpacity() - 0.005);
    //   }
    // }
    // else {
    //   m.setOpacity(1);
    // }
  }

  // method to schedule a setText() for this actor's text renderer
  // see update() for an example usage of chained scheduling (ie. with t = ...)
  scheduleText(text, time) {
    // Sup.log("scheduling " + text + " for " + time);
    let subs = this;
    this.conductor.scheduleEvent(time * this.evtMul, function() {
      subs.actor.textRenderer.setText(text.replace(" \n ", "\n"));
    });
    return time;
  }
}
Sup.registerBehavior(SubtitlesBehavior);
